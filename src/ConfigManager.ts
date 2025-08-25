import fs from "node:fs";
import path from "node:path";

export interface ISpawnConfig {
    enabled: boolean;
    globalSettings: {
        maxBotsPerRaid: number;
        minBotsPerRaid: number;
        bossSpawnChance: number;
        raiderSpawnChance: number;
        rogueSpawnChance: number;
        gearProgression?: {
            enabled: boolean;
            enforceMetaAmmo: boolean;
            levelBasedScaling: boolean;
            minLevelForHighTier: number;
            maxLevelForLowTier: number;
            metaAmmoTypes: string[];
            highTierArmor: string[];
            metaWeapons: string[];
            progressionTiers: {
                [key: string]: string;
            };
        };
    };
    mapSettings: {
        [mapName: string]: {
            enabled: boolean;
            maxBots: number;
            minBots: number;
            botTypes: {
                [botType: string]: {
                    enabled: boolean;
                    maxCount: number;
                    spawnChance: number;
                    gearTier: number;
                    difficulty: "easy" | "normal" | "hard" | "impossible";
                    spawnTiming: "raidStart" | "wave" | "dynamic";
                    spawnDelay?: number;
                };
            };
            spawnPoints: {
                [spawnPointName: string]: {
                    enabled: boolean;
                    priority: number;
                    maxBots: number;
                    botTypes: string[];
                };
            };
            liveTarkovSettings: {
                useAuthenticSpawns: boolean;
                raidStartBots: number;
                waveBots: number;
                waveDelay: number;
                maxWaves: number;
                scavBehavior: "aggressive" | "passive" | "mixed";
                pmcBehavior: "tactical" | "aggressive" | "defensive";
            };
        };
    };
    botTypeSettings: {
        [botType: string]: {
            enabled: boolean;
            gearTier: number;
            difficulty: "easy" | "normal" | "hard" | "impossible";
            spawnChance: number;
            maxCount: number;
            allowedMaps: string[];
            gearRestrictions: {
                weapons: string[];
                armor: string[];
                items: string[];
            };
            liveTarkovBehavior: {
                accuracy: number;
                reactionTime: number;
                aggression: number;
                hearing: number;
                vision: number;
            };
        };
    };
    waveSettings: {
        enabled: boolean;
        waveCount: number;
        waveDelay: number;
        botsPerWave: number;
        dynamicScaling: boolean;
    };
}

export class ConfigManager {
    private config: ISpawnConfig;
    private configPath: string;
    private enableGearProgression: boolean = true; // Default to enabled

    constructor() {
        this.configPath = path.join(__dirname, "../config/spawn-config.json");
        this.config = this.getDefaultConfig();
    }

    public initialize(): void {
        try {
            this.loadConfig();
            this.validateConfig();
            console.log("[LiveTarkovAI] Configuration loaded successfully");
        } catch (error) {
            console.error(`[LiveTarkovAI] Failed to load configuration: ${error}`);
            this.createDefaultConfig();
        }
    }

    public getConfig(): ISpawnConfig {
        return this.config;
    }

    public updateConfig(newConfig: Partial<ISpawnConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
    }

    public getMapConfig(mapName: string) {
        return this.config.mapSettings[mapName] || this.config.mapSettings["default"];
    }

    public getBotTypeConfig(botType: string) {
        return this.config.botTypeSettings[botType];
    }

    public isMapEnabled(mapName: string): boolean {
        const mapConfig = this.getMapConfig(mapName);
        return mapConfig?.enabled ?? false;
    }

    public isBotTypeEnabled(botType: string): boolean {
        const botConfig = this.getBotTypeConfig(botType);
        return botConfig?.enabled ?? false;
    }

    // Add missing methods for integration services
    public loadHotZoneConfig(): any {
        try {
            // For now, return a basic hot zone config
            // This can be expanded later with actual hot zone configuration
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
        } catch (error) {
            console.error("[LiveTarkovAI] Error loading hot zone config:", error);
            return this.getDefaultHotZoneConfig();
        }
    }

    public getFikaIntegrationConfig(): any {
        try {
            return {
                enabled: true,
                multiplayerCompatibility: true,
                playerScavHandling: true,
                botBrainOptimization: true,
                preventBotConflicts: true,
                syncWithFikaBots: true,
                itemDesyncPrevention: true
            };
        } catch (error) {
            console.error("[LiveTarkovAI] Error getting Fika integration config:", error);
            return this.getDefaultFikaConfig();
        }
    }

    public getSainIntegrationConfig(): any {
        try {
            return {
                enabled: true,
                useSainBotBrains: true,
                syncBotBehavior: true,
                preventConflicts: true,
                enhancedPathfinding: true,
                tacticalMovement: true,
                scavBehavior: {
                    annoyingButNotDeadly: true,
                    reducedAccuracy: 0.4,
                    avoidHeadshots: true,
                    preventStomachBlacking: true
                },
                pmcBehavior: {
                    tacticalAndTough: true,
                    realisticAccuracy: 0.75,
                    avoidInstaKills: true,
                    properGearUsage: true
                },
                bossBehavior: {
                    toughButNotInstaKill: true,
                    avoidHeadshotSpam: true,
                    realisticDifficulty: true,
                    properMechanics: true
                }
            };
        } catch (error) {
            console.error("[LiveTarkovAI] Error getting SAIN integration config:", error);
            return this.getDefaultSainConfig();
        }
    }

    public getBushShootingConfig(): any {
        try {
            return {
                enabled: true,
                preventShootingThroughBushes: true,
                preventShootingFromBushes: true,
                allowTrackingThroughBushes: true,
                bushDetectionRange: 50,
                lineOfSightCheck: true,
                vegetationTypes: ["bush", "tree", "grass", "foliage"]
            };
        } catch (error) {
            console.error("[LiveTarkovAI] Error getting bush shooting config:", error);
            return this.getDefaultBushShootingConfig();
        }
    }

    private getDefaultHotZoneConfig(): any {
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

    private getDefaultFikaConfig(): any {
        return {
            enabled: true,
            multiplayerCompatibility: true,
            playerScavHandling: true,
            botBrainOptimization: true,
            preventBotConflicts: true,
            syncWithFikaBots: true,
            itemDesyncPrevention: true
        };
    }

    private getDefaultSainConfig(): any {
        return {
            enabled: true,
            useSainBotBrains: true,
            syncBotBehavior: true,
            preventConflicts: true,
            enhancedPathfinding: true,
            tacticalMovement: true,
            scavBehavior: {
                annoyingButNotDeadly: true,
                reducedAccuracy: 0.4,
                avoidHeadshots: true,
                preventStomachBlacking: true
            },
            pmcBehavior: {
                tacticalAndTough: true,
                realisticAccuracy: 0.75,
                avoidInstaKills: true,
                properGearUsage: true
            },
            bossBehavior: {
                toughButNotInstaKill: true,
                avoidHeadshotSpam: true,
                realisticDifficulty: true,
                properMechanics: true
            }
        };
    }

    private getDefaultBushShootingConfig(): any {
        return {
            enabled: true,
            preventShootingThroughBushes: true,
            preventShootingFromBushes: true,
            allowTrackingThroughBushes: true,
            bushDetectionRange: 50,
            lineOfSightCheck: true,
            vegetationTypes: ["bush", "tree", "grass", "foliage"]
        };
    }

    // Set gear progression flag from main mod
    public setGearProgressionEnabled(enabled: boolean): void {
        this.enableGearProgression = enabled;
        if (!enabled) {
            console.log("[LiveTarkovAI] Gear progression system disabled - using external progression mod");
        } else {
            console.log("[LiveTarkovAI] Gear progression system enabled - using built-in progression");
        }
    }

    public isGearProgressionEnabled(): boolean {
        return this.enableGearProgression;
    }

    private loadConfig(): void {
        try {
            if (fs.existsSync(this.configPath)) {
                this.config = JSON.parse(fs.readFileSync(this.configPath, "utf8"));
            } else {
                this.createDefaultConfig();
            }
        } catch (error) {
            console.error(`[LiveTarkovAI] Error loading config: ${error}`);
            this.createDefaultConfig();
        }
    }

    private saveConfig(): void {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error(`[LiveTarkovAI] Error saving config: ${error}`);
        }
    }

    private createDefaultConfig(): void {
        this.config = this.getDefaultConfig();
        this.saveConfig();
    }

    private getDefaultConfig(): ISpawnConfig {
        return {
            enabled: true,
            globalSettings: {
                maxBotsPerRaid: 20,
                minBotsPerRaid: 8,
                bossSpawnChance: 0.3,
                raiderSpawnChance: 0.4,
                rogueSpawnChance: 0.25
            },
            mapSettings: {
                default: {
                    enabled: true,
                    maxBots: 15,
                    minBots: 6,
                    botTypes: {
                        assault: {
                            enabled: true,
                            maxCount: 10,
                            spawnChance: 0.8,
                            gearTier: 1,
                            difficulty: "normal",
                            spawnTiming: "raidStart"
                        },
                        pmcbear: {
                            enabled: true,
                            maxCount: 5,
                            spawnChance: 0.6,
                            gearTier: 2,
                            difficulty: "hard",
                            spawnTiming: "raidStart"
                        },
                        bosskilla: {
                            enabled: true,
                            maxCount: 1,
                            spawnChance: 0.3,
                            gearTier: 4,
                            difficulty: "impossible",
                            spawnTiming: "raidStart"
                        }
                    },
                    spawnPoints: {
                        default: {
                            enabled: true,
                            priority: 1,
                            maxBots: 3,
                            botTypes: ["assault", "pmcbear"]
                        }
                    },
                    liveTarkovSettings: {
                        useAuthenticSpawns: true,
                        raidStartBots: 8,
                        waveBots: 3,
                        waveDelay: 300,
                        maxWaves: 3,
                        scavBehavior: "mixed",
                        pmcBehavior: "tactical"
                    }
                },
                "factory4_day": {
                    enabled: true,
                    maxBots: 12,
                    minBots: 4,
                    botTypes: {
                        assault: {
                            enabled: true,
                            maxCount: 8,
                            spawnChance: 0.9,
                            gearTier: 1,
                            difficulty: "normal",
                            spawnTiming: "raidStart"
                        },
                        pmcbear: {
                            enabled: true,
                            maxCount: 4,
                            spawnChance: 0.7,
                            gearTier: 2,
                            difficulty: "hard",
                            spawnTiming: "raidStart"
                        }
                    },
                    spawnPoints: {
                        default: {
                            enabled: true,
                            priority: 1,
                            maxBots: 2,
                            botTypes: ["assault", "pmcbear"]
                        }
                    },
                    liveTarkovSettings: {
                        useAuthenticSpawns: true,
                        raidStartBots: 6,
                        waveBots: 2,
                        waveDelay: 240,
                        maxWaves: 2,
                        scavBehavior: "aggressive",
                        pmcBehavior: "aggressive"
                    }
                },
                "bigmap": {
                    enabled: true,
                    maxBots: 25,
                    minBots: 10,
                    botTypes: {
                        assault: {
                            enabled: true,
                            maxCount: 15,
                            spawnChance: 0.8,
                            gearTier: 1,
                            difficulty: "normal",
                            spawnTiming: "raidStart"
                        },
                        pmcbear: {
                            enabled: true,
                            maxCount: 8,
                            spawnChance: 0.6,
                            gearTier: 2,
                            difficulty: "hard",
                            spawnTiming: "raidStart"
                        },
                        bosskilla: {
                            enabled: true,
                            maxCount: 1,
                            spawnChance: 0.4,
                            gearTier: 4,
                            difficulty: "impossible",
                            spawnTiming: "raidStart"
                        }
                    },
                    spawnPoints: {
                        default: {
                            enabled: true,
                            priority: 1,
                            maxBots: 4,
                            botTypes: ["assault", "pmcbear", "bosskilla"]
                        }
                    },
                    liveTarkovSettings: {
                        useAuthenticSpawns: true,
                        raidStartBots: 15,
                        waveBots: 4,
                        waveDelay: 300,
                        maxWaves: 3,
                        scavBehavior: "mixed",
                        pmcBehavior: "tactical"
                    }
                },
                "shoreline": {
                    enabled: true,
                    maxBots: 30,
                    minBots: 12,
                    botTypes: {
                        assault: {
                            enabled: true,
                            maxCount: 18,
                            spawnChance: 0.8,
                            gearTier: 1,
                            difficulty: "normal",
                            spawnTiming: "raidStart"
                        },
                        pmcbear: {
                            enabled: true,
                            maxCount: 10,
                            spawnChance: 0.6,
                            gearTier: 2,
                            difficulty: "hard",
                            spawnTiming: "raidStart"
                        },
                        bossgluhar: {
                            enabled: true,
                            maxCount: 1,
                            spawnChance: 0.35,
                            gearTier: 4,
                            difficulty: "impossible",
                            spawnTiming: "raidStart"
                        }
                    },
                    spawnPoints: {
                        default: {
                            enabled: true,
                            priority: 1,
                            maxBots: 5,
                            botTypes: ["assault", "pmcbear", "bossgluhar"]
                        }
                    },
                    liveTarkovSettings: {
                        useAuthenticSpawns: true,
                        raidStartBots: 20,
                        waveBots: 5,
                        waveDelay: 360,
                        maxWaves: 3,
                        scavBehavior: "mixed",
                        pmcBehavior: "tactical"
                    }
                },
                "lighthouse": {
                    enabled: true,
                    maxBots: 28,
                    minBots: 10,
                    botTypes: {
                        assault: {
                            enabled: true,
                            maxCount: 16,
                            spawnChance: 0.8,
                            gearTier: 1,
                            difficulty: "normal",
                            spawnTiming: "raidStart"
                        },
                        pmcbear: {
                            enabled: true,
                            maxCount: 8,
                            spawnChance: 0.6,
                            gearTier: 2,
                            difficulty: "hard",
                            spawnTiming: "raidStart"
                        },
                        assaultgroup: {
                            enabled: true,
                            maxCount: 4,
                            spawnChance: 0.4,
                            gearTier: 3,
                            difficulty: "hard",
                            spawnTiming: "wave"
                        }
                    },
                    spawnPoints: {
                        default: {
                            enabled: true,
                            priority: 1,
                            maxBots: 4,
                            botTypes: ["assault", "pmcbear", "assaultgroup"]
                        }
                    },
                    liveTarkovSettings: {
                        useAuthenticSpawns: true,
                        raidStartBots: 18,
                        waveBots: 4,
                        waveDelay: 300,
                        maxWaves: 3,
                        scavBehavior: "mixed",
                        pmcBehavior: "tactical"
                    }
                }
            },
            botTypeSettings: {
                assault: {
                    enabled: true,
                    gearTier: 1,
                    difficulty: "normal",
                    spawnChance: 0.8,
                    maxCount: 15,
                    allowedMaps: ["*"],
                    gearRestrictions: {
                        weapons: [],
                        armor: [],
                        items: []
                    },
                    liveTarkovBehavior: {
                        accuracy: 0.6,
                        reactionTime: 1.2,
                        aggression: 0.7,
                        hearing: 0.8,
                        vision: 0.7
                    }
                },
                pmcbear: {
                    enabled: true,
                    gearTier: 2,
                    difficulty: "hard",
                    spawnChance: 0.6,
                    maxCount: 8,
                    allowedMaps: ["*"],
                    gearRestrictions: {
                        weapons: [],
                        armor: [],
                        items: []
                    },
                    liveTarkovBehavior: {
                        accuracy: 0.8,
                        reactionTime: 0.8,
                        aggression: 0.9,
                        hearing: 0.9,
                        vision: 0.9
                    }
                },
                pmcusec: {
                    enabled: true,
                    gearTier: 2,
                    difficulty: "hard",
                    spawnChance: 0.6,
                    maxCount: 8,
                    allowedMaps: ["*"],
                    gearRestrictions: {
                        weapons: [],
                        armor: [],
                        items: []
                    },
                    liveTarkovBehavior: {
                        accuracy: 0.8,
                        reactionTime: 0.8,
                        aggression: 0.9,
                        hearing: 0.9,
                        vision: 0.9
                    }
                },
                bosskilla: {
                    enabled: true,
                    gearTier: 4,
                    difficulty: "impossible",
                    spawnChance: 0.3,
                    maxCount: 1,
                    allowedMaps: ["bigmap"],
                    gearRestrictions: {
                        weapons: [],
                        armor: [],
                        items: []
                    },
                    liveTarkovBehavior: {
                        accuracy: 0.95,
                        reactionTime: 0.3,
                        aggression: 1.0,
                        hearing: 1.0,
                        vision: 1.0
                    }
                },
                bossgluhar: {
                    enabled: true,
                    gearTier: 4,
                    difficulty: "impossible",
                    spawnChance: 0.3,
                    maxCount: 1,
                    allowedMaps: ["shoreline"],
                    gearRestrictions: {
                        weapons: [],
                        armor: [],
                        items: []
                    },
                    liveTarkovBehavior: {
                        accuracy: 0.95,
                        reactionTime: 0.3,
                        aggression: 1.0,
                        hearing: 1.0,
                        vision: 1.0
                    }
                },
                assaultgroup: {
                    enabled: true,
                    gearTier: 3,
                    difficulty: "hard",
                    spawnChance: 0.4,
                    maxCount: 3,
                    allowedMaps: ["bigmap", "lighthouse"],
                    gearRestrictions: {
                        weapons: [],
                        armor: [],
                        items: []
                    },
                    liveTarkovBehavior: {
                        accuracy: 0.85,
                        reactionTime: 0.6,
                        aggression: 0.95,
                        hearing: 0.95,
                        vision: 0.95
                    }
                }
            },
            waveSettings: {
                enabled: true,
                waveCount: 3,
                waveDelay: 300,
                botsPerWave: 5,
                dynamicScaling: true
            }
        };
    }

    private validateConfig(): void {
        // Basic validation
        if (!this.config.enabled) {
            console.warn("[LiveTarkovAI] Mod is disabled in configuration");
            return;
        }

        // Validate global settings
        if (this.config.globalSettings.maxBotsPerRaid < this.config.globalSettings.minBotsPerRaid) {
            console.warn("[LiveTarkovAI] Max bots per raid cannot be less than min bots per raid");
            this.config.globalSettings.maxBotsPerRaid = this.config.globalSettings.minBotsPerRaid;
        }

        // Validate map settings
        for (const [mapName, mapConfig] of Object.entries(this.config.mapSettings)) {
            if (mapConfig.maxBots < mapConfig.minBots) {
                console.warn(`[LiveTarkovAI] Map ${mapName}: max bots cannot be less than min bots`);
                mapConfig.maxBots = mapConfig.minBots;
            }
        }

        console.log("[LiveTarkovAI] Configuration validation completed");
    }
}
