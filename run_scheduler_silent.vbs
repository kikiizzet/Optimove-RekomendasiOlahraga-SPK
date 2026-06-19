Set oShell = CreateObject("WScript.Shell")
oShell.Run "cmd /c cd /d d:\syauqikodinh\Optimove && php artisan schedule:run >> storage\logs\scheduler.log 2>&1", 0, False
