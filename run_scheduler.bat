@echo off
cd /d d:\syauqikodinh\Optimove
php artisan schedule:run >> storage\logs\scheduler.log 2>&1
