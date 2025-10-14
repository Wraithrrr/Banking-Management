# PowerShell script to rename all instances of "Summit Bank" to "Smart Bank"
# This script will:
# 1. Replace text in all files
# 2. Rename folders
# 3. Rename files

Write-Host "Starting Summit Bank -> Smart Bank conversion..." -ForegroundColor Green

# Define the root directory
$rootDir = "c:\Users\faruk\Projects\Large-Enterprise Management"

# Get all text files (excluding .next build folder, node_modules, and git)
$files = Get-ChildItem -Path $rootDir -Recurse -File -Include *.tsx,*.ts,*.jsx,*.js,*.md,*.json,*.css,*.html |
    Where-Object { 
        $_.FullName -notmatch '\\\.next\\' -and 
        $_.FullName -notmatch '\\node_modules\\' -and 
        $_.FullName -notmatch '\\\.git\\'
    }

Write-Host "Found $($files.Count) files to process..." -ForegroundColor Cyan

# Text replacements (order matters - do most specific first)
$replacements = @(
    @{ Pattern = 'SUMMIT BANK'; Replacement = 'SMART BANK' }
    @{ Pattern = 'Summit Bank'; Replacement = 'Smart Bank' }
    @{ Pattern = 'summit-bank'; Replacement = 'smart-bank' }
    @{ Pattern = 'SummitBank'; Replacement = 'SmartBank' }
    @{ Pattern = 'summitbank'; Replacement = 'smartbank' }
)

# Process each file
$fileCount = 0
foreach ($file in $files) {
    $fileCount++
    Write-Progress -Activity "Processing files" -Status "File $fileCount of $($files.Count)" -PercentComplete (($fileCount / $files.Count) * 100)
    
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $originalContent = $content
        
        # Apply all replacements
        foreach ($replacement in $replacements) {
            $content = $content -replace [regex]::Escape($replacement.Pattern), $replacement.Replacement
        }
        
        # Only write if content changed
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  Updated: $($file.FullName)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "  Error processing $($file.FullName): $_" -ForegroundColor Red
    }
}

Write-Host "`nText replacement complete!" -ForegroundColor Green

# Rename directories (do this bottom-up to avoid path issues)
Write-Host "`nRenaming directories..." -ForegroundColor Cyan
$dirs = Get-ChildItem -Path $rootDir -Recurse -Directory |
    Where-Object { 
        $_.Name -like '*summit*' -or $_.Name -like '*Summit*' 
    } |
    Sort-Object -Property FullName -Descending

foreach ($dir in $dirs) {
    $newName = $dir.Name -replace 'summit-bank', 'smart-bank' -replace 'Summit', 'Smart' -replace 'SummitBank', 'SmartBank'
    if ($newName -ne $dir.Name) {
        $newPath = Join-Path $dir.Parent.FullName $newName
        Write-Host "  Renaming directory: $($dir.Name) -> $newName" -ForegroundColor Yellow
        Rename-Item -Path $dir.FullName -NewName $newName -Force
    }
}

# Rename files
Write-Host "`nRenaming files..." -ForegroundColor Cyan
$filesToRename = Get-ChildItem -Path $rootDir -Recurse -File |
    Where-Object { 
        $_.Name -like '*summit*' -or $_.Name -like '*Summit*'
    }

foreach ($file in $filesToRename) {
    $newName = $file.Name -replace 'summit-bank', 'smart-bank' -replace 'Summit', 'Smart' -replace 'SUMMIT', 'SMART'
    if ($newName -ne $file.Name) {
        $newPath = Join-Path $file.DirectoryName $newName
        Write-Host "  Renaming file: $($file.Name) -> $newName" -ForegroundColor Yellow
        Rename-Item -Path $file.FullName -NewName $newName -Force
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Conversion Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Review the changes with git diff" -ForegroundColor White
Write-Host "2. Update your imports if needed" -ForegroundColor White
Write-Host "3. Delete the .next folder: Remove-Item -Recurse -Force frontend\.next" -ForegroundColor White
Write-Host "4. Rebuild your project: cd frontend; npm run dev" -ForegroundColor White
