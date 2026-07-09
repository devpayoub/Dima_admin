param(
  [string]$srcDir = "C:\Users\THEGOAT\Desktop\stampee-main\ar\src"
)

$pages = @{
  "app\page.tsx"                            = @{ FeatureDir = "features\auth"; Name = "LoginPage" }
  "app\dashboard\page.tsx"                  = @{ FeatureDir = "features\dashboard"; Name = "DashboardPage" }
  "app\dashboard\campaigns\page.tsx"        = @{ FeatureDir = "features\campaigns"; Name = "CampaignsPage" }
  "app\dashboard\campaigns\[id]\page.tsx"   = @{ FeatureDir = "features\campaigns"; Name = "CampaignDetailPage" }
  "app\dashboard\users\page.tsx"            = @{ FeatureDir = "features\users"; Name = "UsersPage" }
  "app\dashboard\users\[id]\page.tsx"       = @{ FeatureDir = "features\users"; Name = "UserDetailPage" }
}

$components = @{
  "components\AdminAuthGuard.tsx"  = "features\auth\AdminAuthGuard.tsx"
  "components\Sidebar.tsx"         = "features\dashboard\Sidebar.tsx"
  "components\CampaignQrDialog.tsx" = "features\campaigns\CampaignQrDialog.tsx"
  "components\CardEditor.tsx"      = "features\campaigns\CardEditor.tsx"
  "components\TemplatePicker.tsx"  = "features\campaigns\TemplatePicker.tsx"
}

# 1. Copy page content to features/ + rewrite app/ as import wrapper
Write-Host "=== Moving pages to features/ ==="
foreach ($srcRel in $pages.Keys) {
  $srcPath = Join-Path $srcDir $srcRel
  $info = $pages[$srcRel]
  $dstPath = Join-Path $srcDir "$($info.FeatureDir)\$($info.Name).tsx"
  $importPath = ($info.FeatureDir + "/" + $info.Name) -replace '\\', '/' -replace '^features/', '@/features/'

  if (-not (Test-Path $srcPath)) {
    Write-Warning "Source not found: $srcPath"
    continue
  }

  # Copy content to feature file (keeping 'use client' if present)
  $content = Get-Content -LiteralPath $srcPath -Raw
  Set-Content -LiteralPath $dstPath -Value $content -NoNewLine -Encoding UTF8

  # Rewrite app/ page as import + re-export wrapper (default import since feature file has 'export default function')
  $wrapper = "'use client';`nimport $($info.Name) from '$importPath';`nexport default $($info.Name);`n"
  Set-Content -LiteralPath $srcPath -Value $wrapper -NoNewLine -Encoding UTF8

  Write-Host "  OK $srcRel -> $($info.FeatureDir)\$($info.Name).tsx"
}

# 2. Copy components to features/
Write-Host "`n=== Moving components to features/ ==="
foreach ($srcRel in $components.Keys) {
  $srcPath = Join-Path $srcDir $srcRel
  $dstRel = $components[$srcRel]
  $dstPath = Join-Path $srcDir $dstRel
  if (Test-Path $srcPath) {
    $content = Get-Content -LiteralPath $srcPath -Raw
    Set-Content -LiteralPath $dstPath -Value $content -NoNewLine -Encoding UTF8
    Write-Host "  OK $srcRel -> $dstRel"
  } else {
    Write-Warning "  SKIP $srcRel (not found)"
  }
}

# 3. Update all import references
Write-Host "`n=== Updating import references ==="
$oldNewMap = @{
  "@/components/AdminAuthGuard"   = "@/features/auth/AdminAuthGuard"
  "@/components/Sidebar"          = "@/features/dashboard/Sidebar"
  "@/components/CampaignQrDialog" = "@/features/campaigns/CampaignQrDialog"
  "@/components/CardEditor"       = "@/features/campaigns/CardEditor"
  "@/components/TemplatePicker"   = "@/features/campaigns/TemplatePicker"
}

$tsFiles = Get-ChildItem -LiteralPath $srcDir -Recurse -Include "*.tsx", "*.ts" | Where-Object { -not $_.FullName.Contains("node_modules") -and -not $_.FullName.Contains(".next") }

$updatedCount = 0
foreach ($file in $tsFiles) {
  $content = Get-Content -LiteralPath $file.FullName -Raw
  $original = $content
  foreach ($old in $oldNewMap.Keys) {
    $content = $content -replace [regex]::Escape($old), $oldNewMap[$old]
  }
  if ($content -ne $original) {
    Set-Content -LiteralPath $file.FullName -Value $content -NoNewLine -Encoding UTF8
    $updatedCount++
  }
}
Write-Host "  Updated $updatedCount files"

# 4. Delete original component files
Write-Host "`n=== Deleting original component files ==="
foreach ($srcRel in $components.Keys) {
  $srcPath = Join-Path $srcDir $srcRel
  try {
    Remove-Item -LiteralPath $srcPath -Force -ErrorAction Stop
    Write-Host "  DELETED $srcRel"
  } catch {
    Write-Warning "  SKIP $srcRel"
  }
}

Write-Host "`nDONE. Run 'npx next build' to verify."
