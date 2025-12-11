Joy is a social media platform for giving and lending items to trusted connections. It consists of a client (currently made in React + TypeScript, with Electron for creating a desktop application), which connects to Vercel functions (not currently implemented) which write and read to and from a Supabase (postgres) database

![Hero image](./docs/images/hero.png)

**Why Joy?**
- Reduce waste and consumption by enabling local reuse.
- Save money
- Strengthen neighborhoods and personal networks through small acts of generosity.
- Offer a friendly, private alternative to public marketplaces.

**The problem** -- 
Many online marketplaces prioritize transactions over relationships. Items are listed to the world, interactions are anonymous, and trust-building is expensive. People who want to give or lend to neighbors often lack a simple, private, and joyful way to do so.
Sometimes you have something that you don't use but that means a lot, and don't want it to end up in the hands of strangers.

**The solution** -- 
Joy focuses on the human experience: a warm, trust-first marketplace for your local circles.
- Post items to give or lend to your network.
- Discover items shared by people you already know or are connected to.
- Allows your well-loved items to end up in the hands of people you care about.
- Message, arrange hand-offs, and celebrate giving moments.

![Items grid](./docs/images/items.png)

**Technology**
- Frontend: React + TypeScript + Vite — fast iteration and modern developer DX.
- Backend: modular DAOs with Postgres/Supabase and optional AWS S3 for media.
- Shared types and models in `joy-shared` for re-use across services and clients.
![Tech Stack](./docs/images/tech_stack.png)

**AI**
- I used AI sparingly for my project. There is nothing implemented in the app that involves AI, but I did use an application called Lovable to generate front-end visuals which I plan on implementing into my actual UI, because the app gives you the code as well.

**Key Learnings**
- First off, I had a really hard time figuring out how to modify the React components to reflect what I wanted. I started from scratch initially, but since my focus with this was not to learn React really well, I ended up copying big chunks of a UI I was using in another class. I realized that I have been working with React for awhile, without knowing how to create something from it, which means I definitely need to take time to learn it well. I still plan on continuing with this, and hopefully becoming more front-end literate
- Second, I have learned that Typescript is so annoying if you are handling your imports incorrectly, because if you use a node module that isn't compatible with your current import format type, you either have to change your type and possibly break other things, or hope that the module has some way to recognize that type. I decided that the best way to do this moving forward is to create a tsconfig.json that is as accepting and compatible as possible with other modules and use it in all of my future Typescript projects
- Third, that I made a huge mistake, which was not planning out what I wanted out of my MVP. This led to me wasting a lot of time nitpicking visuals before I had even started on how I was actually going to showcase the app. Because of this, by the time of the presentation, I had nothing to show for it, except some visuals that weren't yet implemented. If I were to do this again, I would create a bare-bone front-end that allows me to inject fake data for an MVP, and then with whatever time was left, to begin implementing a working back-end one API at a time, so that if I didn't get it all finished, I'd still have something very real to show. I think this is also very applicable to a future job as well, so that I can quickly have something tangible to show for my work that exhibits my ideas easily.