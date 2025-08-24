# Live Tarkov - AI Auto-Sync Script
# Automatically commits and pushes changes to git repository

param(
    [string]$CommitMessage = "Auto-sync: Update mod files",
    [switch]$Force = $false
)

Write-Host "🔄 Live Tarkov - AI Auto-Sync Starting..." -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository!" -ForegroundColor Red
    Write-Host "Please run 'git init' first or navigate to the correct directory." -ForegroundColor Yellow
    exit 1
}

# Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Yellow
$status = git status --porcelain

if (-not $status -and -not $Force) {
    Write-Host "✅ No changes to commit. Repository is up to date." -ForegroundColor Green
    exit 0
}

# Show what will be committed
Write-Host "📝 Changes to be committed:" -ForegroundColor Cyan
git status --short

# Add all changes
Write-Host "📦 Adding all changes..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
try {
    git commit -m $CommitMessage
    Write-Host "✅ Changes committed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to commit changes: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Check if remote exists
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "⚠️  No remote origin found. Please add your GitHub repository:" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/Sycopath/live-tarkov-ai.git" -ForegroundColor White
    Write-Host "✅ Changes committed locally. Push manually when ready." -ForegroundColor Green
    exit 0
}

# Push to remote
Write-Host "🚀 Pushing to remote repository..." -ForegroundColor Yellow
try {
    git push origin main
    Write-Host "✅ Changes pushed successfully to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push changes: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 You may need to set up authentication or check your remote URL." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 Auto-sync completed successfully!" -ForegroundColor Green
Write-Host "📊 Repository is now up to date with your local changes." -ForegroundColor Cyan
