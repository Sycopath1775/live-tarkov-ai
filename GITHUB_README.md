# Live Tarkov - AI

[![Build Status](https://github.com/Sycopath/live-tarkov-ai/workflows/Build%20and%20Test/badge.svg)](https://github.com/Sycopath/live-tarkov-ai/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![SPT Version](https://img.shields.io/badge/SPT-3.11+-blue.svg)](https://github.com/SPT-AKI/SPT-AKI)

**Making SPT feel like the real thing!** 

A comprehensive AI spawn modification mod for Single Player Tarkov (SPT) that makes bots spawn exactly like live Tarkov, including authentic spawn points, timing, bot types, and behavior.

##  Features

- **Authentic Spawn Distribution**: Bots spawn in realistic locations with proper timing
- **Live Boss Spawns**: All bosses spawn with accurate chances and locations
- **Realistic Gear Progression**: PMCs get appropriate gear based on level and difficulty
- **Wave System**: Dynamic scav waves that scale with player count and raid progress
- **Hot Zones**: Bots concentrate in quest-related and high-traffic areas
- **Map-Specific Logic**: Each map has unique spawn patterns matching live Tarkov

## ? Supported Maps

- **Customs** - Scavs + PMCs + Rashala boss
- **Interchange** - Scavs + PMCs + Killa boss
- **Shoreline** - Scavs + PMCs + Gluhar boss
- **Woods** - Scavs + PMCs + Boar boss
- **Reserve** - Scavs + PMCs + Raiders
- **Streets** - Scavs + PMCs + Kaban boss
- **Lighthouse** - Scavs + PMCs + Rogues
- **Factory** - Scavs + PMCs only
- **Labs** - PMCs + Raiders only

##  Requirements

### Required BepInEx Plugins
- **DrakiaXYZ-Waypoints** - Essential for bot pathfinding and navigation
- **DrakiaXYZ-BigBrain** - Required for enhanced AI decision making

### Recommended SPT Mods
- **SAIN** - Enhanced AI behavior and bot intelligence
- **Fika** - Multiplayer compatibility and player scav handling

##  Quick Start

1. **Install Required BepInEx Plugins**
   - Extract Waypoints and BigBrain to BepInEx/plugins/ folder

2. **Download and Install the Mod**
   - Download the latest release from [Releases](https://github.com/Sycopath/live-tarkov-ai/releases)
   - Extract and drag the user folder to your SPT directory
   - Restart SPT

3. **Configure (Optional)**
   - Edit config/spawn-config.json to customize spawn behavior
   - Adjust bot counts, boss chances, and gear restrictions

##  Documentation

- **[Installation Guide](INSTALLATION.md)** - Detailed installation instructions
- **[Configuration Guide](config/README.md)** - Configuration options and examples
- **[Changelog](CHANGELOG.md)** - Version history and updates

##  Development

### Prerequisites
- Node.js 18+
- SPT 3.11+

### Building
`ash
git clone https://github.com/Sycopath/live-tarkov-ai.git
cd live-tarkov-ai
npm install
npm run build
`

### Scripts
- 
pm run build - Build the mod
- 
pm run release - Create release package
- 
pm run build:ps1 - Build using PowerShell
- 
pm run build:bat - Build using Batch file

##  Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

-  [Report Bugs](https://github.com/Sycopath/live-tarkov-ai/issues/new?template=bug_report.md)
-  [Request Features](https://github.com/Sycopath/live-tarkov-ai/issues/new?template=feature_request.md)
-  [Get Installation Help](https://github.com/Sycopath/live-tarkov-ai/issues/new?template=mod_installation_help.md)
-  [Configuration Help](https://github.com/Sycopath/live-tarkov-ai/issues/new?template=config.md)

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- **SPT Team** - For creating the amazing Single Player Tarkov platform
- **DrakiaXYZ** - For Waypoints and BigBrain BepInEx plugins
- **SAIN Team** - For enhanced AI behavior mod
- **Fika Team** - For multiplayer compatibility mod
- **Tarkov Community** - For feedback and testing

##  Statistics

![GitHub stars](https://img.shields.io/github/stars/Sycopath/live-tarkov-ai?style=social)
![GitHub forks](https://img.shields.io/github/forks/Sycopath/live-tarkov-ai?style=social)
![GitHub issues](https://img.shields.io/github/issues/Sycopath/live-tarkov-ai)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Sycopath/live-tarkov-ai)

---

**Made with  for the SPT community**

[Download Latest Release](https://github.com/Sycopath/live-tarkov-ai/releases/latest) | [Report Issue](https://github.com/Sycopath/live-tarkov-ai/issues/new) | [Discussions](https://github.com/Sycopath/live-tarkov-ai/discussions)
