# SimBusiness Deployment Script
# This script helps automate the deployment process

Write-Host "🚀 SimBusiness Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "❌ Git not initialized. Initializing now..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Check current remote
Write-Host "📋 Checking Git remote..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>$null

if ($remote) {
    Write-Host "Current remote: $remote" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  You need to update the remote to your GitHub repository" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To update remote, run:" -ForegroundColor Cyan
    Write-Host "  git remote remove origin" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/simbusiness.git" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "No remote configured. You'll need to add one." -ForegroundColor Yellow
    Write-Host ""
}

# Check if all files are committed
Write-Host "📦 Checking Git status..." -ForegroundColor Yellow
$status = git status --porcelain

if ($status) {
    Write-Host "⚠️  You have uncommitted changes. Committing now..." -ForegroundColor Yellow
    git add .
    git commit -m "Prepare for Vercel deployment with all features"
    Write-Host "✅ Changes committed!" -ForegroundColor Green
} else {
    Write-Host "✅ All changes are committed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create a GitHub repository at https://github.com/new" -ForegroundColor White
Write-Host "2. Update the git remote (commands shown above)" -ForegroundColor White
Write-Host "3. Push to GitHub" -ForegroundColor White
Write-Host "4. Go to https://vercel.com and deploy" -ForegroundColor White
Write-Host ""
Write-Host "📄 See DEPLOYMENT_READY.md for complete instructions" -ForegroundColor Cyan
Write-Host ""

