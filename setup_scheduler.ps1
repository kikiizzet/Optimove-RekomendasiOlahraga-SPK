$action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "d:\syauqikodinh\Optimove\run_scheduler_silent.vbs"
$trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Minutes 1) -Once -At (Get-Date)
Register-ScheduledTask -TaskName "LaravelScheduler-Optimove" -Action $action -Trigger $trigger -Force
Write-Host "Task berhasil didaftarkan!"
