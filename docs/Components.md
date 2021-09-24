
# Components

- **WebApp** - Client web application written in Angular
- **Signalling** - Asp.Net Core application. Runs SignalR hub that helps to make a call from server to web application.
- **WebApi** - Asp.Net WebApi project. Include controllers that helps to do CRUD actions and more.
- **Scheduler** - 

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
