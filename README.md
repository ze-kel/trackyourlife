### Current state

updated: 26.03.2023

Right now only basic functionality is implemented(no stats, no mobile version, limited customization, etc.). I'm trying to polish existing things before moving and it takes time.

I intend to keep working on it for the foreseable future.

### TrackYourLife

App to track stuff. Kinds of like a habit tracker but more: data types, customization, etc.

![](./public/screenshot.jpg)

### Self hosting

You can develop locally using composeU.sh and composeD.sh
Start

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

Stop

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```
