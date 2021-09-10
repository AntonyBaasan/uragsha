### Create migration file
```powershell
dotnet ef migrations add InitialCreate --project .\Uragsha.Signalling\Uragsha.Signalling.csproj
```

### Update database until latest migration
```powershell
dotnet ef database update --project .\Uragsha.Signalling\Uragsha.Signalling.csproj
```

### Update database to migration with name "InitialCreate"
```powershell
dotnet ef database update InitialCreate --project .\Uragsha.Signalling\Uragsha.Signalling.csproj
```
