// Source-linked original items. The helper expands each group to the shared nine-column fact format.
const group = (topic, subtopic, source, rows) => rows.map(row => [topic, subtopic, ...row, source]);
const basic = (subtopic, source, rows) => group('Basic Science', subtopic, source, rows);
const environment = (subtopic, source, rows) => group('Environment and Ecology', subtopic, source, rows);
const technology = (subtopic, source, rows) => group('Science and Technology', subtopic, source, rows);
const physics = chapter => `https://openstax.org/books/physics/pages/${chapter}-section-summary`;
const chem = chapter => `https://openstax.org/books/chemistry-2e/pages/${chapter}-summary`;
const bio = chapter => `https://openstax.org/books/biology-2e/pages/${chapter}-chapter-summary`;
const isro = page => 'https://www.isro.gov.in/' + page;

export const scienceSecond = [
  ...basic('Physics', physics(4), [
    ['A passenger lurches towards the front when a bus brakes abruptly. Which property best explains this initial motion?', 'Inertia', 'Buoyancy', 'Elasticity', 'Viscosity', 'The passenger’s body tends to keep moving forward at its previous velocity while the bus decelerates. A restraint provides the force that slows the body.'],
    ['A 4 kg trolley accelerates at 3 m/s². What is the net force on the trolley?', '12 N', '7 N', '1 N', '1.33 N', 'Newton’s second law gives net force as mass multiplied by acceleration. Multiplying 4 kg by 3 m/s² gives 12 N.'],
    ['A swimmer pushes water backward with her hands. Which force pairs with the swimmer’s push under Newton’s third law?', 'The water pushing the swimmer forward', 'The Earth pulling the swimmer downward', 'The water supporting the swimmer upward', 'The swimmer pushing water downward', 'The paired forces act on different objects. The push on the water is backward, and the water’s equal and opposite force on the swimmer is forward.'],
    ['An object weighs less on the Moon than on Earth. Which property remains unchanged?', 'Mass', 'Weight', 'Local gravitational acceleration', 'The force needed to hold it at rest against local gravity', 'Mass measures inertia and is independent of location. Weight is the local gravitational force, proportional to local gravitational acceleration.']
  ]),
  ...basic('Physics', physics(8), [
    ['Two skaters start at rest and push away from each other on nearly frictionless ice. What is their combined horizontal momentum immediately after the push?', 'Zero', 'Equal to the heavier skater’s momentum', 'Equal to the lighter skater’s momentum', 'Equal to the sum of their momentum magnitudes', 'The pair begins with zero momentum. With negligible external horizontal force, the two skaters gain equal and opposite momenta.'],
    ['Why can catching a ball by moving one’s hands backward reduce the average force on the hands?', 'The hands bring the ball to rest over a longer time', 'The ball’s incoming momentum vanishes before contact', 'The hands make the ball heavier while slowing it', 'The ball gains the same impulse in a shorter time', 'Impulse equals change in momentum. Spreading the same change over a longer contact time reduces the magnitude of the average force.'],
    ['A cyclist and bicycle together have mass 60 kg and move at 5 m/s. What is the magnitude of their momentum?', '300 kg·m/s', '65 kg·m/s', '12 kg·m/s', '150 kg·m/s', 'Momentum is mass multiplied by velocity, so its magnitude is 60 multiplied by 5, or 300 kg·m/s.']
  ]),
  ...basic('Physics', physics(9), [
    ['If the speed of a cart triples without a change in mass, by what factor does its kinetic energy increase?', '9', '3', '6', '27', 'Kinetic energy equals one half of the mass multiplied by speed squared. Tripling the speed multiplies the energy by 3², which is 9.'],
    ['Which position requires the least effort to open a freely swinging door when the applied force is perpendicular to the door?', 'Near the edge farthest from the hinges', 'At the hinges', 'One quarter of the door width from the hinges', 'Halfway between the hinges and the far edge', 'The turning effect equals the force multiplied by its perpendicular lever arm. Using the point farthest from the hinge gives the greatest turning effect for the same force.'],
    ['A 20 N horizontal force moves a crate 3 m in the direction of the force. How much work does that force do?', '60 J', '23 J', '6.7 J', '120 J', 'When force and displacement point in the same direction, work equals force times displacement. Here it is 20 × 3 = 60 J.'],
    ['Why does an ideal ramp reduce the force needed to raise a box to a given height?', 'It spreads the same work over a longer distance', 'It removes the gain in gravitational potential energy', 'It reduces the box’s mass while it moves', 'It lowers the vertical height reached by the box', 'The ramp trades distance for force. Without friction, the work for the same gain in height is unchanged, even though the applied force is smaller.']
  ]),
  ...basic('Physics', 'https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy', [
    ['A floating block displaces 5 N of water by weight. What is the upward buoyant force on the block?', '5 N', '2.5 N', '10 N', '0 N', 'Archimedes’ principle makes the buoyant force equal to the weight of the displaced fluid. Here the displaced water weighs 5 N.'],
    ['The same closed ball is fully submerged first in fresh water and then in salt water. Where is its buoyant force greater?', 'In salt water', 'In fresh water', 'They are equal at the same depth', 'They are both zero when fully submerged', 'The ball displaces the same volume in each case. Salt water is denser, so the equal volume of displaced salt water weighs more.']
  ]),
  ...basic('Physics', 'https://openstax.org/books/university-physics-volume-1/pages/14-3-pascals-principle-and-hydraulics', [
    ['A hydraulic jack has a large piston area four times that of its small piston. What output force does an ideal jack produce for a 50 N input?', '200 N', '12.5 N', '54 N', '50 N', 'The applied pressure is transmitted through the enclosed fluid. With four times the piston area, the same pressure produces four times the force.']
  ]),
  ...basic('Physics', physics(11), [
    ['A metal spoon gets hotter at the handle after its bowl is placed in hot soup. Which process transfers energy along the spoon?', 'Conduction', 'Convection', 'Evaporation', 'Sublimation', 'Thermal energy moves along the solid metal through interactions among particles and mobile electrons. The spoon itself does not flow.'],
    ['Which heat-transfer process lets energy from the Sun cross the vacuum between the Sun and Earth?', 'Radiation', 'Conduction', 'Convection', 'Evaporation', 'Radiation transfers energy by electromagnetic waves. Unlike conduction or convection, it needs no material medium.'],
    ['Water moving upward from the heated base of a pot is an example of which heat-transfer process?', 'Convection', 'Conduction along a solid', 'Radiation through a vacuum', 'Direct electrical heating of the water', 'Heated water becomes less dense and rises, carrying thermal energy with the moving fluid. Cooler water can sink to replace it.']
  ]),
  ...basic('Physics', physics(14), [
    ['An ambulance siren moves towards a stationary observer. How does its heard pitch compare with the emitted pitch?', 'Higher', 'Lower', 'Equal regardless of speed', 'It vanishes until the siren passes', 'Each wave crest is emitted from a point closer to the observer than the previous crest. The crests arrive more frequently, raising the observed pitch.'],
    ['An echo returns 2 seconds after a clap. If sound travels at 340 m/s, how far away is the reflecting wall?', '340 m', '680 m', '170 m', '3400 m', 'The sound takes 2 seconds to travel to the wall and back, covering 680 m. The distance to the wall is half that total.'],
    ['Two notes have the same frequency, but one sound wave has a larger amplitude at the listener. What is generally different?', 'The larger-amplitude note sounds louder', 'The larger-amplitude note has a higher pitch', 'The larger-amplitude note has a longer wavelength', 'The larger-amplitude note must travel faster', 'Frequency determines pitch. At a fixed frequency and under otherwise similar conditions, larger amplitude means greater intensity and usually greater perceived loudness.'],
    ['A tuning fork can drive strong vibrations in an identical nearby tuning fork. What effect best explains this response?', 'Resonance', 'The Doppler effect', 'Acoustic absorption', 'An echo', 'Both forks have nearly the same natural frequency. Sound from the first varies at that frequency and efficiently drives the second into vibration.']
  ]),
  ...basic('Chemistry', chem(2), [
    ['A neutral atom has 17 protons and 18 neutrons. What is its atomic number?', '17', '18', '35', '1', 'Atomic number counts protons. The sum of protons and neutrons, 35 here, is the mass number.'],
    ['Carbon-12 and carbon-14 are isotopes. Which number differs between their nuclei?', 'Number of neutrons', 'Number of protons', 'Number of positive elementary charges', 'Atomic number', 'Isotopes belong to the same element and share its proton number. Their differing neutron numbers account for the different mass numbers.'],
    ['A neutral magnesium atom loses two electrons. What charge does the resulting ion carry?', 'Two units of positive charge', 'Two units of negative charge', 'One unit of positive charge', 'Zero net charge', 'Removing two negative charges leaves two more protons than electrons. This gives the ion a net charge of +2.'],
    ['How many oxygen atoms are represented by one formula unit of CaCO₃?', '3', '1', '2', '4', 'The subscript 3 after O applies to oxygen atoms. The formula contains one calcium, one carbon and three oxygen atoms.']
  ]),
  ...basic('Chemistry', chem(1), [
    ['Which procedure can remove suspended sand while leaving dissolved salt in water?', 'Filtration', 'Neutralisation', 'Condensation alone', 'Evaporation until the mixture is dry', 'Ordinary filtration traps the suspended grains. Dissolved salt passes through with the liquid because its ions are distributed throughout the solution.'],
    ['Which observable change is an example of a physical change?', 'Ice melting in a glass', 'An egg cooking in a pan', 'Paper burning in air', 'Milk turning sour', 'Melting changes the physical state without changing water’s composition. The other processes involve chemical changes.'],
    ['Which sample is a homogeneous mixture?', 'Salt completely dissolved in water', 'Sand suspended in water', 'Separate layers of oil and water', 'Powdered limestone mixed with gravel', 'A well-mixed salt solution has the same composition throughout. The other samples contain regions with different compositions.']
  ]),
  ...basic('Chemistry', 'https://openstax.org/books/chemistry-atoms-first-2e/pages/17-summary', [
    ['How does a catalyst usually speed up a chemical reaction?', 'It provides a pathway with lower activation energy', 'It makes the reaction’s equilibrium constant larger at the same temperature', 'It raises the initial activation barrier', 'It converts all reactants directly into catalyst', 'A catalyst changes the route by which the reaction occurs. A lower activation barrier increases rate without changing the equilibrium at a fixed temperature.'],
    ['Why does a powdered solid often react faster than an equal mass of the same solid in one large piece?', 'More of its surface is in contact with the other reactant', 'Powdering changes the element into a different element', 'Larger pieces contain no reactive particles', 'Powdering lowers the surrounding temperature', 'Breaking a solid into small pieces increases its exposed surface. More contact can increase the number of effective interactions per second.']
  ]),
  ...basic('Biology', bio(5), [
    ['A water-permeable membrane separates pure water from a sugar solution. Sugar cannot cross. Which net movement initially occurs?', 'Water moves into the sugar solution', 'Water moves out of the sugar solution', 'Sugar moves into the pure water', 'There is no net movement of water', 'Osmosis moves water across a membrane towards the side with higher dissolved-solute concentration when there is no opposing pressure difference.'],
    ['Which term describes passive movement of particles down their own concentration gradient?', 'Diffusion', 'Exocytosis', 'Active transport', 'Endocytosis', 'Diffusion gives a net movement from higher to lower concentration without requiring an input of metabolic energy.']
  ]),
  ...environment('Climate and Pollution', 'https://science.nasa.gov/earth/earth-observatory/climate-and-earths-energy-budget/', [
    ['Over a dark ocean, reflective sea ice melts and exposes water. How does this change tend to affect absorption of sunlight?', 'The surface absorbs more sunlight', 'The surface absorbs less sunlight', 'The surface stops absorbing sunlight entirely', 'Only the incoming amount of sunlight changes', 'The newly exposed ocean reflects a smaller fraction of incoming light than sea ice. Extra absorption can reinforce the initial warming.'],
    ['What mainly causes greenhouse gases to warm the lower atmosphere and surface?', 'They absorb and re-emit some outgoing infrared radiation', 'They prevent nearly all visible sunlight reaching the surface', 'They make the Sun emit more energy', 'They let surface heat escape to space more easily', 'The surface emits infrared radiation. Greenhouse gases absorb and emit some of that radiation, reducing outgoing heat loss at a given temperature.'],
    ['Which surface typically reflects the largest fraction of incoming visible sunlight?', 'Fresh snow', 'Open seawater', 'A dark conifer canopy', 'Wet black soil', 'Albedo is the reflected fraction of incoming radiation. A bright snow surface generally has much higher albedo than the darker alternatives.']
  ]),
  ...environment('Climate and Pollution', 'https://oceanservice.noaa.gov/facts/sealevelclimate.html', [
    ['What happens to the volume of most seawater when it warms with no change in the quantity of water?', 'It generally increases', 'It generally decreases', 'It remains exactly the same', 'It becomes zero if no ice melts', 'Ocean thermal expansion means the same mass of seawater occupies more volume as it warms. This can raise sea level without adding water.'],
    ['Which event adds new meltwater to the ocean and therefore raises global mean sea level?', 'A glacier on land loses ice that flows into the sea', 'Floating sea ice melts where it already displaces seawater', 'A wave changes the level briefly on the beach', 'A closed inland lake evaporates and refills from local rain', 'Ice stored on land adds water when its melt reaches the sea. Floating ice already displaces nearly its own meltwater weight.']
  ]),
  ...environment('Climate and Pollution', 'https://www.noaa.gov/ocean-acidification', [
    ['Which change follows when the ocean absorbs more carbon dioxide from the atmosphere over time?', 'The pH tends to fall', 'The pH tends to rise', 'The pH remains fixed at 7', 'The pH becomes independent of dissolved gases', 'Dissolved carbon dioxide shifts carbonate chemistry and increases hydrogen ions. The falling pH is called ocean acidification, even where seawater remains above pH 7.'],
    ['Which materials needed for many marine shells become less readily available as seawater’s carbonate chemistry shifts during acidification?', 'Carbonate ions used to build calcium carbonate', 'Sodium ions used to make sodium chloride', 'Dissolved nitrogen gas used as a structural material', 'Suspended silicate gravel incorporated into all shells', 'The chemistry shifts toward bicarbonate and reduces carbonate ion concentration. That can make it harder for calcifying organisms to build shells or skeletons.']
  ]),
  ...environment('Biodiversity', 'https://oceanservice.noaa.gov/facts/coral_bleach.html', [
    ['During heat-induced coral bleaching, what important partners are lost from the coral’s tissues?', 'Symbiotic algae', 'Burrowing crabs', 'Adult reef fish', 'Floating seagrass fragments', 'Stressed corals can lose the photosynthetic algae that supply much of their energy and colour. The coral becomes pale and vulnerable, but it can sometimes recover.']
  ]),
  ...environment('Climate and Pollution', 'https://www.epa.gov/ground-level-ozone-pollution/ground-level-ozone-basics', [
    ['Which combination drives much of the formation of ozone near the ground on sunny days?', 'Nitrogen oxides and volatile organic compounds reacting in sunlight', 'Nitrogen and oxygen freezing in darkness', 'Carbon dioxide dissolving into seawater', 'Water vapour condensing into liquid droplets', 'Ground-level ozone is often a secondary pollutant. Sunlight drives chemical reactions involving nitrogen oxides and volatile organic compounds.'],
    ['Which property distinguishes protective stratospheric ozone from harmful ground-level ozone?', 'Its location in the atmosphere', 'The presence of a fourth oxygen atom', 'The identity of its chemical element', 'Its inability to absorb any ultraviolet light', 'Both are O₃. Stratospheric ozone intercepts ultraviolet light high above the surface, while inhaling ozone near the ground can harm the respiratory system.']
  ]),
  ...environment('Climate and Pollution', 'https://www.epa.gov/pm-pollution/particulate-matter-pm-basics', [
    ['In the air-pollution label PM₂.₅, what does the number describe?', 'An upper particle diameter of about 2.5 micrometres', 'A minimum particle mass of 2.5 milligrams', 'A concentration limit of 2.5 parts per million', 'A sampling interval of 2.5 hours', 'The label groups fine airborne particles by size. It does not by itself specify how much particulate matter is in the air.'],
    ['Which observation is commonly caused by scattering and absorption of light by fine airborne particles?', 'Reduced visibility in haze', 'A persistent increase in the local oxygen fraction', 'A sudden increase in solar output', 'The disappearance of all atmospheric moisture', 'Fine particles can scatter or absorb visible light along the viewer’s line of sight, reducing contrast and obscuring distant objects.']
  ]),
  ...environment('Climate and Pollution', 'https://www.ipcc.ch/report/ar6/wg2/chapter/annex-ii/', [
    ['A city installs shade and cooling shelters to protect residents as heatwaves become more severe. Which climate response is this?', 'Adaptation', 'Mitigation of greenhouse-gas emissions', 'Ozone-layer restoration', 'Measurement of climate forcing', 'Adaptation adjusts to climate effects and reduces harm. The shelters reduce exposure to heat without directly reducing emissions.'],
    ['A municipality replaces fossil-fuel generation with low-emissions electricity to reduce warming. Which climate response is the primary goal?', 'Mitigation', 'Adaptation to sea-level rise', 'Attribution of a local storm', 'Observation of atmospheric conditions', 'Mitigation addresses the drivers of climate change by reducing emissions or enhancing greenhouse-gas removal.']
  ]),
  ...environment('Conservation', 'https://www.basel.int/theconvention/overview', [
    ['Which international convention regulates movements of hazardous waste across national borders and addresses its disposal?', 'Basel Convention', 'Convention on Wetlands', 'Montreal Protocol', 'Paris Agreement', 'Basel aims to prevent damage from hazardous and other wastes, including through controls on international shipments and requirements for environmentally sound management.']
  ]),
  ...environment('Conservation', 'https://wedocs.unep.org/items/f8b86b81-fb82-49ba-87d0-a82741af5462', [
    ['Which pollutant is the focus of the Minamata Convention?', 'Mercury', 'Carbon dioxide', 'Sulfur dioxide', 'Lead', 'The treaty addresses mercury pollution across its life cycle to protect people and the environment. Its name recalls the serious mercury poisoning suffered in Minamata, Japan.']
  ]),
  ...environment('Ecology', bio(45), [
    ['A deer population levels off as food and space become limiting. What term describes the approximate population the habitat can support in those circumstances?', 'Carrying capacity', 'Species richness', 'Doubling time', 'Net primary productivity', 'Carrying capacity is the sustainable population size under given conditions. Population growth tends to slow as the number of individuals approaches it.'],
    ['Under simple logistic growth, what typically happens to population growth as its size nears carrying capacity?', 'Growth slows as resources become limiting', 'The number of new individuals per period always doubles', 'Every individual stops reproducing simultaneously', 'Growth becomes independent of available resources', 'The logistic model limits growth when the population is large relative to the resources available. The curve levels off near carrying capacity.'],
    ['Which quantity gives the population density of a bird species in a nature reserve?', 'The number of its individuals divided by reserve area', 'The total number of bird species in the reserve', 'The fraction of regional species found there', 'The reserve’s area divided by the birds’ average mass', 'Population density is an abundance per unit area or volume for a defined population. Species richness instead counts different species.']
  ]),
  ...environment('Ecology', 'https://www.usgs.gov/water-science-school/science/infiltration-and-water-cycle', [
    ['After rain, some water passes from the land surface into pores in the soil. What is that movement called?', 'Infiltration', 'Surface runoff', 'Condensation', 'Evapotranspiration', 'Infiltration brings water into the ground. Water that travels over the surface towards drains and streams is runoff.'],
    ['All else being equal, what usually happens to local groundwater recharge when soil is covered by continuous impermeable paving?', 'It tends to decrease', 'It always exactly triples', 'It becomes independent of rainfall', 'It increases because the pavement absorbs water', 'Impermeable paving limits direct infiltration where it is installed. More water can instead leave as surface runoff unless it is routed to an infiltration area.']
  ]),
  ...technology('ISRO and Space', isro('ISRO_EN/Chandrayaan-1_science.html'), [
    ['Which Chandrayaan-1 instrument was used to map the Moon’s surface mineralogy by analysing reflected light?', 'Moon Mineralogy Mapper', 'Terrain Mapping Camera', 'Radiation Dose Monitor', 'Miniature Synthetic Aperture Radar', 'The Moon Mineralogy Mapper was a NASA-contributed imaging spectrometer. The mineral signatures in reflected light vary with composition.'],
    ['Which Chandrayaan-1 instrument was designed to map the height and shape of landforms across the Moon?', 'Terrain Mapping Camera', 'Radiation Dose Monitor', 'Solar Wind Monitor', 'Sub-keV Atom Reflecting Analyzer', 'Its images were used to map lunar topography. The resulting information describes physical elevation and shape, alongside separate measurements of composition.']
  ]),
  ...technology('ISRO and Space', isro('ISRO_EN/Chandrayaan2_science.html'), [
    ['Which Chandrayaan-2 module continued gathering information about the Moon after the 2019 landing attempt?', 'The orbiter', 'The descent-stage lander', 'The surface rover', 'The launch vehicle', 'The orbiter remained around the Moon and carried out remote observations. The earlier separation allowed it to keep observing independently of the landing attempt.'],
    ['Chandrayaan-2’s CHACE-2 instrument was designed to study which target?', 'The Moon’s tenuous exosphere', 'The interior of Earth’s oceans', 'The surface of Venus', 'The solar photosphere', 'This instrument is a mass spectrometer for sampling the sparse neutral particles surrounding the Moon. The exosphere is far thinner than Earth’s atmosphere.']
  ]),
  ...technology('ISRO and Space', isro('Cartosat_3.html'), [
    ['Which Indian Earth observation satellite is a natural choice for high-resolution optical mapping to support urban planning?', 'Cartosat-3', 'Aditya-L1', 'AstroSat', 'GSAT-3', 'Cartosat-3 supplies high-resolution Earth imagery for applications such as land use, infrastructure and urban planning. The other missions have different observation or communication purposes.']
  ]),
  ...technology('ISRO and Space', isro('EOS_06.html'), [
    ['Which Indian satellite continues the Oceansat series of ocean-colour and surface-wind observations?', 'EOS-06', 'Cartosat-3', 'INSAT-3DS', 'Chandrayaan-2 Orbiter', 'EOS-06 is an Oceansat mission. Its instruments collect ocean-colour, sea-surface-temperature and surface-wind measurements.'],
    ['Which EOS-06 instrument is designed to observe changes in the visible colour of the ocean surface?', 'Ocean Color Monitor', 'Sea Surface Temperature Monitor', 'Ku-band scatterometer', 'ARGOS data collection system', 'The Ocean Color Monitor uses optical measurements. Colour patterns help scientists infer features such as changes in phytoplankton abundance.']
  ]),
  ...technology('ISRO and Space', isro('Megha_Tropiques.html'), [
    ['Which partnership developed the Megha-Tropiques satellite?', 'India and France', 'India and Japan', 'India and Brazil', 'India and Germany', 'ISRO and France’s CNES collaborated on Megha-Tropiques, which investigated the tropical water cycle and energy exchanges.'],
    ['What environmental processes were the primary targets of Megha-Tropiques?', 'The water cycle and energy exchanges in the tropics', 'Lunar seismic activity near a rover', 'The formation of craters on Mars', 'The long-term motions of stars around a black hole', 'Clouds, rain and atmospheric water vapour are part of the tropical water and energy cycles studied by the mission.']
  ]),
  ...technology('ISRO and Space', isro('Navic.html'), [
    ['Which Indian system helps civilian aviation by broadcasting corrections and integrity information for GPS?', 'GAGAN', 'NavIC', 'AstroSat', 'Cartosat', 'Developed by ISRO and the Airports Authority of India, GAGAN augments GPS for civil aviation. NavIC is a separate regional navigation system.'],
    ['In a satellite-navigation signal, why is a stable clock useful for positioning?', 'The travel time of a signal is used to estimate distance', 'It changes the colour of the navigation radio signal', 'It removes the need to know the speed of light', 'It allows a receiver to locate itself using the satellite’s colour', 'An error in the measured travel time becomes an error in estimated range. Stable timing improves the distance estimates used to calculate a position.']
  ]),
  ...technology('ISRO and Space', isro('PSLV_C59_PROBA-3_Mission.html'), [
    ['Which space agency’s Proba-3 spacecraft were carried into orbit on India’s PSLV-C59?', 'European Space Agency', 'Japan Aerospace Exploration Agency', 'Canadian Space Agency', 'China National Space Administration', 'PSLV-C59 launched the European Space Agency’s Proba-3 mission. It was a commercial launch for a customer mission.']
  ]),
  ...technology('ISRO and Space', isro('Coronagraphs_India_Aditya_L1_Europe_Proba_3.html'), [
    ['Why does a solar coronagraph block the bright disk of the Sun?', 'To reveal the much fainter solar corona', 'To increase the brightness of the visible disk', 'To separate stars by changing their distance', 'To record seismograms from the Sun’s core directly', 'The bright disk would overwhelm the faint light from the surrounding corona. Blocking the bright region permits images of the outer atmosphere.']
  ]),
  ...technology('ISRO and Space', 'https://science.nasa.gov/Moon/eclipses/', [
    ['Which body is between the Sun and Moon during a lunar eclipse?', 'Earth', 'Mars', 'Venus', 'Mercury', 'Earth’s shadow falls on the Moon when the three bodies line up in the required geometry. A solar eclipse instead occurs when the Moon blocks sunlight from reaching part of Earth.'],
    ['Where must an observer on Earth be to see the fully covered Sun during a total solar eclipse?', 'Inside the Moon’s umbra', 'Inside the Moon’s penumbra only', 'Beyond all parts of the Moon’s shadow', 'Inside Earth’s shadow on the lunar surface', 'The umbra is the region where the Sun’s disk is fully blocked. From the penumbra only part of the disk is obscured.']
  ]),
  ...technology('Research Institutions', 'https://www.nplindia.in/clockcode/html/', [
    ['Which Indian institution maintains the official Indian Standard Time reference?', 'CSIR–National Physical Laboratory', 'National Institute of Oceanography', 'India Meteorological Department', 'Physical Research Laboratory', 'CSIR–NPL maintains India’s time standard. Precise measurement and reference standards are central responsibilities of a national metrology institute.']
  ]),
  ...technology('Research Institutions', 'https://www.csir.res.in/en/Physical-sciences', [
    ['Which CSIR institute is based in Goa and studies the ocean?', 'National Institute of Oceanography', 'National Geophysical Research Institute', 'Central Electronics Engineering Research Institute', 'Central Scientific Instruments Organisation', 'The National Institute of Oceanography in Goa is the CSIR centre associated with ocean science. The other laboratories focus on different physical science and engineering fields.'],
    ['Which Hyderabad institute in the CSIR network specialises in geophysical research?', 'National Geophysical Research Institute', 'National Institute of Oceanography', 'National Physical Laboratory', 'Central Scientific Instruments Organisation', 'The National Geophysical Research Institute applies physical methods to study the Earth, from its surface and subsurface to deeper structures.']
  ]),
  ...technology('Emerging Technology', 'https://www.energy.gov/cmei/systems/how-does-solar-energy-work', [
    ['Which conversion takes place inside a photovoltaic cell?', 'Light energy is converted into electrical energy', 'Mechanical rotation is converted into chemical energy', 'Stored heat directly becomes sound energy', 'Electrical energy is converted into moving wind', 'Light absorbed by the semiconductor creates mobile charge carriers. The cell’s internal electric field separates the charges to allow electric current.'],
    ['What do the mirrors in a concentrating solar-thermal plant mainly do?', 'Focus sunlight to heat a receiver', 'Create radio waves to heat the ground', 'Convert light directly to electric current', 'Cool the receiver by blocking sunlight', 'Concentrating mirrors direct sunlight onto a receiver. The heat may be transferred, stored or used to generate electricity.']
  ]),
  ...technology('Emerging Technology', 'https://www.energy.gov/cmei/systems/how-do-wind-turbines-work', [
    ['What part of a wind turbine converts the rotor’s mechanical motion into electricity?', 'Generator', 'Blade tip', 'Tower', 'Wind direction vane', 'The blades and rotor capture motion from air. The generator converts the resulting mechanical motion into electric power.']
  ]),
  ...technology('Emerging Technology', 'https://www.energy.gov/cmei/systems/solar-integration-solar-energy-and-storage-basics', [
    ['What is the main form of stored energy when a rechargeable battery is charged?', 'Chemical potential energy', 'Gravitational potential energy', 'Rotational kinetic energy', 'Sound energy', 'Charging drives chemical changes that can later be reversed during discharge, returning part of the stored energy as electricity.'],
    ['A pumped-storage hydro facility has surplus electricity at midday. How can it store some of that energy?', 'Pump water from a lower reservoir to a higher one', 'Drain the higher reservoir through an idle pipe', 'Heat water in the lower reservoir until it boils', 'Leave both reservoirs connected at the same level', 'Moving water uphill stores gravitational potential energy. When demand rises, downward flow through a turbine can recover part of it as electricity.']
  ])
];
