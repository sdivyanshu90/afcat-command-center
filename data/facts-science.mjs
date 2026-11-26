// Original questions based on the linked reference material.
// Each group supplies a topic, syllabus subtopic, and source for its fact rows.
const group = (topic, subtopic, source, rows) =>
  rows.map(row => [topic, subtopic, ...row, source]);
const basic = (subtopic, source, rows) => group('Basic Science', subtopic, source, rows);
const environment = (subtopic, source, rows) => group('Environment and Ecology', subtopic, source, rows);
const technology = (subtopic, source, rows) => group('Science and Technology', subtopic, source, rows);
const ncert = id => 'https://ncert.nic.in/textbook/pdf/' + id + '.pdf';
const exemplar = 'https://www.ncert.nic.in/exemplar-problems.php?ln=en';
const isro = page => 'https://www.isro.gov.in/' + page;
const biology = section => 'https://openstax.org/books/biology-2e/pages/' + section;

export const science = [
  ...basic('Physics', exemplar, [
    ['Which type of mirror gives an upright, diminished image across a broad field of view in a vehicle?', 'Convex mirror', 'Concave mirror', 'Plane mirror', 'Concave lens', 'The outward-curved mirror diverges reflected rays and gives a smaller upright image, so the driver can see a wider area.'],
    ['Which device converges parallel rays of light that pass through it in air?', 'Convex lens', 'Concave lens', 'Convex mirror', 'Plane mirror', 'A convex lens refracts incoming parallel rays toward its principal focus. A mirror reflects rays instead of letting them pass through.'],
    ['When a ray travels obliquely from air into ordinary glass, which quantity stays the same at the boundary?', 'Frequency', 'Speed', 'Wavelength', 'Direction of travel', 'The oscillations on both sides match in frequency at the interface. Light slows down in glass, so its wavelength decreases as it refracts.'],
    ['Which lens corrects difficulty seeing distant objects caused by myopia?', 'Diverging lens', 'Converging lens', 'Plano-convex lens', 'Bifocal lens with only converging sections', 'In myopia, distant rays focus before reaching the retina. A diverging lens spreads them before entry, moving the focus back to the retina.'],
    ['Which effect makes shorter visible wavelengths scatter more readily than red light in clear, clean air?', 'Rayleigh scattering', 'Total internal reflection', 'Specular reflection', 'Dispersion in a prism', 'In clear air, scattering by molecules is much stronger at shorter wavelengths, which helps explain the blue daytime sky.'],
    ['A fixed resistor has its potential difference doubled at constant temperature. How does its current change?', 'It doubles', 'It halves', 'It quadruples', 'It stays unchanged', 'Ohm’s law gives I = V/R. If resistance is fixed, doubling the voltage doubles the current.'],
    ['Which quantity is identical through each component in a single closed loop with two resistors in series?', 'Electric current', 'Voltage across the component', 'Power dissipated by the component', 'Resistance of the component', 'Charge has only one path in a series connection, so the current is common even when component voltage drops differ.'],
    ['Which quantity is identical across two resistors connected in parallel between the same pair of circuit nodes?', 'Potential difference', 'Branch current', 'Branch resistance', 'Branch power', 'Each branch starts and ends at the same two electrical potentials, so both resistors have the same voltage across them.'],
    ['What is the SI unit of electrical resistance?', 'Ohm', 'Volt', 'Ampere', 'Watt', 'Resistance equals potential difference divided by current. One ohm is one volt per ampere.'],
    ['Which instrument is placed in parallel with a resistor to measure its voltage drop?', 'Voltmeter', 'Ammeter', 'Watt-hour meter', 'Rheostat', 'A voltmeter compares the potentials at the two terminals, so it connects across the resistor in parallel.'],
    ['What is the magnetic field-line pattern around a long straight wire carrying steady current?', 'Concentric circles around the wire', 'Straight lines parallel to the wire', 'Straight rays pointing away from the wire', 'Concentric ellipses aligned along the wire', 'Magnetic field lines circle the conductor. The right-hand thumb rule relates circulation direction to current direction.'],
    ['Which energy conversion is the main purpose of an electric motor?', 'Electrical energy to mechanical energy', 'Mechanical energy to electrical energy', 'Chemical energy to electrical energy', 'Thermal energy to chemical energy', 'Forces on a current-carrying coil in a magnetic field produce rotation, converting electrical input into mechanical output.'],
    ['Which type of mirror can concentrate sunlight onto a real focal spot?', 'Concave mirror', 'Convex mirror', 'Plane mirror', 'Plane-parallel glass plate', 'The inward-curving surface of a concave mirror reflects nearly parallel rays from the Sun toward a shared focus.'],
    ['Which unit measures the amount of electric energy billed for household use?', 'Kilowatt-hour', 'Kilowatt', 'Ampere-hour', 'Volt-ampere', 'A kilowatt-hour is power multiplied by time. A kilowatt describes energy use per unit time, not total energy.']
  ]),
  ...basic('Chemistry', ncert('jesc102'), [
    ['Which pH best represents pure water at 25 °C?', '7', '0', '4', '14', 'At 25 °C, neutral water has equal hydrogen-ion and hydroxide-ion concentrations, corresponding to pH 7.'],
    ['When pH changes from 3 to 5 in dilute water solutions, what happens to hydrogen-ion concentration?', 'It falls to one hundredth', 'It falls to one tenth', 'It rises one hundredfold', 'It rises tenfold', 'Each increase of one pH unit is a tenfold decrease in hydrogen-ion concentration, so a change of two units gives a hundredfold decrease.'],
    ['Which gas produces a pop when it is safely tested in a small laboratory sample after a metal reacts with dilute acid?', 'Hydrogen', 'Carbon dioxide', 'Oxygen', 'Nitrogen', 'Suitable metals can displace hydrogen from a dilute acid. The small pop comes from combustion of hydrogen with oxygen in air.'],
    ['Which compound is the principal ingredient sold as baking soda?', 'Sodium hydrogencarbonate', 'Sodium chloride', 'Sodium hydroxide', 'Calcium carbonate', 'Baking soda is NaHCO₃. It can release carbon dioxide when it reacts with an acid, helping batter rise.'],
    ['What happens when blue litmus is placed in an acidic solution?', 'It turns red', 'It turns blue-green', 'It turns yellow', 'It remains blue', 'Acids turn blue litmus red. Bases give the complementary effect on red litmus.'],
    ['Which products form when dilute hydrochloric acid reacts completely with sodium hydroxide?', 'Sodium chloride and water', 'Sodium carbonate and water', 'Sodium chloride and hydrogen', 'Sodium chloride and carbon dioxide', 'Neutralisation combines hydrogen and hydroxide ions to form water, with sodium and chloride making the corresponding salt.'],
    ['Which compound is present in the milk of magnesia used as an antacid?', 'Magnesium hydroxide', 'Magnesium chloride', 'Magnesium sulfate', 'Magnesium nitrate', 'Magnesium hydroxide is a base that neutralises excess stomach acid. The chloride, sulfate and nitrate are different magnesium compounds.']
  ]),
  ...basic('Chemistry', exemplar, [
    ['What two substances are required together for ordinary rusting of iron?', 'Oxygen and water', 'Nitrogen and water', 'Oxygen and nitrogen', 'Carbon dioxide and nitrogen', 'Rusting involves iron reacting with oxygen in the presence of moisture. Excluding either limits ordinary rust formation.'],
    ['What is the term for loss of electrons in a redox reaction?', 'Oxidation', 'Reduction', 'Condensation', 'Neutralisation', 'Oxidation is electron loss and reduction is electron gain. The two are paired in a redox reaction.'],
    ['Which structural feature makes ethene an unsaturated hydrocarbon?', 'A carbon–carbon double bond', 'A carbon–oxygen double bond', 'A carbon–carbon single bond', 'A chlorine atom', 'Ethene is C₂H₄ and has a double bond between its two carbon atoms. That multiple bond distinguishes it from saturated ethane.'],
    ['Which functional group makes a simple carbon compound a carboxylic acid?', '–COOH', '–OH', '–CHO', '–NH₂', 'A carboxyl group contains both a carbonyl and a hydroxyl attached to the same carbon. A hydroxyl alone is characteristic of an alcohol.'],
    ['What property accounts for graphite conducting electricity along its layers?', 'Delocalised electrons', 'The escape of carbon nuclei', 'Mobile carbon ions throughout the lattice', 'Bound pairs of hydrogen ions', 'Each carbon has an electron that can participate in delocalised bonding, allowing charge to move along the connected graphite layers.'],
    ['Which kind of bonding involves sharing a pair of electrons between two atoms?', 'Covalent bonding', 'Ionic bonding', 'Metallic bonding', 'Hydrogen bonding', 'Covalent bonds arise from shared electron pairs. Ionic bonding instead reflects attraction between oppositely charged ions.'],
    ['Which term describes the special ability of carbon atoms to join one another into chains and rings?', 'Catenation', 'Sublimation', 'Isomerisation', 'Saponification', 'Strong bonds between carbon atoms allow repeated linkage of the same element, a property called catenation.']
  ]),
  ...basic('Biology', ncert('jesc105'), [
    ['Which plant tissue transports water and dissolved mineral ions from roots toward leaves?', 'Xylem', 'Phloem', 'Cambium', 'Epidermis', 'Xylem forms the main water-conducting pathway. Phloem distributes sugars and other products made in photosynthetic tissues.'],
    ['Which plant tissue carries sugars from a source leaf to a growing sink tissue?', 'Phloem', 'Xylem', 'Epidermis', 'Cork', 'Phloem transports dissolved organic food between sources and sinks. Xylem mainly transports water and mineral ions.'],
    ['Which structures adjust the width of leaf pores in response to changes in water balance?', 'Guard cells', 'Root hair cells', 'Palisade cells', 'Xylem vessel elements', 'Each stoma is bordered by two guard cells. Their changing turgor controls how open the pore is.'],
    ['Which gas is evolved when water is split during oxygenic photosynthesis?', 'Oxygen', 'Nitrogen', 'Carbon monoxide', 'Hydrogen chloride', 'Water provides electrons during the light-dependent reactions. Molecular oxygen is released as a by-product.'],
    ['Which glucose breakdown pathway can provide energy to human muscle when oxygen supply is temporarily insufficient?', 'Anaerobic conversion of pyruvate to lactate', 'Photosynthetic carbon fixation', 'Alcoholic conversion of pyruvate to ethanol', 'Aerobic oxidation of pyruvate in mitochondria', 'Formation of lactate helps regenerate NAD⁺ so glycolysis can continue while oxygen delivery is limited.'],
    ['What is the movement of water vapour from leaves to the atmosphere called?', 'Transpiration', 'Translocation', 'Germination', 'Pollination', 'Water evaporates within the leaf and diffuses mainly through stomata. This water loss can help pull water upward through xylem.']
  ]),
  ...basic('Human Body and Diseases', ncert('jesc105'), [
    ['Where does most exchange of oxygen and carbon dioxide occur in the human lungs?', 'Alveoli', 'Trachea', 'Bronchi', 'Larynx', 'Thin alveolar walls lie close to a capillary network, giving gases a short diffusion distance.'],
    ['Which substance emulsifies fats in the small intestine?', 'Bile', 'Salivary amylase', 'Pepsin', 'Hydrochloric acid', 'Bile salts disperse fat into smaller droplets, increasing the surface area on which digestive lipase can act.'],
    ['Which enzyme starts the digestion of starch in the mouth?', 'Salivary amylase', 'Pepsin', 'Trypsin', 'Lipase', 'Salivary amylase begins breaking down starch during chewing. Pepsin and trypsin act on proteins.'],
    ['Which digestive organ produces bile?', 'Liver', 'Gallbladder', 'Pancreas', 'Stomach', 'The liver produces bile. The gallbladder stores and concentrates it before release into the small intestine.'],
    ['Which structure is the functional filtration unit of a kidney?', 'Nephron', 'Neuron', 'Alveolus', 'Villus', 'Each nephron filters blood and modifies the filtrate through reabsorption and secretion to help form urine.'],
    ['Which vessel returns oxygenated blood from the lungs to the heart?', 'Pulmonary vein', 'Pulmonary artery', 'Vena cava', 'Hepatic portal vein', 'Pulmonary veins carry blood from the lungs to the left atrium. Arteries and veins are named by direction relative to the heart.'],
    ['Which heart chamber sends blood through the aorta to the body?', 'Left ventricle', 'Right ventricle', 'Left atrium', 'Right atrium', 'The left ventricle drives systemic circulation through the aorta. The right ventricle sends blood to the lungs.'],
    ['Which blood component helps produce the initial plug at a cut in a vessel?', 'Platelets', 'Red blood cells', 'Plasma water', 'Neutrophils', 'Platelets adhere and aggregate at injured vessels to start a plug. They also support formation of a stabilising clot.'],
    ['What feature greatly increases the surface available for absorption in the small intestine?', 'Villi', 'A thick smooth lining', 'A ring of cartilage', 'Alveoli', 'Villi are projections on the inner surface. Their folded geometry increases the area exposed to digested nutrients.']
  ]),
  ...environment('Ecology', biology('46-1-ecology-of-ecosystems'), [
    ['What does an ecosystem include in addition to the organisms that live in it?', 'Nonliving surroundings and their interactions with organisms', 'Only the most abundant population', 'Only the organisms’ shared ancestors', 'Only the introduced species', 'Ecosystem studies connect the living community to the physical environment such as water, light and soil.'],
    ['What diagram represents multiple interconnected feeding paths rather than one linear path?', 'Food web', 'Food chain', 'Energy pyramid', 'Population growth curve', 'A food web links multiple feeding pathways and captures the fact that most organisms have multiple foods or predators.'],
    ['Which organisms make up the first trophic level in a grazing food chain?', 'Primary producers', 'Primary consumers', 'Secondary consumers', 'Tertiary consumers', 'Plants and other primary producers capture energy and convert inorganic material into biomass that consumers can eat.'],
    ['In a detrital food pathway, what provides the original food input?', 'Dead organic material', 'Unweathered bedrock', 'Atmospheric nitrogen gas alone', 'Freshwater alone', 'Detritus includes dead tissues and organic waste. The organisms processing it contribute to nutrient cycling.'],
    ['In an ecosystem field survey, which factor is abiotic?', 'Soil temperature', 'Fern cover', 'Fungal species richness', 'Earthworm density', 'An abiotic factor is a nonliving environmental condition. Temperatures can shape organisms’ growth and distribution.']
  ]),
  ...environment('Ecology', biology('46-2-energy-flow-through-ecosystems'), [
    ['Why does an energy pyramid normally narrow at higher trophic levels?', 'Organisms use part of the energy in metabolism and release heat', 'Higher consumers fix more solar energy', 'Energy increases whenever prey is eaten', 'Each level uses identical quantities of organic matter', 'Only a fraction of energy available at one level becomes biomass available to the next. Respiration and other losses reduce the transfer.'],
    ['Which measure equals total energy fixed by producers minus their own respiration?', 'Net primary productivity', 'Gross primary productivity', 'Secondary productivity', 'Standing crop biomass', 'Net primary productivity is the plant or algal energy left for growth and consumers after producers pay their own respiratory energy cost.'],
    ['In the chain grass → grasshopper → frog → snake, which organism is the secondary consumer?', 'Frog', 'Grass', 'Grasshopper', 'Snake', 'The grasshopper eats the producer and is the primary consumer. The frog eats the grasshopper and so is the secondary consumer.']
  ]),
  ...environment('Ecology', biology('46-3-biogeochemical-cycles'), [
    ['What is the conversion of atmospheric nitrogen gas into chemically combined nitrogen called?', 'Nitrogen fixation', 'Denitrification', 'Transpiration', 'Carbon fixation', 'Nitrogen fixation makes relatively inert atmospheric nitrogen available in compounds that can enter biological pathways.'],
    ['What process returns nitrate nitrogen to the atmosphere as nitrogen gas?', 'Denitrification', 'Nitrogen fixation', 'Nitrification', 'Photosynthesis', 'Denitrifying microorganisms reduce nitrate or nitrite to gaseous forms of nitrogen, completing part of the nitrogen cycle.'],
    ['Which phosphorus-cycle characteristic distinguishes it from the main nitrogen cycle?', 'Most movement occurs through rocks, soils, water and organisms', 'Most cycling occurs as gaseous elemental phosphorus', 'Most phosphorus comes from atmospheric nitrogen', 'Living organisms never absorb phosphorus compounds', 'Weathering supplies phosphate from rocks and biological recycling moves it through organisms. Phosphorus has no major atmospheric gaseous reservoir.'],
    ['Which process removes carbon dioxide directly from the air in a growing forest?', 'Photosynthesis', 'Cellular respiration', 'Combustion', 'Decomposition', 'Photosynthetic assimilation takes up carbon dioxide to form organic compounds. The other processes listed generally release carbon dioxide.']
  ]),
  ...environment('Ecology', biology('45-6-community-ecology'), [
    ['An abandoned field retains its soil after farming stops. What type of succession begins as its plant cover changes?', 'Secondary succession', 'Primary succession', 'Ecological extinction', 'Competitive exclusion', 'Secondary succession follows disturbance where soil or other remnants of the ecosystem remain. Primary succession starts on surfaces lacking developed soil.'],
    ['What is the ecological interaction called when both species in a pair benefit from the association?', 'Mutualism', 'Commensalism', 'Parasitism', 'Competition', 'Mutualism involves a net benefit to both partners. Commensalism usually benefits one with little effect on the other.'],
    ['Which term describes species that are among the first successful colonisers of a newly exposed habitat?', 'Pioneer species', 'Keystone species', 'Indicator species', 'Umbrella species', 'Pioneers establish early in succession and may change the environment in ways that allow later colonists to establish.'],
    ['Which term describes a species whose removal can disproportionately change the rest of its community?', 'Keystone species', 'Dominant species by biomass', 'Pioneer species', 'Indicator species', 'Keystone species have ecological effects larger than their abundance might suggest. The definition refers to the impact on community organisation.']
  ]),
  ...environment('Biodiversity', biology('47-1-the-biodiversity-crisis'), [
    ['Differences in drought tolerance among varieties of the same rice species illustrate which kind of biodiversity?', 'Genetic diversity', 'Species diversity', 'Ecosystem diversity', 'Biogeochemical cycling', 'Inherited difference among populations or varieties of one species is variation within that species, so it is genetic diversity.'],
    ['Which term counts how many species are present without measuring their relative abundance?', 'Species richness', 'Species evenness', 'Population density', 'Habitat fragmentation', 'Species richness is a count of distinct species. Evenness concerns how individuals are distributed among those species.'],
    ['What describes a species naturally restricted to a particular region?', 'Endemic', 'Cosmopolitan', 'Domesticated', 'Migratory', 'An endemic species occurs naturally only within a specific geographic range. The range may be an island, mountain system or other defined area.'],
    ['Which kind of diversity is illustrated by mangroves, grasslands, freshwater lakes and montane forests in one region?', 'Ecosystem diversity', 'Genetic diversity', 'Species evenness', 'Population density', 'A range of different habitats and ecological systems illustrates ecosystem diversity, distinct from counting species or alleles.']
  ]),
  ...environment('Conservation', biology('47-4-preserving-biodiversity'), [
    ['Which measure conserves a wild plant in its existing habitat?', 'Protecting the forest where it grows', 'Storing its seeds in a seed bank', 'Keeping it in a distant glasshouse', 'Moving all specimens to a botanic garden', 'In situ conservation protects organisms within their natural environment. Seed banks and botanic gardens are examples of off-site conservation.'],
    ['Which is an example of ex situ conservation for a threatened crop relative?', 'Maintaining conserved seed in a gene bank', 'Protecting its native meadow', 'Connecting two native habitats', 'Restoring groundwater in its native range', 'Ex situ conservation maintains populations or genetic material outside the natural habitat. Seed banks preserve suitable germplasm for future use.'],
    ['Why can a wildlife corridor help when one forest has been split into separate patches?', 'It can restore movement and gene flow between populations', 'It makes all patches genetically identical immediately', 'It ends succession in the largest patch', 'It replaces the need for any protected patches', 'Connecting suitable habitat can let organisms disperse, find mates and recolonise areas. The effect depends on the species and corridor design.']
  ]),
  ...environment('Conservation', 'https://nrl.iucnredlist.org/', [
    ['Which IUCN category applies when a species is known to survive only in captivity or in introduced populations outside its former range?', 'Extinct in the Wild', 'Extinct', 'Critically Endangered', 'Data Deficient', 'Extinct in the Wild allows for surviving captive, cultivated or introduced individuals. Extinct is used when there is no reasonable doubt that the last individual has died.']
  ]),
  ...environment('Conservation', 'https://www.ramsar.org/about/our-mission', [
    ['Which international convention specifically promotes conservation and wise use of wetlands?', 'Convention on Wetlands (Ramsar Convention)', 'Convention on Biological Diversity', 'Basel Convention', 'Vienna Convention for the Protection of the Ozone Layer', 'Ramsar focuses on wetland conservation, wise use, sites of international importance and cooperation across borders.'],
    ['Which coastal habitat with salt-tolerant trees falls within the Convention on Wetlands’ broad wetland definition?', 'Mangrove forest', 'Alpine meadow', 'Dry teak woodland', 'Inland dune scrub', 'Mangroves occur along tidal coasts or estuaries and are among the coastal habitats covered by the convention.']
  ]),
  ...environment('Conservation', 'https://moef.gov.in/uploads/2024/04/NPCA-guidelines-2024-Wetlands.pdf', [
    ['What is the principal focus of India’s National Plan for Conservation of Aquatic Ecosystems?', 'A functioning network of healthy wetlands', 'A nationwide network of solar parks', 'The conservation of high-altitude snow leopard habitat alone', 'A national inventory of mineral deposits', 'The scheme supports wetland conservation and management, protecting ecosystem services and wetland-dependent species.'],
    ['Which wetland service reduces flood peaks when incoming water is spread and retained temporarily?', 'Water storage and flow regulation', 'Soil salinisation', 'Saltwater intrusion', 'Nutrient export from the watershed', 'Floodplain or wetland storage can slow the release of incoming water and reduce peak discharge downstream.']
  ]),
  ...environment('Conservation', 'https://cites.org/eng/disc/how.php', [
    ['What activity does CITES regulate with import or export permits where applicable?', 'International trade in listed wild species specimens', 'International movement of all agricultural workers', 'Greenhouse-gas emissions reporting', 'Disposal of radioactive materials at sea', 'CITES regulates cross-border trade so trade in specimens of wild fauna and flora does not threaten species survival.'],
    ['Which CITES appendix generally lists species threatened with extinction for which international commercial trade is normally prohibited?', 'Appendix I', 'Appendix II', 'Appendix III', 'Appendix IV', 'Appendix I gives the highest restriction in ordinary cases. Its exemptions are limited, unlike the usual permit approach for Appendix II.']
  ]),
  ...environment('Climate and Pollution', 'https://unfccc.int/most-requested/key-aspects-of-the-paris-agreement', [
    ['Which climate agreement adopted at COP21 calls for efforts to limit warming to 1.5 °C above preindustrial temperatures?', 'Paris Agreement', 'Montreal Protocol', 'Cartagena Protocol', 'Convention on Wetlands', 'The Paris Agreement seeks to hold warming well below 2 °C and pursue a 1.5 °C limit relative to preindustrial levels.'],
    ['In the Paris Agreement, what is an NDC?', 'A nationally determined contribution', 'A nonrenewable development credit', 'A neutralised deforestation claim', 'A nationally designated cyclone centre', 'An NDC is each party’s climate contribution, communicated and updated through the agreement’s cycle.']
  ]),
  ...environment('Climate and Pollution', 'https://unfccc.int/process-and-meetings/the-kyoto-protocol', [
    ['Which climate instrument introduced quantified emission targets for the industrialised parties and economies in transition listed in Annex B?', 'Kyoto Protocol', 'Paris Agreement', 'Montreal Protocol', 'Basel Convention', 'The Kyoto Protocol used binding emission limitation and reduction commitments for parties listed in Annex B.']
  ]),
  ...environment('Climate and Pollution', 'https://www.epa.gov/power-sector/progress-report-atmospheric-deposition', [
    ['Which emissions are the principal direct precursors of acid deposition from conventional fossil-fuel combustion?', 'Sulfur dioxide and nitrogen oxides', 'Methane and helium', 'Oxygen and argon', 'Hydrogen and water vapour', 'Atmospheric reactions convert sulfur dioxide and nitrogen oxides into acidic compounds, some of which reach land and water through rain or dry deposition.'],
    ['A lake receives long-term inputs of nitrogen and phosphorus and develops dense algal blooms. What process does this illustrate?', 'Eutrophication', 'Desertification', 'Stratospheric ozone depletion', 'Temperature inversion', 'Excess nutrients increase algal growth. Decomposition can then consume dissolved oxygen and stress aquatic animals.']
  ]),
  ...environment('Conservation', 'https://ntca.gov.in/faqs/', [
    ['In which year was India’s Project Tiger launched?', '1973', '1952', '1986', '1992', 'Project Tiger started in 1973 with nine reserves and supports conservation of tigers and their habitats.'],
    ['Why can the tiger be treated as an umbrella species in reserve design?', 'Protecting enough habitat for tigers can also conserve many other species', 'Tiger protection creates suitable habitat for every bird species', 'The presence of one tiger removes the need to monitor other wildlife', 'Tiger abundance directly measures the genetic diversity of nearby plants', 'A species with extensive habitat requirements can bring wider benefits when the habitats and ecological processes it needs are protected.']
  ]),
  ...environment('Conservation', 'https://www.cbd.int/convention/articles/default.shtml?a=cbd-01&lg=0', [
    ['Which treaty combines conservation, sustainable use of biodiversity and equitable sharing of benefits from genetic resources?', 'Convention on Biological Diversity', 'Convention on Wetlands', 'Convention on International Trade in Endangered Species', 'United Nations Framework Convention on Climate Change', 'Article 1 of the Convention on Biological Diversity defines all three objectives. Trade regulation and wetland conservation are central to other treaties.']
  ]),
  ...environment('Climate and Pollution', 'https://www.ozone.unep.org/treaties/montreal-protocol', [
    ['Which treaty phases out production and use of chemicals that deplete stratospheric ozone?', 'Montreal Protocol', 'Kyoto Protocol', 'Paris Agreement', 'Basel Convention', 'The Montreal Protocol protects the ozone layer by controlling substances such as chlorofluorocarbons. Kyoto and Paris address climate change.'],
    ['Which industrial gas family is phased down under the Kigali Amendment because of its warming effect?', 'Hydrofluorocarbons', 'Inert noble gases', 'Nitrogen gas', 'Oxygen gas', 'Hydrofluorocarbons became common substitutes for some ozone-depleting chemicals. The amendment addresses their strong greenhouse effect.']
  ]),
  ...technology('ISRO and Space', isro('aryabhata_1.html'), [
    ['Which satellite inaugurated India’s satellite programme and entered orbit in April 1975?', 'Aryabhata', 'Bhaskara-1', 'Rohini RS-1', 'APPLE', 'Aryabhata was designed and built in India and launched by the Soviet Union. It predates the other satellites listed.']
  ]),
  ...technology('ISRO and Space', isro('ISRO_EN/Indian_Remote_Sensing_Satellite_1A.html'), [
    ['Which early Indian satellite pair used experimental Earth observation to help prepare for the IRS programme?', 'Bhaskara-1 and Bhaskara-2', 'Chandrayaan-1 and Chandrayaan-2', 'GSAT-3 and GSAT-6', 'NVS-01 and NVS-02', 'The two Bhaskara satellites gathered early Earth observation experience. IRS-1A marked the move toward an operational remote-sensing programme.'],
    ['Why is IRS-1A a milestone in the Indian space programme?', 'It opened an operational era for Indian remote sensing', 'It placed the first Indian rover on the Moon', 'It demonstrated docking between two satellites', 'It was India’s first dedicated space astronomy observatory', 'IRS-1A followed experimental spacecraft and supported systematic Earth observation for applications such as natural resource mapping.']
  ]),
  ...technology('ISRO and Space', isro('SpacecraftMissions.html'), [
    ['What payload did India’s SLV-3 place in orbit in July 1980 on its first successful orbital flight?', 'Rohini RS-1', 'Aryabhata', 'Bhaskara-1', 'INSAT-1B', 'The successful second SLV-3 development flight launched Rohini RS-1. Aryabhata was built in India but launched on a Soviet vehicle.'],
    ['Which modern Indian space-science mission was launched in September 2015, before Aditya-L1 and XPoSat?', 'AstroSat', 'XPoSat', 'Aditya-L1', 'Chandrayaan-3', 'PSLV-C30 launched AstroSat in 2015. Aditya-L1 and Chandrayaan-3 followed in 2023, and XPoSat launched in 2024.']
  ]),
  ...technology('ISRO and Space', isro('ISRO_EN/EDUSAT.html'), [
    ['Which Indian satellite was dedicated to providing satellite-based communication for education?', 'GSAT-3 (EDUSAT)', 'INSAT-3D', 'Cartosat-1', 'AstroSat', 'EDUSAT, also known as GSAT-3, gave classrooms and institutions satellite-based communication for education.']
  ]),
  ...technology('ISRO and Space', isro('SpaceOnWheels.html'), [
    ['Which launch vehicle family carried both Chandrayaan-1 and India’s Mars Orbiter Mission on their respective launches?', 'PSLV', 'ASLV', 'SLV-3', 'SSLV', 'Chandrayaan-1 and the Mars Orbiter Mission both began on flights of the Polar Satellite Launch Vehicle.']
  ]),
  ...technology('ISRO and Space', isro('spacesciexp.html'), [
    ['Which mission represented India’s first spacecraft mission to the Moon?', 'Chandrayaan-1', 'Chandrayaan-2', 'Chandrayaan-3', 'Aditya-L1', 'Chandrayaan-1 launched in 2008 as India’s first lunar mission. The numbered missions that followed expanded the lunar programme.'],
    ['What was the destination of India’s first interplanetary orbiter mission, whose spacecraft is also known as Mangalyaan?', 'Mars', 'Venus', 'Mercury', 'Jupiter', 'Mangalyaan was designed to reach and orbit Mars. It provided experience in both interplanetary operations and planetary science.']
  ]),
  ...technology('ISRO and Space', isro('Chandrayaan3_Details.html'), [
    ['What capability did Chandrayaan-3 demonstrate on the Moon?', 'Soft landing followed by deployment of a rover', 'Return of lunar samples to Earth', 'Human landing and return', 'A continuously operating lunar navigation constellation', 'The craft landed gently and deployed a rover for local experiments. Returning samples and landing astronauts were outside the mission.'],
    ['Which part of Chandrayaan-3 transported the landing package to lunar orbit and then separated from it?', 'Propulsion module', 'Lander module', 'Surface rover', 'Launch-vehicle payload fairing', 'The propulsion module carried the lander and rover stack to its lunar orbit. The lander then separated for the descent.'],
    ['Which objective belongs to the lunar lander instrument named ILSA?', 'Measuring seismic activity near the landing site', 'Mapping temperatures on the Sun', 'Detecting a Mars atmospheric escape signal', 'Measuring X-ray polarisation of distant objects', 'ILSA provided observations of vibrations around the lunar landing site to help study the local seismic environment.']
  ]),
  ...technology('ISRO and Space', isro('Aditya_L1.html'), [
    ['Which celestial object is the primary subject of India’s Aditya-L1 observatory?', 'Sun', 'Moon', 'Mars', 'Venus', 'Aditya-L1 is India’s solar observatory. Its instruments examine the Sun and processes associated with the solar atmosphere and space weather.'],
    ['Why is the Sun–Earth L1 region useful for the Aditya-L1 mission?', 'It offers a largely uninterrupted line of sight to the Sun', 'It provides daily access to lava flows on Venus', 'It blocks solar radiation for most of the year', 'It lets a solar observatory remain on Earth’s night side', 'A halo orbit near Sun–Earth L1 lets the observatory monitor the Sun without the frequent Earth eclipses experienced in many closer Earth orbits.']
  ]),
  ...technology('ISRO and Space', isro('AstroSat.html'), [
    ['Which bands were combined by India’s first dedicated astronomy satellite for simultaneous observations?', 'X-ray, ultraviolet and optical', 'Radio, microwave and gamma-ray only', 'Infrared, radio and microwave only', 'Optical and radio only', 'AstroSat was designed for multiwavelength astronomy using X-ray, ultraviolet and limited optical instruments.']
  ]),
  ...technology('ISRO and Space', isro('XPoSat_X-Ray_Polarimetry_Mission.html'), [
    ['What property of cosmic X-rays is the principal target of XPoSat’s POLIX instrument?', 'Polarisation', 'Electrical resistance', 'Sound intensity', 'Optical reflection by the Moon', 'POLIX measures the degree and angle of X-ray polarisation. These properties carry information about the sources.']
  ]),
  ...technology('ISRO and Space', isro('ISRO_EN/mission_SpaDeX.html'), [
    ['Which operation was the main technology objective of India’s SpaDeX mission?', 'Docking and undocking spacecraft in orbit', 'Landing a rover on Mars', 'Sending a biological sample beyond the Solar System', 'Returning an astronaut crew from orbit', 'SpaDeX was designed to demonstrate how two satellites can rendezvous, join and later separate in orbit.']
  ]),
  ...technology('ISRO and Space', isro('ISRO_EN/Mission_GSLVF16_NISAR_Home.html'), [
    ['Which pair of agencies developed the Earth observation satellite NISAR?', 'NASA and ISRO', 'ESA and JAXA', 'ISRO and Roscosmos', 'NASA and CSA', 'NISAR stands for NASA–ISRO Synthetic Aperture Radar. It observes changes in the Earth system using radar.'],
    ['Which two radar bands does NISAR combine to observe changes in land, ice and ecosystems?', 'L and S bands', 'C and Ku bands', 'X and Ka bands', 'V and W bands', 'NISAR observes in the L and S microwave bands. Different wavelengths give complementary observations of the Earth’s surface.']
  ]),
  ...technology('ISRO and Space', isro('SatelliteNavigationServices.html'), [
    ['Which of these is India’s independent regional positioning and timing system?', 'NavIC', 'Galileo', 'BeiDou', 'GLONASS', 'Navigation with Indian Constellation, or NavIC, provides a regional navigation and timing capability. The other names refer to other national or regional systems.'],
    ['Which service is made available to ordinary civilian users of India’s NavIC system?', 'Standard Positioning Service', 'Restricted Service', 'Search and Rescue internet service', 'Polarimetric Imaging Service', 'The standard positioning service provides civilian navigation and timing. The restricted service has authorised users.']
  ]),
  ...technology('ISRO and Space', isro('ISRO_EN/GSLV-F14_INSAT-3DS_mission.html'), [
    ['Which Indian mission was designed primarily to improve satellite observations for weather forecasting and disaster warning?', 'INSAT-3DS', 'AstroSat', 'XPoSat', 'Chandrayaan-3', 'INSAT-3DS is a meteorological satellite that gives agencies observations of atmospheric conditions and weather systems.']
  ]),
  ...technology('ISRO and Space', isro('ISRO_EN/FAQ_Gaganyaan.html'), [
    ['What is the principal objective of India’s Gaganyaan programme?', 'Demonstrating independent human spaceflight capability', 'Establishing a long-term rover station on Mars', 'Studying X-ray polarisation of stars', 'Mapping Earth’s ice sheets by radar', 'The programme is building the technology to send a crew to low Earth orbit and bring it safely back.'],
    ['Which adaptation of an existing Indian launcher supports the Gaganyaan programme?', 'Human-rated LVM3', 'A retired SLV-3', 'A retired ASLV', 'An unmodified sounding rocket', 'ISRO selected a human-rated LVM3 variant. Human rating addresses the requirements of carrying people safely.']
  ]),
  ...technology('Research Institutions', isro('ISRO_EN/profile.html'), [
    ['At which Indian space centre are satellites and launch vehicles integrated for launch at Sriharikota?', 'Satish Dhawan Space Centre', 'U R Rao Satellite Centre', 'National Remote Sensing Centre', 'Space Applications Centre', 'The Satish Dhawan Space Centre at Sriharikota is India’s main launch site. Design and application work also occurs at other centres.'],
    ['Which ISRO centre at Thiruvananthapuram leads launch-vehicle design and development?', 'Vikram Sarabhai Space Centre', 'National Remote Sensing Centre', 'Physical Research Laboratory', 'U R Rao Satellite Centre', 'VSSC specialises in launch-vehicle development. It is named for the scientist who played a central role in developing India’s space programme.'],
    ['Which ISRO centre in Bengaluru designs and builds Indian satellites?', 'U R Rao Satellite Centre', 'Space Applications Centre', 'Satish Dhawan Space Centre', 'Vikram Sarabhai Space Centre', 'U R Rao Satellite Centre develops spacecraft for purposes such as scientific observations, communications and navigation.'],
    ['Which centre in Hyderabad acquires and processes data from Indian remote-sensing satellites?', 'National Remote Sensing Centre', 'Physical Research Laboratory', 'U R Rao Satellite Centre', 'Satish Dhawan Space Centre', 'NRSC handles remote-sensing data reception, processing and distribution. Its products support resource mapping and disaster management.'],
    ['Which ISRO centre in Ahmedabad develops space applications and communication and Earth observation payloads?', 'Space Applications Centre', 'Vikram Sarabhai Space Centre', 'Satish Dhawan Space Centre', 'U R Rao Satellite Centre', 'The Space Applications Centre develops satellite instruments and applies space data to practical needs.']
  ]),
  ...technology('Research Institutions', 'https://www.cdac.in/index.aspx?id=print_page&print=hpc_ss_supercomputing_systems', [
    ['Which organisation developed the PARAM 8000 supercomputer?', 'Centre for Development of Advanced Computing', 'Indian Space Research Organisation', 'National Informatics Centre', 'Bhabha Atomic Research Centre', 'C-DAC developed PARAM 8000 through its high-performance computing work, establishing a landmark in domestic supercomputing.']
  ]),
  ...technology('Emerging Technology', 'https://www.meity.gov.in/static/uploads/2024/03/6.HCCD_.pdf', [
    ['Which aim belongs to India’s Bhashini initiative?', 'Developing speech and translation tools for Indian languages', 'Measuring the polarisation of cosmic X-rays', 'Manufacturing satellites for regional navigation', 'Mapping coal reserves through airborne surveys', 'Bhashini is the National Language Translation Mission, supporting tools such as speech recognition, machine translation and text-to-speech.'],
    ['What task is performed by text-to-speech technology?', 'Producing spoken audio from written text', 'Turning spoken sound into a written transcript', 'Translating written text between two languages', 'Identifying letters in scanned image pixels', 'Text-to-speech synthesises audio. Speech recognition turns audio into text, and optical character recognition extracts characters from images.']
  ]),
  ...technology('Emerging Technology', 'https://dst.gov.in/sites/default/files/Annual%20Report_2025_English.pdf', [
    ['Which of these is a research domain of India’s National Quantum Mission?', 'Quantum sensing and metrology', 'Aquaculture and brackish-water fisheries', 'Conventional road construction', 'River floodplain dredging', 'The mission supports quantum computing, communications, sensing and metrology, and materials and devices.'],
    ['Which term denotes the unit of quantum information used in quantum computers?', 'Qubit', 'Byte', 'Joule', 'Pascal', 'A qubit is a quantum information unit. The term is distinct from a classical byte, which ordinarily groups eight bits.']
  ]),
  ...technology('Emerging Technology', 'https://mnre.gov.in/static/uploads/2025/08/1f868c1b573371dcb40874f2ed5a26a4.pdf', [
    ['Which process can supply hydrogen using water and renewable electricity?', 'Electrolysis of water', 'Fractional distillation of crude oil', 'Combustion of coal', 'Carbonation of limestone', 'An electrolyser uses electricity to split water into hydrogen and oxygen. Using renewable power can reduce the emissions associated with hydrogen production.']
  ]),
  ...technology('Emerging Technology', 'https://science.nasa.gov/learn/basics-of-space-flight/chapter12-1/', [
    ['A satellite sensor emits a pulse and measures the returned signal. What broad kind of remote sensing is this?', 'Active remote sensing', 'Passive remote sensing', 'Direct-contact sampling', 'Inertial navigation', 'An active instrument sends out energy and measures the response. A passive sensor records naturally emitted or reflected energy.'],
    ['Which example illustrates passive satellite sensing?', 'A detector measuring sunlight reflected by crops', 'An altimeter timing echoes of its own radio pulses', 'A lidar measuring returns of its own laser light', 'A radar imaging the ground using transmitted microwaves', 'The detector receives ambient radiation without generating its own probe signal. The other examples transmit a signal before measuring the result.']
  ]),
  ...technology('Emerging Technology', 'https://science.nasa.gov/learn/basics-of-space-flight/chapter5-1/', [
    ['Which orbit allows a satellite to appear nearly fixed over one longitude when viewed from Earth?', 'Circular equatorial geostationary orbit', 'Inclined low Earth orbit', 'Sun-synchronous polar orbit', 'Highly elliptical Earth orbit', 'A geostationary satellite circles above the equator with Earth’s rotation period and direction, so its apparent longitude stays fixed.']
  ])
];
