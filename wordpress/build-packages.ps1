param()
$ErrorActionPreference = 'Stop'
$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$PackageDist = Join-Path $PackageRoot 'dist'
New-Item -ItemType Directory -Force -Path $PackageDist | Out-Null

$packages = @(
    @{ Folder = 'hit-theme'; Version = '1.0.1' },
    @{ Folder = 'hit-child'; Version = '1.0.1' },
    @{ Folder = 'hit-core'; Version = '1.0.1' }
)

function New-FileOnlyZip {
    param([string]$SourceDirectory, [string]$DestinationZip)
    $source = (Resolve-Path -LiteralPath $SourceDirectory).Path
    $parent = Split-Path -Parent $source
    $files = Get-ChildItem -LiteralPath $source -Recurse -File | ForEach-Object { $_.FullName.Substring($parent.Length + 1).Replace('\', '/') }
    if (-not $files) { throw "No files found in $source" }
    Push-Location $parent
    try {
        & tar.exe -a -c -f $DestinationZip @files
        if ($LASTEXITCODE -ne 0) { throw "Could not create $DestinationZip" }
    } finally { Pop-Location }
}

foreach ($package in $packages) {
    $generic = Join-Path $PackageDist ($package.Folder + '.zip')
    $versioned = Join-Path $PackageDist ($package.Folder + '-' + $package.Version + '.zip')
    Get-ChildItem -LiteralPath $PackageDist -Filter ($package.Folder + '-*.zip') -File | Where-Object { $_.FullName -ne $versioned } | Remove-Item -Force
    if (Test-Path $generic) { Remove-Item -LiteralPath $generic -Force }
    if (Test-Path $versioned) { Remove-Item -LiteralPath $versioned -Force }
    New-FileOnlyZip -SourceDirectory (Join-Path $PackageRoot $package.Folder) -DestinationZip $generic
    Copy-Item -LiteralPath $generic -Destination $versioned
    Write-Host "Created $generic"
    Write-Host "Created $versioned"
}

