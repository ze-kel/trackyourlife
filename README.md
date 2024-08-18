### TrackYourLife

App to track stuff. Kinds of like a habit tracker but more: data types, customization, etc.

### Current state

updated: 18.08.2024

I use it as habit tracker personally, however I would not call this stable, because I have more interest in tinkering with various tech pursuing that perfect stack.
There might be polishing and more features, but I'm more likely to dump time into one of three time consuming refactors in the next year:

1. Move to tanstack start: I'm not happy with server components for app like this, and if I just do 'use client' everywhere app loses SSR
2. Rework data fetching to some local-first solution(zerosync?). Current tanstack query setup is fine for a website, but not good enough for app(thats why app is postponed atm)
3. Rework data storage to support multiple data points in a single day

### Development

Option A:
Run next locally, host postgres somewhere.

1. Create remote database
2. Add .env.development with "DATABASE_URL" defined
3. Run `npm run dev`
4. http://localhost:3000/

Option B:
Use docker to spin up local postgres

1. Install docker
2. Run `make start-development`
3. http://localhost:1337/

To run e2e test add "TEST_URL" to your .env.development and run `npm run test`

### Deployment

1. git clone
2. `make build-production`
3. `make start-production`
