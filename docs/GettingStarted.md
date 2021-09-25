
# Commands to run as Development mode

The project consists of executable [components](Components.md) (applications). These are the command to run all the components one by one. Each command executed from root directory.

### prerequisite
- [Docker](https://www.docker.com/products/docker-desktop)
- [Dotnet](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/en/download/)

### Run database as docker container
```
# this command will run a MySql database on port 3306 (localhost)
cd docker
docker-compose up
```

### Run WebApp (client web application written on Angular)
```
# runs client app on https://localhost:4200 (with --ssl)
cd webapp
npm start
```

### Run Signalling (SignalR) application
```
# runs signalling app on https://localhost:7001
cd server
dotnet run --project .\Uragsha.Signalling
```

### Run WebApi application
```
# runs webapi app on https://localhost:6001
cd server
dotnet run --project .\Uragsha.WebApi
```

### Run Scheduler hosted service application
```
cd server
dotnet run --project .\Uragsha.Sheduler.HostedService\
```
