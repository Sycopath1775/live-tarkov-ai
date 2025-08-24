"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
class ConfigManager {
    config;
    configPath;
    constructor() {
        this.configPath = node_path_1.default.join(__dirname, "../config/spawn-config.json");
        this.config = this.getDefaultConfig();
    }
    initialize() {
        try {
            this.loadConfig();
            this.validateConfig();
            console.log("[LiveTarkovAI] Configuration loaded successfully");
        }
        catch (error) {
            console.error(`[LiveTarkovAI] Failed to load configuration: ${error}`);
            this.createDefaultConfig();
        }
    }
    getConfig() {
        return this.config;
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
    }
    getMapConfig(mapName) {
        return this.config.mapSettings[mapName] || this.config.mapSettings["default"];
    }
    getBotTypeConfig(botType) {
        return this.config.botTypeSettings[botType];
    }
    isMapEnabled(mapName) {
        const mapConfig = this.getMapConfig(mapName);
        return mapConfig?.enabled ?? false;
    }
    isBotTypeEnabled(botType) {
        const botConfig = this.getBotTypeConfig(botType);
        return botConfig?.enabled ?? false;
    }
    loadConfig() {
        try {
            if (node_fs_1.default.existsSync(this.configPath)) {
                this.config = JSON.parse(node_fs_1.default.readFileSync(this.configPath, "utf8"));
            }
            else {
                this.createDefaultConfig();
            }
        }
        catch (error) {
            console.error(`[LiveTarkovAI] Error loading config: ${error}`);
            this.createDefaultConfig();
        }
    }
    saveConfig() {
        try {
            node_fs_1.default.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        }
        catch (error) {
            console.error(`[LiveTarkovAI] Error saving config: ${error}`);
        }
    }
    createDefaultConfig() {
        this.config = this.getDefaultConfig();
        this.saveConfig();
    }
    getDefaultConfig() {
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
    validateConfig() {
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
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=ConfigManager.js.map