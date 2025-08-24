# The Goons (Rogues) Configuration Update - v1.0.0

## 🎯 Update Summary

**Date**: December 19, 2024  
**Version**: 1.0.0 (maintained)  
**Purpose**: Correct The Goons spawn locations and ensure proper boss spawn rules

## ✅ Changes Made

### 1. **Spawn Configuration Updated**
- **Customs (bigmap)**: Added The Goons with 15% spawn chance
- **Woods**: Added The Goons with 15% spawn chance  
- **Shoreline**: Added The Goons with 15% spawn chance
- **Lighthouse**: Updated The Goons to 15% spawn chance (was 40%)
- **Reserve**: Removed The Goons (they don't spawn there in live Tarkov)

### 2. **Boss Spawn Rules Applied**
- **Spawn Chance**: Set to 15% (live Tarkov accurate)
- **Gear Tier**: Upgraded to 4 (boss-level gear)
- **Difficulty**: Set to "impossible" (boss-level difficulty)
- **Spawn Timing**: Changed to "raidStart" (consistent with other bosses)
- **Max Count**: Set to 3 (appropriate for group spawns)

### 3. **Documentation Updated**
- **README.md**: Updated map listings to show The Goons spawn locations
- **GITHUB_README.md**: Updated GitHub-specific documentation
- **GITHUB_RELEASE_INFO.md**: Updated release information
- **RELEASE_SUMMARY.md**: Updated release summary
- **FINAL_RELEASE_CHECKLIST.md**: Updated final checklist

## 🗺️ Final The Goons Spawn Locations

**The Goons (Rogues) now spawn on:**
- ✅ **Customs** - 15% spawn chance, gear tier 4, impossible difficulty
- ✅ **Woods** - 15% spawn chance, gear tier 4, impossible difficulty  
- ✅ **Shoreline** - 15% spawn chance, gear tier 4, impossible difficulty
- ✅ **Lighthouse** - 15% spawn chance, gear tier 4, impossible difficulty
- ❌ **Reserve** - Removed (not a live Tarkov spawn location)

## 🔧 Configuration Details

### Bot Type Settings
```json
"assaultgroup": {
    "enabled": true,
    "gearTier": 4,
    "difficulty": "impossible",
    "spawnChance": 0.15,
    "maxCount": 3,
    "allowedMaps": ["bigmap", "woods", "lighthouse", "shoreline"],
    "liveTarkovBehavior": {
        "accuracy": 0.95,
        "reactionTime": 0.3,
        "aggression": 1.0,
        "hearing": 1.0,
        "vision": 1.0
    }
}
```

### Map Integration
Each map now includes The Goons in their `botTypes` and `spawnPoints` configurations with:
- Proper boss-level spawn settings
- Consistent 15% spawn chance
- Gear tier 4 restrictions
- Impossible difficulty setting

## 🎉 Result

**The Goons (Rogues) now:**
- ✅ Spawn on the correct maps (Customs, Woods, Lighthouse, Shoreline)
- ✅ Follow proper boss spawn rules (15% chance, gear tier 4, impossible difficulty)
- ✅ Are properly documented across all files
- ✅ Maintain the 1.0.0 version as requested

## 📦 Release Package

The updated `Live Tarkov - AI-v1.0.0.zip` now contains:
- Corrected spawn configuration for The Goons
- Updated documentation reflecting proper spawn locations
- All other features and configurations remain unchanged
- Version maintained at 1.0.0

---

**Status**: ✅ COMPLETE - The Goons configuration corrected and documented  
**Version**: 1.0.0 (maintained)  
**Ready for Release**: Yes
