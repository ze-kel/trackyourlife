### Current state

updated: 26.03.2023

Right now only basic functionality is implemented(no stats, no mobile version, limited customization, etc.). I'm trying to polish existing things before moving and it takes time.

I intend to keep working on it for the foreseable future.

### TrackYourLife

App to track stuff. Kinds of like a habit tracker but more: data types, customization, etc.

![](./public/screenshot.jpg)

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
