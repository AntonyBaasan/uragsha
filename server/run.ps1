$option = Read-Host "Which project you want to run?
    1. All [default]
    2. Uragsha.Signalling
    3. Uragsha.WebApi
"
switch ($option)
{
    2 {Start-Process -FilePath 'dotnet' -WorkingDirectory '.' -ArgumentList 'run --project ./Uragsha.Signalling'; Break}
    3 {Start-Process -FilePath 'dotnet' -WorkingDirectory '.' -ArgumentList 'run --project ./Uragsha.WebApi'; Break}
    # 4 {Start-Process -FilePath 'dotnet' -WorkingDirectory '.' -ArgumentList 'run --project ./Uragsha.Scheduler.HostedService'; Break}
    default {
     Start-Process -FilePath 'dotnet' -WorkingDirectory '.' -ArgumentList 'run --project ./Uragsha.Signalling';
     Start-Process -FilePath 'dotnet' -WorkingDirectory '.' -ArgumentList 'run --project ./Uragsha.WebApi'; 
    #  Start-Process -FilePath 'dotnet' -WorkingDirectory '.' -ArgumentList 'run --project ./Uragsha.Scheduler.HostedService';
    }
}
