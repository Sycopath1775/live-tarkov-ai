# Installation Guide

## 🚀 Quick Install

### Prerequisites
1. **Install Required BepInEx Plugins** (if not already installed):
   - **DrakiaXYZ-Waypoints** - Extract to `BepInEx/plugins/` folder
   - **DrakiaXYZ-BigBrain** - Extract to `BepInEx/plugins/` folder

### Install the Mod
1. **Download** the `Live Tarkov - AI-v1.0.0.zip` file
2. **Extract** the zip file to a temporary location
3. **Drag & Drop** the `user` folder to your SPT directory
4. **Restart** SPT
5. **Enjoy** authentic live Tarkov AI!

## 📁 What Gets Installed

When you extract the zip file, you'll see:
```
Live Tarkov - AI-v1.0.0/
├── LICENSE
├── README.md
└── user/
    └── mods/
        └── Live Tarkov - AI/
            ├── package.json
            ├── src/
            └── config/
```

## 🎯 Installation Steps

### Step 1: Extract the Zip
- Right-click the zip file
- Select "Extract All..."
- Choose a temporary location (like Desktop)

### Step 2: Install the Mod
- Navigate to your SPT directory (where you installed SPT)
- **Drag the entire `user` folder** from the extracted location to your SPT directory
- Windows will ask if you want to merge folders - click "Yes"

### Step 3: Verify Installation
- Your SPT directory should now have:
  ```
  SPT Directory/
  ├── user/
  │   └── mods/
  │       └── Live Tarkov - AI/
  │           ├── package.json
  │           ├── src/
  │           └── config/
  ```

### Step 4: Start SPT
- Launch SPT as usual
- Check the server console for: `[LiveTarkovAI] Mod initialized successfully`

## 🔧 Configuration (Optional)

The mod includes a `spawn-config.json` file where you can customize:
- Bot counts and spawn rates
- Boss spawn chances
- Gear tier restrictions
- Wave timing and scaling

## ❓ Troubleshooting

**Mod not loading?**
- Ensure the folder is named exactly `Live Tarkov - AI`
- Check that it's in `user/mods/` directory
- Verify SPT version is 3.11+
- **Ensure BigBrain and Waypoints are installed in `BepInEx/plugins/` folder**

**BepInEx plugins missing?**
- Check that `DrakiaXYZ-Waypoints.dll` is in `BepInEx/plugins/`
- Check that `DrakiaXYZ-BigBrain.dll` is in `BepInEx/plugins/`
- These are NOT SPT mods - they go in the BepInEx folder

**Configuration issues?**
- Check the JSON syntax in `spawn-config.json`
- Ensure map names match exactly (case-sensitive)

## 🎮 Ready to Play!

Once installed, your SPT raids will feature:
- Authentic live Tarkov spawn behavior
- Realistic boss spawns and locations
- Dynamic scav waves
- Proper gear progression
- Seamless integration with SAIN, Fika, BigBrain, and Waypoints

---

**Need help?** Check the SPT Discord or the mod's GitHub page!
