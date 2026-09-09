# Install Nadav PC worker into current user Startup (hidden).
# Run once: powershell -ExecutionPolicy Bypass -File ops\scripts\install-nadav-startup.ps1
$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$vbs = Join-Path $root "NADAV-PC.vbs"
if (-not (Test-Path $vbs)) { throw "Missing NADAV-PC.vbs at $vbs" }

$startup = [Environment]::GetFolderPath("Startup")
$link = Join-Path $startup "AZToDev-Nadav-PC.lnk"
$w = New-Object -ComObject WScript.Shell
$sc = $w.CreateShortcut($link)
$sc.TargetPath = "wscript.exe"
$sc.Arguments = "`"$vbs`""
$sc.WorkingDirectory = "$root"
$sc.WindowStyle = 7
$sc.Description = "AZToDev Nadav PC worker - polls ChemiCloud desk queue"
$sc.Save()
Write-Host "Installed: $link"
Write-Host "Starting once now..."
Start-Process -FilePath "wscript.exe" -ArgumentList "`"$vbs`"" -WindowStyle Hidden
Write-Host "Done. Nadav starts with Windows logon."
