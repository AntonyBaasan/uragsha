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

Note: For the production we do call migration from the Signalling.Startup class.
Eventually when application needs more scaling, use Kubernetes jobs.
