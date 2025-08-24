# 🚀 Git Auto-Sync Setup Guide

## 🎯 **What This Does**

Automatically syncs your mod folder changes to GitHub, eliminating the need to manually copy files between folders.

## 📋 **Prerequisites**

- Git installed on your system
- GitHub repository created
- GitHub authentication set up (Personal Access Token or SSH key)

## 🔧 **Setup Steps**

### **Step 1: Initialize Git Repository (Already Done!)**
```bash
git init
```
✅ **Status**: Repository initialized in your mod folder

### **Step 2: Add Your GitHub Remote**
```bash
git remote add origin https://github.com/Sycopath/live-tarkov-ai.git
```

### **Step 3: Set Up GitHub Authentication**

#### **Option A: Personal Access Token (Recommended)**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` permissions
3. Copy the token
4. When pushing, use the token as your password

#### **Option B: SSH Key**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add public key to GitHub → Settings → SSH and GPG keys
3. Test: `ssh -T git@github.com`

### **Step 4: First Commit and Push**
```bash
git add .
git commit -m "Initial commit: Live Tarkov - AI v1.0.0"
git branch -M main
git push -u origin main
```

## 🎮 **Using Auto-Sync**

### **Quick Sync (Default Message)**
```bash
# PowerShell
.\auto-sync.ps1

# Batch file
auto-sync.bat
```

### **Custom Commit Message**
```bash
# PowerShell
.\auto-sync.ps1 -CommitMessage "Updated The Goons spawn configuration"

# Batch file
auto-sync.bat -CommitMessage "Updated The Goons spawn configuration"
```

### **Force Sync (Even if no changes)**
```bash
# PowerShell
.\auto-sync.ps1 -Force

# Batch file
auto-sync.bat -Force
```

## 📁 **What Gets Synced**

### **✅ Included in Git:**
- Source code (TypeScript and JavaScript)
- Configuration files
- Documentation (README, CHANGELOG, etc.)
- GitHub workflows and templates
- Build scripts

### **❌ Excluded from Git:**
- `node_modules/` (dependencies)
- `*.zip` (build artifacts)
- `temp-*` (temporary files)
- `*.log` (log files)
- Build outputs

## 🔄 **Workflow**

1. **Make changes** to your mod files
2. **Run auto-sync** script
3. **Script automatically:**
   - Checks for changes
   - Adds all modified files
   - Commits with message
   - Pushes to GitHub
4. **GitHub automatically updates** with your changes

## 🚨 **Troubleshooting**

### **"No remote origin found"**
```bash
git remote add origin https://github.com/Sycopath/live-tarkov-ai.git
```

### **Authentication failed**
- Check your Personal Access Token or SSH key
- Ensure you have write permissions to the repository

### **Push rejected**
```bash
git pull origin main
git push origin main
```

## 📊 **Benefits**

- ✅ **No more manual file copying**
- ✅ **Automatic version control**
- ✅ **Easy rollback if needed**
- ✅ **Collaboration ready**
- ✅ **Professional development workflow**

## 🎯 **Quick Start Commands**

```bash
# Set up remote (one-time)
git remote add origin https://github.com/Sycopath/live-tarkov-ai.git

# First push (one-time)
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main

# Daily use
.\auto-sync.ps1
```

---

**Status**: ✅ **Git Repository Initialized**  
**Next Step**: Add your GitHub remote and set up authentication  
**Auto-Sync**: Ready to use once remote is configured
