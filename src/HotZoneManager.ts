import { injectable } from "tsyringe";
import { ConfigManager } from "./ConfigManager";

export interface IHotZone {
    enabled: boolean;
    description: string;
    spawnTypes: string[];
    maxBots: number;
    spawnChance: number;
    spawnTiming: string;
    priority: string;
    coordinates: {
        x: number;
        y: number;
        radius: number;
    };
    questRelated: boolean;
    questName?: string;
}

export interface IHotZoneConfig {
    enabled: boolean;
    hotZones: Record<string, Record<string, IHotZone>>;
    spawnDistribution: {
        enabled: boolean;
        minDistanceBetweenSpawns: number;
        maxSpawnsPerZone: number;
        zonePriority: Record<string, number>;
        spawnTiming: {
            initialSpawnDelay: number;
            waveSpacing: number;
            randomization: number;
        };
    };
    integration: {
        waypointsMod: boolean;
        bigBrainMod: boolean;
        useExistingPathfinding: boolean;
        preventStuckBots: boolean;
    };
}

@injectable()
export class HotZoneManager {
    private hotZoneConfig: IHotZoneConfig;
    private activeSpawns: Map<string, any[]> = new Map();
    private spawnTimers: Map<string, NodeJS.Timeout> = new Map();

    constructor(private configManager: ConfigManager) {
        this.loadHotZoneConfig();
    }

    private loadHotZoneConfig(): void {
        try {
            // Load hot zone configuration
            this.hotZoneConfig = this.configManager.loadHotZoneConfig();
            console.log("[HotZoneManager] Hot zone configuration loaded successfully");
        } catch (error) {
            console.error("[HotZoneManager] Error loading hot zone config:", error);
            this.hotZoneConfig = this.getDefaultHotZoneConfig();
        }
    }

    private getDefaultHotZoneConfig(): IHotZoneConfig {
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

    public initializeHotZones(mapName: string): void {
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

    private setupSpawnDistribution(mapName: string, hotZones: Record<string, IHotZone>): void {
        const { spawnDistribution } = this.hotZoneConfig;
        
        if (!spawnDistribution.enabled) return;

        // Sort zones by priority
        const sortedZones = Object.entries(hotZones)
            .filter(([_, zone]) => zone.enabled)
            .sort(([_, a], [__, b]) => 
                spawnDistribution.zonePriority[a.priority] - spawnDistribution.zonePriority[b.priority]
            );

        // Calculate spawn positions with minimum distance
        const spawnPositions: Array<{zone: string, position: {x: number, y: number}}> = [];
        
        for (const [zoneName, zone] of sortedZones) {
            const positions = this.calculateSpawnPositions(
                zone,
                spawnPositions,
                spawnDistribution.minDistanceBetweenSpawns
            );
            
            spawnPositions.push(...positions.map(pos => ({zone: zoneName, position: pos})));
        }

        // Store spawn positions for this map
        this.activeSpawns.set(mapName, spawnPositions);
        
        console.log(`[HotZoneManager] Calculated ${spawnPositions.length} spawn positions for ${mapName}`);
    }

    private calculateSpawnPositions(
        zone: IHotZone, 
        existingPositions: Array<{zone: string, position: {x: number, y: number}}>,
        minDistance: number
    ): Array<{x: number, y: number}> {
        const positions: Array<{x: number, y: number}> = [];
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
                const distance = Math.sqrt(
                    Math.pow(x - existing.position.x, 2) + 
                    Math.pow(y - existing.position.y, 2)
                );
                return distance < minDistance;
            });

            if (!tooClose) {
                positions.push({x, y});
            }
        }

        return positions;
    }

    private setupWaveSpawning(mapName: string, hotZones: Record<string, IHotZone>): void {
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

    private executeInitialSpawns(mapName: string, hotZones: Record<string, IHotZone>): void {
        console.log(`[HotZoneManager] Executing initial spawns for ${mapName}`);
        
        for (const [zoneName, zone] of Object.entries(hotZones)) {
            if (!zone.enabled || Math.random() > zone.spawnChance) continue;
            
            const spawnPositions = this.activeSpawns.get(mapName) || [];
            const zonePositions = spawnPositions.filter(sp => sp.zone === zoneName);
            
            // Spawn bots at calculated positions
            this.spawnBotsInZone(zone, zonePositions, mapName);
        }
    }

    private setupWaveTimer(mapName: string, hotZones: Record<string, IHotZone>, waveSpacing: number): void {
        const timer = setInterval(() => {
            this.executeWaveSpawn(mapName, hotZones);
        }, waveSpacing * 1000);

        this.spawnTimers.set(mapName, timer);
    }

    private executeWaveSpawn(mapName: string, hotZones: Record<string, IHotZone>): void {
        console.log(`[HotZoneManager] Executing wave spawn for ${mapName}`);
        
        // Implement wave spawning logic here
        // This will be called periodically to spawn additional bots
    }

    private spawnBotsInZone(zone: IHotZone, positions: Array<{zone: string, position: {x: number, y: number}}>, mapName: string): void {
        // This method will integrate with SPT's bot spawning system
        // For now, we'll log the intended spawns
        console.log(`[HotZoneManager] Would spawn ${positions.length} ${zone.spawnTypes.join(', ')} bots in zone`);
        
        // TODO: Integrate with SPT bot spawning
        // This will require access to SPT's bot spawning services
    }

    public cleanupMap(mapName: string): void {
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

    public getHotZoneInfo(mapName: string): any {
        const mapHotZones = this.hotZoneConfig.hotZones[mapName];
        if (!mapHotZones) return null;

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

    public isHotZoneEnabled(mapName: string): boolean {
        return this.hotZoneConfig.enabled && 
               !!this.hotZoneConfig.hotZones[mapName];
    }
}
