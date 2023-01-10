### Development
You will need to have a working postgresql DB. You can either create 

### Using Docker
Start

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

Stop

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```
