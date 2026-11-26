"""Playwright checks against an already-running AFCAT Command Center."""
import os
import re
from uuid import uuid4
from playwright.sync_api import expect, sync_playwright

base = os.environ.get("AFCAT_TEST_URL", "http://127.0.0.1:5173")

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=os.environ.get("AFCAT_BROWSER"))
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.set_default_timeout(10_000)
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    expect(page.get_by_role("heading", name="Welcome back, Cadet.")).to_have_count(0)
    assert page.goto(base).status == 200
    expect(page.get_by_role("heading", name="Welcome back, Cadet.")).to_be_visible()
    screenshot = os.environ.get("AFCAT_SCREENSHOT")
    if screenshot:
        page.screenshot(path=screenshot, full_page=True)

    page.get_by_role("link", name="Profile", exact=True).click()
    page.get_by_label("Name", exact=True).fill("Asha")
    page.get_by_label("Email address").fill(f"asha-{uuid4().hex}@example.test")
    page.get_by_label("Password", exact=True).fill("browser test passphrase")
    page.get_by_role("button", name="Create account", exact=True).last.click()
    expect(page.get_by_text("AFCAT 01/2027", exact=True)).to_be_attached()
    page.get_by_role("link", name="My Curriculum").click()
    expect(page.get_by_role("heading", name="Today’s schedule")).to_be_visible()
    expect(page.get_by_text("180 minutes · General Awareness only")).to_be_visible()

    page.get_by_role("link", name="Practice MCQs").click()
    page.get_by_label("Subject", exact=True).select_option("ga")
    page.get_by_label("Topic", exact=True).select_option("Indian Polity")
    page.get_by_label("Question count").fill("20")
    expect(page.get_by_role("status")).to_contain_text(re.compile(r"\d+ eligible questions"))
    expect(page.get_by_label("Practice pattern", exact=False)).to_be_visible()
    page.get_by_role("button", name="Start session").click()
    expect(page.get_by_role("heading", name="Indian Polity")).to_be_visible()
    expect(page.get_by_role("button", name=re.compile(r"Question 20, Unvisited"))).to_be_visible()
    page.locator(".option").first.click()
    page.get_by_role("button", name="Submit answer", exact=True).click()
    expect(page.get_by_role("heading", name="Explanation")).to_be_visible()
    correct = page.locator(".option.correct").first.inner_text().startswith("A")
    page.get_by_role("button", name="Bookmark question").click()
    expect(page.get_by_role("button", name="Remove bookmark")).to_be_visible()
    page.get_by_role("button", name="Submit session").click()
    page.get_by_role("button", name="Confirm submission").click()
    expect(page.get_by_role("heading", name="Session results")).to_be_visible()
    expect(page.get_by_text("3 / 60" if correct else "-1 / 60", exact=True).first).to_be_visible()
    page.get_by_role("button", name="Ask mentor").click()
    page.get_by_role("button", name="Ask mentor").click()
    expect(page.get_by_role("heading", name="Published study guidance")).to_be_visible()

    page.get_by_role("link", name="Practice MCQs").click()
    page.get_by_label("Subject", exact=True).select_option("num")
    page.get_by_label("Topic", exact=True).select_option("Time and Work")
    pattern_select = page.get_by_label("Practice pattern", exact=True)
    expect(pattern_select).to_be_visible()
    family = pattern_select.locator("option").nth(1).get_attribute("value")
    pattern_select.select_option(family)
    page.get_by_label("Question count").fill("3")
    page.get_by_role("button", name="Start session").click()
    expect(page.get_by_role("heading", name=re.compile(r"Pattern drill"))).to_be_visible()
    page.locator(".option").first.click()
    page.get_by_role("button", name="Submit answer", exact=True).click()
    page.get_by_role("button", name="Practise this pattern").click()
    expect(page.get_by_label("Practice pattern", exact=True)).to_have_value(family)
    expect(page.get_by_label("Question history", exact=False)).to_have_value("new")

    page.get_by_role("link", name="Previous-Year Papers").click()
    page.get_by_label("Year", exact=True).select_option("2019")
    page.get_by_label("Cycle", exact=True).select_option("02")
    expect(page.get_by_text(re.compile(r"AFCAT 02/2019")).first).to_be_visible()
    assert page.get_by_text(re.compile(r"AFCAT 01/2019")).count() == 0

    page.get_by_role("link", name="Full Mock Tests").click()
    page.get_by_role("button", name="Start full mock").click()
    expect(page.get_by_text("QUESTION 1 OF 100", exact=False)).to_be_visible()
    expect(page.get_by_role("heading", name="Explanation")).to_have_count(0)
    page.locator(".option").nth(2).click()
    page.get_by_role("button", name="Mark for review").click()
    expect(page.get_by_role("button", name="Marked for review")).to_be_visible()
    page.get_by_role("button", name="Save and next").click()
    expect(page.get_by_text("QUESTION 2 OF 100", exact=False)).to_be_visible()
    page.reload()
    expect(page.get_by_text("QUESTION 2 OF 100", exact=False)).to_be_visible()
    expect(page.get_by_role("button", name="Question 1, Marked")).to_be_visible()
    page.get_by_role("button", name="Previous", exact=True).click()
    expect(page.locator(".option").nth(2)).to_have_attribute("aria-pressed", "true")
    expect(page.locator(".timer")).to_contain_text(re.compile(r"(119|120):\d\d"))
    page.get_by_role("button", name="Submit session").click()
    page.get_by_role("button", name="Confirm submission").click()
    expect(page.get_by_role("heading", name="Session results")).to_be_visible()
    expect(page.get_by_role("heading", name="Explanation")).to_be_visible()
    expect(page.get_by_text("99", exact=True).first).to_be_visible()

    # Confirm the server rejects direct retrieval of seed answers and cross-site writes.
    assert page.request.get(base + "/data/awareness.json").status == 404
    assert page.request.post(base + "/api/guest", data={}, headers={"Origin": "https://example.test"}).status == 403
    assert not errors, errors

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    mobile.goto(base)
    expect(mobile.get_by_role("heading", name="Welcome back, Cadet.")).to_be_visible()
    mobile.get_by_role("button", name="Open navigation").click()
    mobile.get_by_role("link", name="Practice MCQs").click()
    expect(mobile.get_by_role("heading", name="Practice MCQs")).to_be_visible()
    assert mobile.evaluate("document.documentElement.scrollWidth === innerWidth")
    mobile.get_by_role("button", name="Use dark theme").click()
    expect(mobile.locator("html")).to_have_attribute("data-theme", "dark")
    browser.close()
    print("Desktop and mobile workflows passed.")
