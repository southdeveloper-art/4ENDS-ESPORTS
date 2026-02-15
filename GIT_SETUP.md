# Git Setup and Commit Guide

## Current Situation
Git is not currently installed or not in your PATH. You need to install Git for Windows first.

## Step 1: Install Git

### Option A: Download Git for Windows (Recommended)
1. Go to: https://git-scm.com/download/win
2. Download the installer
3. Run the installer with default settings
4. Restart your terminal/PowerShell

### Option B: Install via winget (if you have it)
```powershell
winget install --id Git.Git -e --source winget
```

## Step 2: Configure Git (First Time Only)

After installation, open PowerShell and run:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Initialize Repository and Commit Changes

Navigate to your project folder and run:

```powershell
cd C:\Users\dhanu\Desktop\Websites\4nds

# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create your first commit
git commit -m "feat: Add team and organization management system

- Added login-protected Create Team/Organization buttons on homepage
- Implemented team creation with IGL auto-assignment
- Added role-based invitations (Rusher, Secondary, All-round, Sniper)
- Implemented unique 8-character invite codes
- Added email-restricted joining (only invited emails can use codes)
- Email validation ensures all members are registered
- One team per user enforcement
- Share functionality with copy and native share API
- Organization management with Owner/Admin hierarchy
- Complete modal system with glassmorphism design"
```

## Step 4: Connect to GitHub (Optional)

If you want to push to GitHub:

1. Create a new repository on GitHub.com
2. Copy the repository URL
3. Run these commands:

```powershell
git remote add origin YOUR_GITHUB_URL
git branch -M main
git push -u origin main
```

## Quick Reference - Future Commits

After making changes:

```powershell
# Check what changed
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Your commit message here"

# Push to GitHub (if connected)
git push
```

## Files Modified in This Update

- `index.html` - Added 6 team/org management modals (+122 lines)
- `main.js` - Added team management system (+405 lines)
- Total changes: ~527 lines of new code

## Alternative: GitHub Desktop

If you prefer a GUI, you can use GitHub Desktop:
1. Download: https://desktop.github.com/
2. Install and sign in
3. Click "Add" → "Add Existing Repository"
4. Browse to `C:\Users\dhanu\Desktop\Websites\4nds`
5. Make your commit through the GUI

---

**Once Git is installed, run the commands in Step 3 to commit your changes!**
