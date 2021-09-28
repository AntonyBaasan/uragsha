#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/runtime:5.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Uragsha.Scheduler.HostedService.csproj", "."]
RUN dotnet restore "./Uragsha.Scheduler.HostedService.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "Uragsha.Scheduler.HostedService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Uragsha.Scheduler.HostedService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Uragsha.Scheduler.HostedService.dll"]