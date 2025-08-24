"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotZoneManager = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ConfigManager_1 = require("./ConfigManager");
let HotZoneManager = class HotZoneManager {
    configManager;
    hotZoneConfig;
    activeSpawns = new Map();
    spawnTimers = new Map();
    constructor(configManager) {
        this.configManager = configManager;
        this.loadHotZoneConfig();
    }
    loadHotZoneConfig() {
        try {
            // Load hot zone configuration
            this.hotZoneConfig = this.configManager.loadHotZoneConfig();
            console.log("[HotZoneManager] Hot zone configuration loaded successfully");
        }
        catch (error) {
            console.error("[HotZoneManager] Error loading hot zone config:", error);
            this.hotZoneConfig = this.getDefaultHotZoneConfig();
        }
    }
    getDefaultHotZoneConfig() {
        return {
            enabled: true,
            hotZones: {},
            spawnDistribution: {
                enabled: true,
                minDistanceBetweenSpawns: 100,
                maxSpawnsPerZone: 3,
                zonePriority: { high: 1, medium: 2, low: 3 },
                spawnTiming: {
                    initialSpawnDelay: 30,
                    waveSpacing: 300,
                    randomization: 60
                }
            },
            integration: {
                waypointsMod: true,
                bigBrainMod: true,
                useExistingPathfinding: true,
                preventStuckBots: true
            }
        };
    }
    initializeHotZones(mapName) {
        if (!this.hotZoneConfig.enabled) {
            console.log("[HotZoneManager] Hot zones disabled");
            return;
        }
        const mapHotZones = this.hotZoneConfig.hotZones[mapName];
        if (!mapHotZones) {
            console.log(`[HotZoneManager] No hot zones configured for map: ${mapName}`);
            return;
        }
        console.log(`[HotZoneManager] Initializing hot zones for ${mapName}`);
        // Initialize spawn distribution
        this.setupSpawnDistribution(mapName, mapHotZones);
        // Setup wave spawning
        this.setupWaveSpawning(mapName, mapHotZones);
    }
    setupSpawnDistribution(mapName, hotZones) {
        const { spawnDistribution } = this.hotZoneConfig;
        if (!spawnDistribution.enabled)
            return;
        // Sort zones by priority
        const sortedZones = Object.entries(hotZones)
            .filter(([_, zone]) => zone.enabled)
            .sort(([_, a], [__, b]) => spawnDistribution.zonePriority[a.priority] - spawnDistribution.zonePriority[b.priority]);
        // Calculate spawn positions with minimum distance
        const spawnPositions = [];
        for (const [zoneName, zone] of sortedZones) {
            const positions = this.calculateSpawnPositions(zone, spawnPositions, spawnDistribution.minDistanceBetweenSpawns);
            spawnPositions.push(...positions.map(pos => ({ zone: zoneName, position: pos })));
        }
        // Store spawn positions for this map
        this.activeSpawns.set(mapName, spawnPositions);
        console.log(`[HotZoneManager] Calculated ${spawnPositions.length} spawn positions for ${mapName}`);
    }
    calculateSpawnPositions(zone, existingPositions, minDistance) {
        const positions = [];
        const maxAttempts = 50;
        let attempts = 0;
        while (positions.length < zone.maxBots && attempts < maxAttempts) {
            attempts++;
            // Generate random position within zone radius
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * zone.coordinates.radius;
            const x = zone.coordinates.x + Math.cos(angle) * radius;
            const y = zone.coordinates.y + Math.sin(angle) * radius;
            // Check distance from existing positions
            const tooClose = existingPositions.some(existing => {
                const distance = Math.sqrt(Math.pow(x - existing.position.x, 2) +
                    Math.pow(y - existing.position.y, 2));
                return distance < minDistance;
            });
            if (!tooClose) {
                positions.push({ x, y });
            }
        }
        return positions;
    }
    setupWaveSpawning(mapName, hotZones) {
        const { spawnTiming } = this.hotZoneConfig.spawnDistribution;
        // Initial spawn delay
        const initialDelay = spawnTiming.initialSpawnDelay +
            (Math.random() * spawnTiming.randomization);
        setTimeout(() => {
            this.executeInitialSpawns(mapName, hotZones);
        }, initialDelay * 1000);
        // Setup wave spawning
        this.setupWaveTimer(mapName, hotZones, spawnTiming.waveSpacing);
    }
    executeInitialSpawns(mapName, hotZones) {
        console.log(`[HotZoneManager] Executing initial spawns for ${mapName}`);
        for (const [zoneName, zone] of Object.entries(hotZones)) {
            if (!zone.enabled || Math.random() > zone.spawnChance)
                continue;
            const spawnPositions = this.activeSpawns.get(mapName) || [];
            const zonePositions = spawnPositions.filter(sp => sp.zone === zoneName);
            // Spawn bots at calculated positions
            this.spawnBotsInZone(zone, zonePositions, mapName);
        }
    }
    setupWaveTimer(mapName, hotZones, waveSpacing) {
        const timer = setInterval(() => {
            this.executeWaveSpawn(mapName, hotZones);
        }, waveSpacing * 1000);
        this.spawnTimers.set(mapName, timer);
    }
    executeWaveSpawn(mapName, hotZones) {
        console.log(`[HotZoneManager] Executing wave spawn for ${mapName}`);
        // Implement wave spawning logic here
        // This will be called periodically to spawn additional bots
    }
    spawnBotsInZone(zone, positions, mapName) {
        // This method will integrate with SPT's bot spawning system
        // For now, we'll log the intended spawns
        console.log(`[HotZoneManager] Would spawn ${positions.length} ${zone.spawnTypes.join(', ')} bots in zone`);
        // TODO: Integrate with SPT bot spawning
        // This will require access to SPT's bot spawning services
    }
    cleanupMap(mapName) {
        // Clear spawn timers
        const timer = this.spawnTimers.get(mapName);
        if (timer) {
            clearInterval(timer);
            this.spawnTimers.delete(mapName);
        }
        // Clear active spawns
        this.activeSpawns.delete(mapName);
        console.log(`[HotZoneManager] Cleaned up hot zones for ${mapName}`);
    }
    getHotZoneInfo(mapName) {
        const mapHotZones = this.hotZoneConfig.hotZones[mapName];
        if (!mapHotZones)
            return null;
        return {
            mapName,
            totalZones: Object.keys(mapHotZones).length,
            activeZones: Object.entries(mapHotZones)
                .filter(([_, zone]) => zone.enabled)
                .map(([name, zone]) => ({
                name,
                description: zone.description,
                priority: zone.priority,
                spawnTypes: zone.spawnTypes,
                maxBots: zone.maxBots
            }))
        };
    }
    isHotZoneEnabled(mapName) {
        return this.hotZoneConfig.enabled &&
            !!this.hotZoneConfig.hotZones[mapName];
    }
};
exports.HotZoneManager = HotZoneManager;
exports.HotZoneManager = HotZoneManager = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof ConfigManager_1.ConfigManager !== "undefined" && ConfigManager_1.ConfigManager) === "function" ? _a : Object])
], HotZoneManager);
//# sourceMappingURL=HotZoneManager.js.map