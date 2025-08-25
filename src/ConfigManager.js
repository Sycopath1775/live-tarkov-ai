var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ConfigManager_exports = {};
__export(ConfigManager_exports, {
  ConfigManager: () => ConfigManager
});
module.exports = __toCommonJS(ConfigManager_exports);
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
class ConfigManager {
  config;
  configPath;
  enableGearProgression = true;
  // Default to enabled
  constructor() {
    this.configPath = import_node_path.default.join(__dirname, "../config/spawn-config.json");
    this.config = this.getDefaultConfig();
  }
  initialize() {
    try {
      this.loadConfig();
      this.validateConfig();
      console.log("[LiveTarkovAI] Configuration loaded successfully");
    } catch (error) {
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
  // Add missing methods for integration services
  loadHotZoneConfig() {
    try {
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
  getFikaIntegrationConfig() {
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
  getSainIntegrationConfig() {
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
  getBushShootingConfig() {
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
  getDefaultFikaConfig() {
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
  getDefaultSainConfig() {
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
  getDefaultBushShootingConfig() {
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
  setGearProgressionEnabled(enabled) {
    this.enableGearProgression = enabled;
    if (!enabled) {
      console.log("[LiveTarkovAI] Gear progression system disabled - using external progression mod");
    } else {
      console.log("[LiveTarkovAI] Gear progression system enabled - using built-in progression");
    }
  }
  isGearProgressionEnabled() {
    return this.enableGearProgression;
  }
  loadConfig() {
    try {
      if (import_node_fs.default.existsSync(this.configPath)) {
        this.config = JSON.parse(import_node_fs.default.readFileSync(this.configPath, "utf8"));
      } else {
        this.createDefaultConfig();
      }
    } catch (error) {
      console.error(`[LiveTarkovAI] Error loading config: ${error}`);
      this.createDefaultConfig();
    }
  }
  saveConfig() {
    try {
      import_node_fs.default.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
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
            aggression: 1,
            hearing: 1,
            vision: 1
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
            aggression: 1,
            hearing: 1,
            vision: 1
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
    if (!this.config.enabled) {
      console.warn("[LiveTarkovAI] Mod is disabled in configuration");
      return;
    }
    if (this.config.globalSettings.maxBotsPerRaid < this.config.globalSettings.minBotsPerRaid) {
      console.warn("[LiveTarkovAI] Max bots per raid cannot be less than min bots per raid");
      this.config.globalSettings.maxBotsPerRaid = this.config.globalSettings.minBotsPerRaid;
    }
    for (const [mapName, mapConfig] of Object.entries(this.config.mapSettings)) {
      if (mapConfig.maxBots < mapConfig.minBots) {
        console.warn(`[LiveTarkovAI] Map ${mapName}: max bots cannot be less than min bots`);
        mapConfig.maxBots = mapConfig.minBots;
      }
    }
    console.log("[LiveTarkovAI] Configuration validation completed");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConfigManager
});
//# sourceMappingURL=ConfigManager.js.map
