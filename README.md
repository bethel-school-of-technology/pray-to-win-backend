# Pray To Win BACKEND

This is the backend for our app MoodRinger. The primary function of our app is to log and document your moods throughout your days to help see if we can spot a pattern in your mood shifts.

## Run Locally

Clone the project

```bash
  git clone https://github.com/bethel-school-of-technology/pray-to-win-backend
```

Go to the project directory

```bash
  cd pray-to-win-backend
```

Install dependencies

```bash
  npm install
```

Start the server in DEV DEBUG mode. This mode has the added benefit of showing request and response body in the terminal as well as logs of each route triggered in express.

```bash
  npm run start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URL`
`MONGODB_COLLECTION`
`MONGODB_USER`
`MONGODB_PASS`
`NODE_ENV`
`PORT`
`SECRET`

## Package.json Scripts

### Start Server with PM2

```bash
  npm run prod-start
```

This will start the server with PM2 which will auto-restart the server if it crashes as well as run the server in the background of your terminal and keep the server alive. This is intended to be used in a production environment to restart server in case there is a crash.

### View PM2 Logs from Server Instance

```bash
  npm run prod-logs
```

This allows you to view the logs from the PM2 server instance.

### Kill PM2 Server Instance

```bash
  npm run prod-kill
```

This kills the PM2 Server instance completely.

### Kill ALL PM2 Instances

```bash
  npm run prod-killall
```

This is intended as a shortcut command to kill ALL PM2 instances in case of some weird malfunction.

## Documentation

[API Documentation](https://documenter.getpostman.com/view/18673337/UVJigZJL)

## Authors

- [Ryan Boeckenstedt](https://github.com/ryanboe29)
- [William Ward](https://www.github.com/mydubs)
- [Carson Minihan](https://github.com/CarsonMinihan)
