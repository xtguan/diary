import thumb from '../photos/2025-12-25-tampa/IMG_9686.jpg'

const photoModules = import.meta.glob('../photos/**/*.{jpg,jpeg,png,svg,JPG,JPEG,PNG}', { eager: true, import: 'default' })

const photoLookup = Object.fromEntries(
  Object.entries(photoModules).map(([path, src]) => {
    const normalized = path
      .replace('../photos/', '')
      .replace(/^\/+/, '')
      .replace(/^src\//, '')
    return [normalized, src]
  })
)

function resolveBlogImage(src) {
  const cleaned = src.replace(/^\/+/, '').replace(/^src\//, '')
  const normalized = cleaned.replace(/^photos\//, '')
  if (photoLookup[normalized]) return photoLookup[normalized]
  const basename = normalized.split('/').pop()
  return photoLookup[basename] || src
}

const content = `
# A Christmas Trip to Tampa

*December 28, 2025 — Tampa, Florida*

I've always thought there's something a little rebellious about spending Christmas somewhere warm. Back home, December means layers, grey skies, and the particular kind of cold that settles into your bones before you've even made it to the car. So when the idea of Tampa came up, I didn't need much convincing. Sunshine, seafood, and streets I'd never walked before — that sounded exactly right.

This is the story of a few days in a city that surprised me in the best way possible.

## Departure — Through Dulles

Every trip has that moment where it starts to feel real. For me, it was standing in the terminal at **Dulles International Airport** in Virginia, coffee in hand, watching planes push back from the gates. The hustle of an airport is weirdly comforting — everyone going somewhere, everyone carrying their own quiet excitement.

![Arriving at Dulles](/src/photos/2025-12-25-tampa/IMG_9621.jpg)

There's something about airports that makes me reflective. Maybe it's the liminal quality of the space — you're not quite where you were, and not yet where you're going. I stood there for longer than I needed to, just taking it in.

![Ready to fly](/src/photos/2025-12-25-tampa/IMG_9622.jpg)

The flight south was smooth. And when the doors opened in Tampa and that warm air hit my face — genuinely warm, not "slightly less cold" warm — I felt my shoulders drop about two inches. That involuntary exhale when your body finally relaxes. That's the feeling.

## Harbour Island — Slow Mornings by the Water

I hadn't planned to spend so much time on **Harbour Island**, but it ended up being one of my favourite parts of the trip. It's a small, walkable neighbourhood connected to downtown by a short bridge, and it has this lovely, unhurried quality — like the rest of Tampa agreed to leave it alone.

![Harbour Island waterfront](/src/photos/2025-12-25-tampa/IMG_9686.jpg)

The waterfront path winds along the edge of the island with views across the bay to the city skyline. I walked it slowly, stopping whenever the light hit the water in a way that felt worth remembering. There were joggers, dog walkers, a couple sitting on a bench sharing something from a paper bag. Normal life, lived beautifully.

![Along the water](/src/photos/2025-12-25-tampa/IMG_9687.jpg)

For lunch we ended up at **Harpoon Harry's Crab House** on South Franklin Street, which turned out to be one of those meals you talk about for weeks after. Fresh Florida crab, cold drinks, the bay right outside the window. I genuinely considered cancelling the rest of the trip and just staying there forever.

![Exploring the island](/src/photos/2025-12-25-tampa/IMG_9698.jpg)

The afternoon stretched out slowly, the way good afternoons do when you have nowhere urgent to be. We wandered without a destination, following whichever path looked interesting, doubling back when something caught the eye.

![Waterfront views](/src/photos/2025-12-25-tampa/IMG_9700.jpg)

## Channelside — The City Wakes Up

From Harbour Island it's an easy walk to the **Channelside** district, and the energy shifts noticeably. It's more urban, more active — boats in the marina, people spilling out of restaurants, the skyline close enough to feel like it's leaning in.

![Channelside Drive](/src/photos/2025-12-25-tampa/IMG_9716.jpg)

I love that transitional time of day in a city when the afternoon light is going golden and everyone seems to be migrating toward food and conversation. Channelside had that feeling in abundance. We found a spot to sit outside and watched the city do its thing for a while.

![Downtown Tampa](/src/photos/2025-12-25-tampa/IMG_9892.jpg)

The water keeps showing up in Tampa, no matter where you are. It's never far. And at that hour, with the light coming low across the bay, the reflections were almost too good to be real.

![City reflections](/src/photos/2025-12-25-tampa/IMG_9894.jpg)

## Ybor City — History You Can Taste

If Harbour Island is Tampa's peaceful side, **Ybor City** is its soul. This historic Cuban quarter was built by immigrant cigar rollers in the late 1800s and it still carries that spirit — proud, colourful, a little rough around the edges in the best possible way.

![Hotel Haya, Ybor City](/src/photos/2025-12-25-tampa/IMG_9905.jpg)

We stayed at **Hotel Haya** on East 7th Avenue, and I can't say enough about it. The building is a beautifully restored piece of history — exposed brick, high ceilings, that specific kind of character that modern hotels spend millions trying to manufacture and almost never achieve. Waking up there each morning felt like a small luxury.

![7th Avenue, Ybor City](/src/photos/2025-12-25-tampa/IMG_9906.jpg)

By day, 7th Avenue is all murals and coffee shops and the occasional rooster wandering the sidewalk like he owns the place (he kind of does). There's a cigar shop on nearly every block, and if you stop to watch someone hand-rolling, they'll usually chat with you about it. People here seem proud of where they live, and that pride is contagious.

![Ybor City streets](/src/photos/2025-12-25-tampa/IMG_9922.jpg)

I kept stopping to look up at the buildings — the wrought iron balconies, the painted brickwork, the old signs half-faded into the walls. Every facade is a little piece of history that managed to survive. There's something moving about that, about a neighbourhood that held onto its identity through everything.

![Historic architecture](/src/photos/2025-12-25-tampa/IMG_9934.jpg)

## Homosassa Springs — Where Florida Gets Wild

About an hour north of Tampa, tucked into the quiet of Citrus County, is **Homosassa Springs Wildlife State Park** — and it turned out to be one of the most memorable detours of the whole trip.

The park sits on a natural spring that stays a constant 72°F year-round, which means Florida's wildlife shows up here in abundance and at close range. I wasn't entirely sure what to expect, but I left genuinely moved by the place.

The first thing that stopped me in my tracks was a **great egret** standing perfectly still at the edge of a glassy pond, its reflection mirrored in the water below. It didn't flinch. It wasn't performing — it was just existing in that unhurried egret way, utterly unbothered by the humans nearby.

![Great Egret at Homosassa Springs](/src/photos/2025-12-25-tampa/IMG_20251228_123342.JPG)

A little further along the path, almost invisible until you were right on top of it, was an **alligator** resting in the duckweed-covered water — just its head and the ridge of its back breaking the surface. One of those moments where you simultaneously want to get closer and remember that you shouldn't.

![Alligator in the springs](/src/photos/2025-12-25-tampa/IMG_20251228_123549.JPG)

The park is home to several rescued **whooping cranes** — one of the most endangered birds in North America. Seeing them up close, with their distinctive red crown patches and their slow, dignified movements, felt genuinely rare and precious. These birds nearly went extinct in the 20th century. The fact that they're here at all is a small miracle.

![Whooping Cranes](/src/photos/2025-12-25-tampa/IMG_20251228_124439.JPG)

Then came the flamingos. I know that sounds like I'm burying the lead, but somehow the cranes earned the bigger reaction. Still — a **flamingo** wading in shallow water with that absurd, gorgeous pink, surrounded by white ibises perched on feeding stations, is not something you forget quickly.

![Flamingos and Ibises](/src/photos/2025-12-25-tampa/IMG_20251228_124527.JPG)

Below the surface, through the underwater observatory window, a dense school of fish drifted past in the spring water — dark shapes moving together as one, the green water catching the light in a way that made it look almost otherworldly.

![School of fish beneath the spring](/src/photos/2025-12-25-tampa/IMG_20251228_130132.JPG)

And on the way back, the seagulls made their opinions known. We'd stopped briefly near the beach and within approximately ninety seconds, a squad of ring-billed gulls had descended on our things with absolutely zero shame. One was mid-air, wings spread, going directly for the snacks. Chaos. Hilarious in retrospect, slightly less so in the moment.

![Seagulls causing trouble](/src/photos/2025-12-25-tampa/IMG_20251228_173000.JPG)

Homosassa Springs is one of those places that quietly resets something in you. It's not dramatic or flashy — it's just Florida in its most honest, unhurried form. I'd go back in a heartbeat.

## The Unplanned Hours

Some of my favourite memories from this trip came from the hours with no plan at all. Just picking a direction and walking, camera in hand, letting the city show itself.

![Tampa scenes](/src/photos/2025-12-25-tampa/IMG_9953.jpg)

There's a kind of attention you develop when you're travelling and paying close attention — a heightened noticing of things. The way light falls through a gap between buildings. A conversation you catch a fragment of. The smell of something being cooked somewhere nearby. Tampa rewarded that attention generously.

![Golden hour](/src/photos/2025-12-25-tampa/IMG_9954.jpg)

The December light here was genuinely extraordinary — warm and low, casting long shadows and making everything glow. I kept thinking I'd put the camera away and just enjoy it, and then the light would do something else and the camera would come back out.

![City life](/src/photos/2025-12-25-tampa/IMG_9955.jpg)

Street photography feels different in every city. Tampa had a looseness to it — people were relaxed, unhurried, happy to exist in the frame without performing for it.

![Street photography](/src/photos/2025-12-25-tampa/IMG_9956.jpg)

The best moments of any trip, I've found, are the ones that happen in between — between destinations, between meals, between intentions. A quiet side street. A dog sleeping in a patch of sun. Two old men playing chess outside a café. You can't plan for those moments. You just have to be present enough to catch them.

![Quiet moments](/src/photos/2025-12-25-tampa/IMG_9957.jpg)

That last-light feeling at the end of a day of wandering is one of my favourite things in the world. Tired in the good way. Full. Knowing you squeezed something real out of the day.

![Last light](/src/photos/2025-12-25-tampa/IMG_9958.jpg)

## After Dark — The DSLR Hours

The second half of the trip, I switched to the DSLR and slowed everything down. Fewer shots, more deliberate. Looking for the quieter, moodier version of the same city.

![Tampa in film tones](/src/photos/2025-12-25-tampa/_DSC3860.jpg)

There's a patience that comes with shooting on a bigger camera — you can't just fire off ten frames and hope one works. You wait. You watch. You think about what you're actually trying to say with the image. I find it meditative, honestly.

![Streets at dusk](/src/photos/2025-12-25-tampa/_DSC3861.jpg)

The warm Tampa light, which had been gorgeous all day, became something almost painterly in the late afternoon. Long shadows, rich colours, everything softened.

![Warm light](/src/photos/2025-12-25-tampa/_DSC3864.jpg)

I spent a lot of time looking at buildings close-up — the details that get lost when you're trying to capture a whole scene. A rusted hinge. A tiled doorstep. A window with the curtain half-drawn. Cities are made of details.

![Architecture detail](/src/photos/2025-12-25-tampa/_DSC3888.JPG)

Looking up is always underrated. The rooflines and balconies of Ybor City are a whole other city on top of the city.

![Tampa rooftops](/src/photos/2025-12-25-tampa/_DSC3898.JPG)

Texture became an obsession by this point — the peeling paint and sun-bleached brick, the way old surfaces hold the light differently than new ones.

![City textures](/src/photos/2025-12-25-tampa/_DSC3984.JPG)

As evening came in, the streets quieted a little before the night crowd arrived. That in-between hour has its own particular beauty.

![Evening walk](/src/photos/2025-12-25-tampa/_DSC3986.JPG)

Tampa's relationship with water means there are reflections everywhere — in puddles, in windows, in the bay. I never got tired of it.

![Reflections](/src/photos/2025-12-25-tampa/_DSC3989.jpg)

There are streets in Ybor City that feel genuinely unchanged from decades ago. Standing on them, you get a faint echo of all the people who walked the same stones before you.

![Quiet street](/src/photos/2025-12-25-tampa/_DSC3995.jpg)

And then night falls properly and Ybor City comes alive in a completely different way. The bars open, the music spills out, the neon signs buzz to life. The whole mood shifts.

![Ybor at night](/src/photos/2025-12-25-tampa/_DSC3999.jpg)

There's real joy in a neighbourhood that knows how to have a good time. Ybor at night has that energy — unpretentious and genuinely fun.

![Night life](/src/photos/2025-12-25-tampa/_DSC4000.jpg)

Every time I thought I was done shooting for the night, something else would catch my eye. The way neon reflects off wet pavement. A group of friends tumbling out of a bar laughing. A musician setting up in a doorway.

![Neon lights](/src/photos/2025-12-25-tampa/_DSC4005.jpg)

Tampa after dark is a different city — warmer in some ways, wilder in others. Worth every late night.

![Tampa after dark](/src/photos/2025-12-25-tampa/_DSC4009.JPG)

Near the end of any trip, each photo starts to feel like a small act of holding on. You know you're nearly out of time, and somehow that sharpens everything.

![Closing time](/src/photos/2025-12-25-tampa/_DSC4022.jpg)

And then it was the last frame. The last morning. The cab to the airport, the reverse journey home, back to the cold.

![Last frame](/src/photos/2025-12-25-tampa/_DSC4040.jpg)

---

*Tampa in late December is a city that gives you exactly what you didn't know you needed. The warmth, yes — but also the pace, the food, the neighbourhood character, the light. I came back with a full memory card, a few extra pounds from the seafood, and a genuine fondness for a city I'd barely thought about before. That's the best kind of trip.*

*Already thinking about going back.*
`
  .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => `![${alt}](${resolveBlogImage(src)})`)

export default {
  slug: 'christmas-trip-to-tampa',
  title: 'A Christmas Trip to Tampa',
  date: '2025-12-28',
  category: 'travel',
  tags: ['travel', 'tampa', 'photography', 'florida'],
  thumbnail: thumb,
  content
}
