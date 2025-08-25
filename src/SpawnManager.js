var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var SpawnManager_exports = {};
__export(SpawnManager_exports, {
  SpawnManager: () => SpawnManager
});
module.exports = __toCommonJS(SpawnManager_exports);
var import_ConfigManager = require("./ConfigManager");
var import_spt_types2 = require("./types/spt-types");
class SpawnManager {
  databaseServer;
  botHelper;
  botEquipmentModService;
  botModificationService;
  botSpawnService;
  botGenerationCacheService;
  randomUtil;
  timeUtil;
  itemHelper;
  logger;
  configManager;
  sainAvailable = false;
  constructor(databaseServer, botHelper, botEquipmentModService, botModificationService, botSpawnService, botGenerationCacheService, randomUtil, timeUtil, itemHelper, logger) {
    this.databaseServer = databaseServer;
    this.botHelper = botHelper;
    this.botEquipmentModService = botEquipmentModService;
    this.botModificationService = botModificationService;
    this.botSpawnService = botSpawnService;
    this.botGenerationCacheService = botGenerationCacheService;
    this.randomUtil = randomUtil;
    this.timeUtil = timeUtil;
    this.itemHelper = itemHelper;
    this.logger = logger;
    this.configManager = new import_ConfigManager.ConfigManager();
  }
  initialize() {
    try {
      this.logger.info("[LiveTarkovAI] Initializing SpawnManager...");
      this.checkSAINAvailability();
      this.applyCustomSpawnConfig();
      this.logger.info("[LiveTarkovAI] SpawnManager initialized successfully");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error initializing SpawnManager: ${error}`);
    }
  }
  checkSAINAvailability() {
    try {
      const sainDetected = this.detectSAINMod();
      if (sainDetected) {
        this.sainAvailable = true;
        this.logger.info("[LiveTarkovAI] SAIN integration available - enhanced bot behavior enabled");
      } else {
        this.sainAvailable = false;
        this.logger.info("[LiveTarkovAI] SAIN not available - using standard bot behavior");
      }
    } catch (error) {
      this.sainAvailable = false;
      this.logger.info("[LiveTarkovAI] SAIN not available - using standard bot behavior");
    }
  }
  // Detect SAIN mod using multiple methods
  detectSAINMod() {
    try {
      try {
        require("zSolarint-SAIN-ServerMod");
        return true;
      } catch (error) {
      }
      if (globalThis.SAIN || globalThis.SainService || globalThis.sain) {
        return true;
      }
      try {
        if (globalThis.SPT_CONTAINER) {
          const container = globalThis.SPT_CONTAINER;
          if (container.resolve && container.resolve("SAINService")) {
            return true;
          }
        }
      } catch (error) {
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  // Apply custom spawn configurations to the database
  applyCustomSpawnConfig() {
    try {
      this.logger.info("[LiveTarkovAI] Applying custom spawn configurations...");
      this.modifyBotTypes();
      if (this.configManager.isGearProgressionEnabled()) {
        this.applyGearProgression();
      }
      this.logger.info("[LiveTarkovAI] Custom spawn configurations applied successfully");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying custom spawn config: ${error}`);
    }
  }
  // Modify bot types in the database
  modifyBotTypes() {
    try {
      const config = this.configManager.getConfig();
      const database = this.databaseServer.getTables();
      let modifiedCount = 0;
      const modifiedTypes = [];
      for (const [botType, botConfig] of Object.entries(config.botTypeSettings || {})) {
        if (!botConfig || !botConfig.enabled) {
          continue;
        }
        const dbBotType = database.bots.types[botType];
        if (!dbBotType) {
          this.logger.warn(`[LiveTarkovAI] Bot type ${botType} not found in database`);
          continue;
        }
        this.applyGearTierRestrictions(dbBotType, botConfig);
        this.applyDifficultySettings(dbBotType, botConfig);
        this.applyBotBehaviorSettings(dbBotType, botConfig);
        modifiedCount++;
        modifiedTypes.push(botType);
      }
      if (modifiedCount > 0) {
        this.logger.info(`[LiveTarkovAI] Modified ${modifiedCount} bot types: ${modifiedTypes.join(", ")}`);
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error modifying bot types: ${error}`);
    }
  }
  // Apply gear tier restrictions to bot types
  applyGearTierRestrictions(dbBotType, botConfig) {
    try {
      if (!botConfig.gearRestrictions) return;
      if (botConfig.gearRestrictions.weapons && botConfig.gearRestrictions.weapons.length > 0) {
        if (!dbBotType.weaponRestrictions) {
          dbBotType.weaponRestrictions = [];
        }
        dbBotType.weaponRestrictions.push(...botConfig.gearRestrictions.weapons);
      }
      if (botConfig.gearRestrictions.armor && botConfig.gearRestrictions.armor.length > 0) {
        if (!dbBotType.armorRestrictions) {
          dbBotType.armorRestrictions = [];
        }
        dbBotType.armorRestrictions.push(...botConfig.gearRestrictions.armor);
      }
      if (botConfig.gearRestrictions.items && botConfig.gearRestrictions.items.length > 0) {
        if (!dbBotType.itemRestrictions) {
          dbBotType.itemRestrictions = [];
        }
        dbBotType.itemRestrictions.push(...botConfig.gearRestrictions.items);
      }
      if (botConfig.levelProgression && botConfig.levelProgression.gearScaling) {
        dbBotType.levelBasedGear = true;
        dbBotType.minLevel = botConfig.levelProgression.minLevel || 1;
        dbBotType.maxLevel = botConfig.levelProgression.maxLevel || 60;
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying gear restrictions: ${error}`);
    }
  }
  // Apply difficulty settings to bot types
  applyDifficultySettings(dbBotType, botConfig) {
    try {
      if (!botConfig.difficulty) return;
      let difficulty;
      switch (botConfig.difficulty) {
        case "easy":
          difficulty = import_spt_types2.BotDifficulty.EASY;
          break;
        case "normal":
          difficulty = import_spt_types2.BotDifficulty.NORMAL;
          break;
        case "hard":
          difficulty = import_spt_types2.BotDifficulty.HARD;
          break;
        case "impossible":
          difficulty = import_spt_types2.BotDifficulty.IMPOSSIBLE;
          break;
        default:
          difficulty = import_spt_types2.BotDifficulty.NORMAL;
      }
      dbBotType.Difficulty = difficulty;
      this.applyDifficultyBasedBehavior(dbBotType, difficulty);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying difficulty settings: ${error}`);
    }
  }
  // Apply difficulty-based behavior modifications
  applyDifficultyBasedBehavior(dbBotType, difficulty) {
    try {
      switch (difficulty) {
        case import_spt_types2.BotDifficulty.EASY:
          if (!dbBotType.behaviorModifiers) {
            dbBotType.behaviorModifiers = {};
          }
          dbBotType.behaviorModifiers.accuracy = 0.3;
          dbBotType.behaviorModifiers.reactionTime = 2;
          dbBotType.behaviorModifiers.aggression = 0.4;
          break;
        case import_spt_types2.BotDifficulty.NORMAL:
          if (!dbBotType.behaviorModifiers) {
            dbBotType.behaviorModifiers = {};
          }
          dbBotType.behaviorModifiers.accuracy = 0.6;
          dbBotType.behaviorModifiers.reactionTime = 1.2;
          dbBotType.behaviorModifiers.aggression = 0.7;
          break;
        case import_spt_types2.BotDifficulty.HARD:
          if (!dbBotType.behaviorModifiers) {
            dbBotType.behaviorModifiers = {};
          }
          dbBotType.behaviorModifiers.accuracy = 0.8;
          dbBotType.behaviorModifiers.reactionTime = 0.8;
          dbBotType.behaviorModifiers.aggression = 0.9;
          break;
        case import_spt_types2.BotDifficulty.IMPOSSIBLE:
          if (!dbBotType.behaviorModifiers) {
            dbBotType.behaviorModifiers = {};
          }
          dbBotType.behaviorModifiers.accuracy = 0.95;
          dbBotType.behaviorModifiers.reactionTime = 0.3;
          dbBotType.behaviorModifiers.aggression = 1;
          break;
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying difficulty-based behavior: ${error}`);
    }
  }
  // Apply live Tarkov behavior settings
  applyBotBehaviorSettings(dbBotType, botConfig) {
    try {
      const behavior = botConfig.liveTarkovBehavior;
      if (!behavior) return;
      if (!dbBotType.liveTarkovBehavior) {
        dbBotType.liveTarkovBehavior = {};
      }
      if (behavior.accuracy !== void 0) {
        dbBotType.liveTarkovBehavior.accuracy = behavior.accuracy;
      }
      if (behavior.reactionTime !== void 0) {
        dbBotType.liveTarkovBehavior.reactionTime = behavior.reactionTime;
      }
      if (behavior.aggression !== void 0) {
        dbBotType.liveTarkovBehavior.aggression = behavior.aggression;
      }
      if (behavior.hearing !== void 0) {
        dbBotType.liveTarkovBehavior.hearing = behavior.hearing;
      }
      if (behavior.vision !== void 0) {
        dbBotType.liveTarkovBehavior.vision = behavior.vision;
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying bot behavior settings: ${error}`);
    }
  }
  // Apply gear progression system
  applyGearProgression() {
    try {
      const config = this.configManager.getConfig();
      const gearProgression = config.globalSettings?.gearProgression;
      if (!gearProgression || !gearProgression.enabled) return;
      this.logger.info("[LiveTarkovAI] Applying gear progression system...");
      this.applyPMCGearProgression(gearProgression);
      if (gearProgression.enforceMetaAmmo) {
        this.applyMetaAmmoEnforcement(gearProgression);
      }
      this.logger.info("[LiveTarkovAI] Gear progression system applied successfully");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying gear progression: ${error}`);
    }
  }
  // Apply PMC gear progression based on level
  applyPMCGearProgression(gearProgression) {
    try {
      const database = this.databaseServer.getTables();
      const pmcTypes = ["pmcbear", "pmcusec"];
      for (const pmcType of pmcTypes) {
        const dbBotType = database.bots.types[pmcType];
        if (!dbBotType) continue;
        dbBotType.levelBasedGear = true;
        dbBotType.minLevel = 1;
        dbBotType.maxLevel = 60;
        if (gearProgression.minLevelForHighTier) {
          dbBotType.highTierThreshold = gearProgression.minLevelForHighTier;
        }
        if (!dbBotType.gearProgression) {
          dbBotType.gearProgression = {};
        }
        dbBotType.gearProgression.metaAmmoTypes = gearProgression.metaAmmoTypes || [];
        dbBotType.gearProgression.highTierArmor = gearProgression.highTierArmor || [];
        dbBotType.gearProgression.metaWeapons = gearProgression.metaWeapons || [];
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying PMC gear progression: ${error}`);
    }
  }
  // Apply meta ammo enforcement
  applyMetaAmmoEnforcement(gearProgression) {
    try {
      const database = this.databaseServer.getTables();
      const pmcTypes = ["pmcbear", "pmcusec"];
      for (const pmcType of pmcTypes) {
        const dbBotType = database.bots.types[pmcType];
        if (!dbBotType) continue;
        if (!dbBotType.metaAmmoTypes) {
          dbBotType.metaAmmoTypes = [];
        }
        dbBotType.metaAmmoTypes.push(...gearProgression.metaAmmoTypes || []);
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying meta ammo enforcement: ${error}`);
    }
  }
  // Hook into SPT spawn service
  hookIntoSpawnService(spawnService) {
    try {
      if (!spawnService || typeof spawnService !== "object") return;
      this.botSpawnService = spawnService;
      if (spawnService.spawnBot && typeof spawnService.spawnBot === "function") {
        const originalSpawnBot = spawnService.spawnBot;
        spawnService.spawnBot = async (botType, location, count) => {
          const modifiedCount = this.calculateCustomBotCount(botType, location, count);
          const modifiedBotType = this.getModifiedBotType(botType);
          return await originalSpawnBot.call(spawnService, modifiedBotType, location, modifiedCount);
        };
      }
      this.logger.info("[LiveTarkovAI] Successfully hooked into spawn service");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error hooking into spawn service: ${error}`);
    }
  }
  // Calculate custom bot count based on configuration
  calculateCustomBotCount(botType, location, originalCount) {
    try {
      const config = this.configManager.getConfig();
      const mapConfig = config.mapSettings[location];
      if (!mapConfig || !mapConfig.enabled) return originalCount;
      const botTypeConfig = mapConfig.botTypes[botType];
      if (!botTypeConfig || !botTypeConfig.enabled) return 0;
      return Math.min(botTypeConfig.maxCount, originalCount);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error calculating custom bot count: ${error}`);
      return originalCount;
    }
  }
  // Get modified bot type based on configuration
  getModifiedBotType(originalBotType) {
    try {
      return originalBotType;
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error getting modified bot type: ${error}`);
      return originalBotType;
    }
  }
  // Get spawn statistics
  getSpawnStatistics() {
    try {
      const config = this.configManager.getConfig();
      const stats = {
        totalBots: 0,
        botTypes: {},
        maps: {},
        dependencies: {
          waypoints: true,
          // Always true since it's required
          bigBrain: true,
          // Always true since it's required
          sain: this.sainAvailable,
          fika: false
          // Would need to check this separately
        }
      };
      for (const [mapName, mapConfig] of Object.entries(config.mapSettings || {})) {
        if (mapConfig && mapConfig.enabled) {
          stats.maps[mapName] = {
            totalBots: mapConfig.maxBots || 0,
            botTypes: mapConfig.botTypes || {},
            liveTarkovSettings: mapConfig.liveTarkovSettings || {}
          };
          stats.totalBots += mapConfig.maxBots || 0;
        }
      }
      for (const [botType, botConfig] of Object.entries(config.botTypeSettings || {})) {
        if (botConfig && botConfig.enabled) {
          stats.botTypes[botType] = {
            gearTier: botConfig.gearTier,
            difficulty: botConfig.difficulty,
            spawnChance: botConfig.spawnChance,
            liveTarkovBehavior: botConfig.liveTarkovBehavior || {}
          };
        }
      }
      return stats;
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error getting spawn statistics: ${error}`);
      return {};
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpawnManager
});
//# sourceMappingURL=SpawnManager.js.map
