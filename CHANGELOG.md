# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-12-19

### Added
- Initial release with live Tarkov authenticity
- Complete boss spawn system (including Tagilla on Factory)
- Realistic gear progression
- Dynamic wave spawning
- Hot zone implementation
- Full SAIN, Fika, BigBrain, and Waypoints integration
- Authentic spawn distribution and timing
- Map-specific spawn logic
- Boss spawn accuracy (Rashala on Customs, Killa on Interchange, etc.)
- Gear tier restrictions and progression
- Wave system with dynamic scaling
- Hot zones for quest-related areas
- Seamless integration with popular SPT mods
- Factory map support with Tagilla boss (18% spawn chance)
- Proper USEC/BEAR PMC balance
- Rogues (The Goons) on multiple maps with 15% spawn rate
- Kaban boss confinement to Lexos zone on Streets
- Reduced scav density on Interchange for better balance
- Sanitar spawn verification on Shoreline
- Comprehensive logging cleanup and optimization
- ModLoader compatibility fixes
- Persistent SAIN detection resolution

### Changed
- Renamed mod from "Custom AI Spawn Mod" to "Live Tarkov - AI"
- Updated author to "Sycopath"
- Improved spawn distribution to prevent clustering
- Enhanced bot pathing and stuck prevention
- Optimized performance and reduced verbose logging
- Updated all boss spawn chances to match live Tarkov
- Refined gear tier system for PMCs and bosses

### Fixed
- Bot type database lookup issues
- Spawn clustering at raid start
- Bot stuck in spawn points
- SAIN mod detection problems
- Fika mod integration issues
- ModLoader compatibility errors
- Terminal build process hanging
- Verbose logging during server load

### Technical
- Removed dependency injection (tsyringe)
- Implemented robust mod detection systems
- Added comprehensive error handling
- Optimized build process with esbuild
- Enhanced configuration management
- Improved TypeScript compilation
