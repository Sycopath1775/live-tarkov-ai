import { ConfigManager } from "./ConfigManager";
import { LocationController, ILocationBase, Logger } from "./types/spt-types";

export class HotZoneManager {
    private configManager: ConfigManager;
    private locationController: LocationController;
    private logger: Logger;
    private hotZoneConfig: any;
    private activeHotZones: Map<string, any> = new Map();

    constructor(configManager: ConfigManager, locationController: LocationController, logger: Logger) {
        this.configManager = configManager;
        this.locationController = locationController;
        this.logger = logger;
    }

    public initialize(): void {
        try {
            this.logger.info("[LiveTarkovAI] Initializing HotZoneManager...");
            
            // Load hot zone configuration
            this.hotZoneConfig = this.configManager.loadHotZoneConfig();
            
            if (this.hotZoneConfig.enabled) {
                this.setupHotZones();
                this.logger.info("[LiveTarkovAI] HotZoneManager initialized successfully");
            } else {
                this.logger.info("[LiveTarkovAI] HotZoneManager disabled in configuration");
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error initializing HotZoneManager: ${error}`);
        }
    }

    // Hook into location controller for spawn management
    public hookIntoLocationController(locationController: any): void {
        try {
            if (!locationController || typeof locationController !== "object") return;
            
            // Store reference to location controller
            this.locationController = locationController;
            
            // Hook into location spawn methods if they exist
            if (locationController.getSpawnPoints && typeof locationController.getSpawnPoints === "function") {
                const originalGetSpawnPoints = locationController.getSpawnPoints;
                locationController.getSpawnPoints = (locationName: string) => {
                    // Apply our hot zone modifications to spawn points
                    const originalSpawnPoints = originalGetSpawnPoints.call(locationController, locationName);
                    return this.modifySpawnPointsForHotZones(locationName, originalSpawnPoints);
                };
            }
            
            this.logger.info("[LiveTarkovAI] Successfully hooked into location controller");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error hooking into location controller: ${error}`);
        }
    }

    // Setup hot zones based on configuration
    private setupHotZones(): void {
        try {
            const config = this.configManager.getConfig();
            
            // Create hot zones for each map
            for (const [mapName, mapConfig] of Object.entries(config.mapSettings || {})) {
                if (mapConfig && mapConfig.enabled) {
                    this.createHotZonesForMap(mapName, mapConfig);
                }
            }
            
            this.logger.info(`[LiveTarkovAI] Created ${this.activeHotZones.size} hot zones`);
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error setting up hot zones: ${error}`);
        }
    }

    // Create hot zones for a specific map
    private createHotZonesForMap(mapName: string, mapConfig: any): void {
        try {
            const hotZones: any[] = [];
            
            // Create boss zones
            if (mapConfig.spawnPoints) {
                for (const [spawnPointName, spawnPoint] of Object.entries(mapConfig.spawnPoints)) {
                    if (spawnPoint && typeof spawnPoint === 'object' && 'enabled' in spawnPoint && spawnPoint.enabled) {
                        if (spawnPointName.includes('boss') || spawnPointName.includes('Boss')) {
                            hotZones.push({
                                name: `${mapName}_${spawnPointName}`,
                                type: 'boss',
                                priority: spawnPoint.priority || 1,
                                location: mapName,
                                spawnPoint: spawnPointName,
                                maxBots: spawnPoint.maxBots || 1,
                                botTypes: spawnPoint.botTypes || [],
                                excludeRegularScavs: true,
                                minDistanceFromRegularSpawns: 80
                            });
                        }
                    }
                }
            }
            
            // Create quest-related hot zones
            this.createQuestHotZones(mapName, mapConfig, hotZones);
            
            // Create high-traffic hot zones
            this.createHighTrafficHotZones(mapName, mapConfig, hotZones);
            
            // Store hot zones for this map
            if (hotZones.length > 0) {
                this.activeHotZones.set(mapName, hotZones);
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error creating hot zones for map ${mapName}: ${error}`);
        }
    }

    // Create quest-related hot zones
    private createQuestHotZones(mapName: string, mapConfig: any, hotZones: any[]): void {
        try {
            // Define quest locations for each map
            const questLocations: { [key: string]: any[] } = {
                'bigmap': [
                    { name: 'dorms', priority: 2, maxBots: 3, botTypes: ['assault', 'pmcbear'] },
                    { name: 'gas_station', priority: 2, maxBots: 2, botTypes: ['assault'] },
                    { name: 'construction', priority: 1, maxBots: 2, botTypes: ['assault'] }
                ],
                'shoreline': [
                    { name: 'resort', priority: 3, maxBots: 4, botTypes: ['assault', 'pmcbear'] },
                    { name: 'pier', priority: 2, maxBots: 2, botTypes: ['assault'] },
                    { name: 'gas_station', priority: 1, maxBots: 2, botTypes: ['assault'] }
                ],
                'lighthouse': [
                    { name: 'water_treatment', priority: 3, maxBots: 3, botTypes: ['assault', 'pmcbear'] },
                    { name: 'mountain', priority: 2, maxBots: 2, botTypes: ['assault'] }
                ],
                'woods': [
                    { name: 'sawmill', priority: 2, maxBots: 3, botTypes: ['assault', 'pmcbear'] },
                    { name: 'scav_house', priority: 1, maxBots: 2, botTypes: ['assault'] }
                ],
                'reserve': [
                    { name: 'bunker', priority: 3, maxBots: 4, botTypes: ['assault', 'pmcbear'] },
                    { name: 'heli_pad', priority: 2, maxBots: 2, botTypes: ['assault'] }
                ],
                'streets': [
                    { name: 'lexos', priority: 3, maxBots: 3, botTypes: ['assault', 'pmcbear'] },
                    { name: 'chekannaya', priority: 2, maxBots: 2, botTypes: ['assault'] }
                ]
            };
            
            const mapQuestLocations = questLocations[mapName] || [];
            
            for (const questLocation of mapQuestLocations) {
                hotZones.push({
                    name: `${mapName}_${questLocation.name}`,
                    type: 'quest',
                    priority: questLocation.priority,
                    location: mapName,
                    spawnPoint: questLocation.name,
                    maxBots: questLocation.maxBots,
                    botTypes: questLocation.botTypes,
                    excludeRegularScavs: false,
                    minDistanceFromRegularSpawns: 50
                });
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error creating quest hot zones for map ${mapName}: ${error}`);
        }
    }

    // Create high-traffic hot zones
    private createHighTrafficHotZones(mapName: string, mapConfig: any, hotZones: any[]): void {
        try {
            // Define high-traffic locations for each map
            const highTrafficLocations: { [key: string]: any[] } = {
                'bigmap': [
                    { name: 'crossroads', priority: 1, maxBots: 2, botTypes: ['assault'] },
                    { name: 'old_gas', priority: 1, maxBots: 2, botTypes: ['assault'] }
                ],
                'shoreline': [
                    { name: 'village', priority: 1, maxBots: 2, botTypes: ['assault'] },
                    { name: 'power_station', priority: 1, maxBots: 2, botTypes: ['assault'] }
                ],
                'lighthouse': [
                    { name: 'village', priority: 1, maxBots: 2, botTypes: ['assault'] },
                    { name: 'rocks', priority: 1, maxBots: 2, botTypes: ['assault'] }
                ],
                'woods': [
                    { name: 'village', priority: 1, maxBots: 2, botTypes: ['assault'] },
                    { name: 'lumber_mill', priority: 1, maxBots: 2, botTypes: ['assault'] }
                ],
                'reserve': [
                    { name: 'village', priority: 1, maxBots: 2, botTypes: ['assault'] },
                    { name: 'garage', priority: 1, maxBots: 2, botTypes: ['assault'] }
                ],
                'streets': [
                    { name: 'village', priority: 1, maxBots: 2, botTypes: ['assault'] },
                    { name: 'garage', priority: 1, maxBots: 2, botTypes: ['assault'] }
                ]
            };
            
            const mapHighTrafficLocations = highTrafficLocations[mapName] || [];
            
            for (const highTrafficLocation of mapHighTrafficLocations) {
                hotZones.push({
                    name: `${mapName}_${highTrafficLocation.name}`,
                    type: 'high_traffic',
                    priority: highTrafficLocation.priority,
                    location: mapName,
                    spawnPoint: highTrafficLocation.name,
                    maxBots: highTrafficLocation.maxBots,
                    botTypes: highTrafficLocation.botTypes,
                    excludeRegularScavs: false,
                    minDistanceFromRegularSpawns: 30
                });
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error creating high-traffic hot zones for map ${mapName}: ${error}`);
        }
    }

    // Modify spawn points based on hot zones
    private modifySpawnPointsForHotZones(locationName: string, originalSpawnPoints: any[]): any[] {
        try {
            const hotZones = this.activeHotZones.get(locationName);
            if (!hotZones || hotZones.length === 0) {
                return originalSpawnPoints;
            }
            
            const modifiedSpawnPoints = [...originalSpawnPoints];
            
            // Apply hot zone modifications
            for (const hotZone of hotZones) {
                this.applyHotZoneToSpawnPoints(hotZone, modifiedSpawnPoints);
            }
            
            return modifiedSpawnPoints;
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error modifying spawn points for hot zones: ${error}`);
            return originalSpawnPoints;
        }
    }

    // Apply hot zone modifications to spawn points
    private applyHotZoneToSpawnPoints(hotZone: any, spawnPoints: any[]): void {
        try {
            // Find spawn points near the hot zone
            for (const spawnPoint of spawnPoints) {
                if (this.isSpawnPointNearHotZone(spawnPoint, hotZone)) {
                    // Apply hot zone modifications
                    this.modifySpawnPointForHotZone(spawnPoint, hotZone);
                }
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying hot zone to spawn points: ${error}`);
        }
    }

    // Check if spawn point is near hot zone
    private isSpawnPointNearHotZone(spawnPoint: any, hotZone: any): boolean {
        try {
            // Simple distance check - can be enhanced with actual coordinates
            if (spawnPoint.name && hotZone.spawnPoint) {
                return spawnPoint.name.toLowerCase().includes(hotZone.spawnPoint.toLowerCase()) ||
                       hotZone.spawnPoint.toLowerCase().includes(spawnPoint.name.toLowerCase());
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // Modify spawn point based on hot zone
    private modifySpawnPointForHotZone(spawnPoint: any, hotZone: any): void {
        try {
            // Apply hot zone priority
            if (hotZone.priority > (spawnPoint.priority || 1)) {
                spawnPoint.priority = hotZone.priority;
            }
            
            // Apply bot type restrictions
            if (hotZone.botTypes && hotZone.botTypes.length > 0) {
                if (!spawnPoint.botTypes) {
                    spawnPoint.botTypes = [];
                }
                // Add hot zone bot types if not already present
                for (const botType of hotZone.botTypes) {
                    if (!spawnPoint.botTypes.includes(botType)) {
                        spawnPoint.botTypes.push(botType);
                    }
                }
            }
            
            // Apply exclusion rules
            if (hotZone.excludeRegularScavs) {
                spawnPoint.excludeRegularScavs = true;
            }
            
            // Apply distance restrictions
            if (hotZone.minDistanceFromRegularSpawns) {
                spawnPoint.minDistanceFromRegularSpawns = hotZone.minDistanceFromRegularSpawns;
            }
            
            // Mark spawn point as modified by hot zone
            spawnPoint.hotZoneModified = true;
            spawnPoint.hotZoneName = hotZone.name;
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error modifying spawn point for hot zone: ${error}`);
        }
    }

    // Get hot zone information for a specific map
    public getHotZonesForMap(mapName: string): any[] {
        try {
            return this.activeHotZones.get(mapName) || [];
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error getting hot zones for map ${mapName}: ${error}`);
            return [];
        }
    }

    // Get all active hot zones
    public getAllHotZones(): Map<string, any[]> {
        try {
            return this.activeHotZones;
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error getting all hot zones: ${error}`);
            return new Map();
        }
    }

    // Update hot zone configuration
    public updateHotZoneConfig(newConfig: any): void {
        try {
            this.hotZoneConfig = { ...this.hotZoneConfig, ...newConfig };
            
            if (this.hotZoneConfig.enabled) {
                this.setupHotZones();
                this.logger.info("[LiveTarkovAI] Hot zone configuration updated");
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error updating hot zone configuration: ${error}`);
        }
    }
}
