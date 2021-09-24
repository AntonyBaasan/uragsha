
# Commands to run as Development mode

The project consists of executable [components](Components.md) (applications). These are the command to run all the components one by one. Each command executed from root directory.

### Run database as docker container
```
# this command will run a MySql database on port 3306 (localhost)
cd docker
docker-compose up
```

### Run WebApp (client web application written on Angular)
```
# run client app on https://localhost:4200 (with --ssl)
cd webapp
npm start
```

### Run Signalling (SignalR) application
```
# run client app on https://localhost:4200 (with --ssl)
cd server
dotnet run --project .\Uragsha.Signalling
```

### Run WebApi application
```
# run client app on https://localhost:4200 (with --ssl)
cd server
dotnet run --project .\Uragsha.WebApi
```

### Run Scheduler hosted service application
```
# run client app on https://localhost:4200 (with --ssl)
cd server
dotnet run --project .\Uragsha.Sheduler.HostedService\
```
