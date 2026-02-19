$lines = Get-Content 'src\App.tsx'
$newLines = $lines[0..2299] + $lines[2393..($lines.Length-1)]
Set-Content 'src\App.tsx' $newLines -Encoding UTF8
Write-Host "Done. New line count: $($newLines.Length)"
