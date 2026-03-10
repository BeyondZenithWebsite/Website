import { PrismaClient, Category } from '@prisma/client';
const prisma = new PrismaClient();

const basePois: Array<{name:string; slug:string; lat:number; lng:number; category: Category; summary:string; suburb:string}> = [
  ['Flinders Street Station','flinders-street-station',-37.8183,144.9671,'history','Melbourne’s iconic station clock has coordinated city life for generations.','Melbourne'],
  ['Federation Square','federation-square',-37.81798,144.96907,'culture','A cultural hub blending architecture, galleries, and public events.','Melbourne'],
  ['Hosier Lane','hosier-lane',-37.8169,144.9692,'art','Street art evolves daily in this globally known laneway.','Melbourne'],
  ['State Library Victoria','state-library-victoria',-37.8097,144.9653,'history','A civic landmark where ideas, archives, and public life intersect.','Melbourne'],
  ['Old Melbourne Gaol','old-melbourne-gaol',-37.8078,144.9653,'crime','A former prison with stories of justice, punishment, and reform.','Melbourne'],
  ['ACMI','acmi',-37.8175,144.9690,'pop_culture','Australia’s museum of screen culture and digital storytelling.','Melbourne'],
  ['Degraves Street','degraves-street',-37.8172,144.9664,'food','Coffee culture and laneway dining define this central strip.','Melbourne'],
  ['Block Arcade','block-arcade',-37.8165,144.9638,'architecture','Victorian elegance and retail heritage under mosaic floors.','Melbourne'],
  ['Royal Arcade','royal-arcade',-37.8159,144.9647,'architecture','Historic arcade connecting city blocks through ornate design.','Melbourne'],
  ['Chinatown Melbourne','chinatown-melbourne',-37.8105,144.9672,'culture','One of the oldest Chinese settlements in the western world.','Melbourne'],
  ['Parliament House','parliament-house-melbourne',-37.8101,144.9732,'history','Seat of Victorian democracy and civic debate.','Melbourne'],
  ['Carlton Gardens Edge','carlton-gardens-edge',-37.8060,144.9713,'hidden_gems','Green relief beside dense city blocks and heritage structures.','Carlton'],
  ['Melbourne Town Hall','melbourne-town-hall',-37.8149,144.9679,'history','Ceremonial heart of the city’s public events and governance.','Melbourne'],
  ['St Pauls Cathedral','st-pauls-cathedral',-37.8170,144.9678,'architecture','Neo-Gothic church anchoring a busy urban intersection.','Melbourne'],
  ['Yarra River Promenade','yarra-river-promenade',-37.8200,144.9660,'culture','The riverfront reveals Melbourne’s industrial and leisure layers.','Southbank'],
  ['Southbank Arts Precinct','southbank-arts-precinct',-37.8210,144.9688,'art','Concentration of performance venues and creative institutions.','Southbank'],
  ['Immigration Museum','immigration-museum',-37.8191,144.9607,'culture','Stories of movement, identity, and belonging in Australia.','Melbourne'],
  ['Queen Victoria Market','queen-victoria-market',-37.8076,144.9568,'food','A historic market with produce, stories, and city rhythms.','Melbourne'],
  ['Flagstaff Gardens','flagstaff-gardens',-37.8113,144.9542,'hidden_gems','One of Melbourne’s oldest parks and elevated viewpoints.','West Melbourne'],
  ['Docklands Library','docklands-library',-37.8140,144.9449,'architecture','Contemporary civic design in a redeveloped waterfront district.','Docklands'],
  ['Birrarung Marr','birrarung-marr',-37.8187,144.9738,'culture','Public open space reconnecting city and river landscapes.','Melbourne'],
  ['Treasury Gardens','treasury-gardens',-37.8135,144.9759,'hidden_gems','Historic gardens beside state institutions and old terraces.','East Melbourne'],
  ['Her Majesty’s Theatre','her-majestys-theatre',-37.8107,144.9698,'pop_culture','A long-running stage for theatre and cultural memory.','Melbourne'],
  ['NGV International','ngv-international',-37.8226,144.9689,'art','Australia’s major gallery for global and local art narratives.','Southbank'],
  ['Eureka Tower','eureka-tower',-37.8216,144.9647,'architecture','A skyline marker tied to residential vertical growth.','Southbank'],
  ['Rialto Towers','rialto-towers',-37.8183,144.9557,'architecture','Corporate tower era that reshaped the CBD profile.','Melbourne'],
  ['Hardware Lane','hardware-lane',-37.8121,144.9607,'food','Laneway hospitality in former warehousing grids.','Melbourne'],
  ['Little Lon District','little-lon-district',-37.8116,144.9644,'crime','Former slum quarter now layered into modern development.','Melbourne'],
  ['Princess Theatre','princess-theatre',-37.8109,144.9714,'famous_people','Linked to performers, myths, and theatre lore.','Melbourne'],
  ['Melbourne Central Shot Tower','shot-tower',-37.8102,144.9624,'history','A preserved industrial structure embedded in retail architecture.','Melbourne']
].map(([name, slug, lat, lng, category, summary, suburb]) => ({name, slug, lat, lng, category, summary, suburb})) as any;

export async function seed() {
  for (const p of basePois) {
    await prisma.poi.upsert({
      where: { slug: p.slug },
      update: {
        latitude: p.lat,
        longitude: p.lng,
        category: p.category,
        shortSummary: p.summary,
        suburb: p.suburb,
        city: 'Melbourne',
        tags: ['melbourne','cbd',p.category],
        sourceType: 'curated_seed',
        sourceUrl: 'https://www.visitmelbourne.com/'
      },
      create: {
        slug: p.slug,
        name: p.name,
        latitude: p.lat,
        longitude: p.lng,
        city: 'Melbourne',
        country: 'Australia',
        category: p.category,
        shortSummary: p.summary,
        shortStory: `${p.name} is one of Melbourne CBD's most talked about places. ${p.summary}`,
        longStory: `${p.name} reflects how Melbourne evolved through migration, planning, and public life. ${p.summary} This longer story gives city context while you walk.`,
        transcript: `${p.name} is one of Melbourne CBD's most talked about places. ${p.summary}`,
        audioUrl: `/audio/mock-${p.slug}.mp3`,
        suburb: p.suburb,
        tags: ['melbourne','cbd',p.category],
        sourceType: 'curated_seed',
        sourceUrl: 'https://www.visitmelbourne.com/',
        interestScore: 0.5 + Math.random() * 0.5,
        confidenceScore: 0.85,
        isActive: true
      }
    });
  }

  await prisma.$executeRawUnsafe(`
    UPDATE "Poi"
    SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude),4326)::geography
    WHERE geom IS NULL;
  `);

  console.log(`Seeded ${basePois.length} POIs`);
}

if (require.main === module) seed().finally(() => prisma.$disconnect());
