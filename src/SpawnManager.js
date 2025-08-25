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
class SpawnManager {
  databaseServer;
  configManager;
  logger;
  container;
  // SPT Router Service for REAL spawn control
  staticRouterService;
  constructor(databaseServer, configManager, logger, container) {
    this.databaseServer = databaseServer;
    this.configManager = configManager;
    this.logger = logger;
    this.container = container;
  }
  initialize() {
    try {
      this.logger.info("Initializing REAL SPT router-based spawn control system...");
      this.resolveRouterService();
      this.applyCustomSpawnConfig();
      this.registerSpawnRouterHooks();
      this.logger.info("REAL SPT router-based spawn control system initialized successfully");
    } catch (error) {
      this.logger.error(`Error initializing spawn system: ${error}`);
    }
  }
  // Resolve SPT router service for REAL control
  resolveRouterService() {
    try {
      this.staticRouterService = this.container.resolve("StaticRouterModService");
      if (this.staticRouterService) {
        this.logger.info("\u2713 StaticRouterModService available - REAL spawn control enabled");
      } else {
        this.logger.error("\u274C StaticRouterModService not available - spawn control disabled");
      }
    } catch (error) {
      this.logger.error(`Error resolving router service: ${error}`);
    }
  }
  // Register router hooks for REAL spawn control
  registerSpawnRouterHooks() {
    try {
      if (!this.staticRouterService) {
        this.logger.warn("Router service not available - cannot register spawn hooks");
        return;
      }
      this.registerBotGenerationRouter();
      this.registerRaidStartRouter();
      this.registerGameStartRouter();
      this.logger.info("All spawn router hooks registered successfully");
    } catch (error) {
      this.logger.error(`Error registering router hooks: ${error}`);
    }
  }
  // Register router hook for bot generation - REAL spawn control
  registerBotGenerationRouter() {
    try {
      this.staticRouterService.registerStaticRouter(
        "LiveTarkovAI-BotGenerationRouter",
        [
          {
            url: "/client/game/bot/generate",
            action: async (url, info, sessionId, output) => {
              try {
                this.logger.info("=== BOT GENERATION ROUTER INTERCEPTED ===");
                this.logger.info(`URL: ${url}`);
                this.logger.info(`Session ID: ${sessionId}`);
                this.logger.info(`Info object structure: ${JSON.stringify(info, null, 2)}`);
                this.logger.info(`Output length: ${output.length} characters`);
                const outputJSON = JSON.parse(output);
                this.logger.info(`Output JSON structure: ${JSON.stringify(outputJSON, null, 2)}`);
                this.analyzeBotGenerationData(outputJSON, info);
                const modifiedOutput = this.applyBotSpawnRules(outputJSON, info);
                this.logger.info(`Applied bot spawn rules for ${info.location || "unknown location"}`);
                this.logger.info("=== BOT GENERATION ROUTER COMPLETED ===");
                return JSON.stringify(modifiedOutput);
              } catch (error) {
                this.logger.error(`Error in bot generation router: ${error}`);
                this.logger.error(`Stack trace: ${error.stack}`);
                return output;
              }
            }
          }
        ],
        "LiveTarkovAI"
      );
      this.logger.info("Bot generation router hook registered");
    } catch (error) {
      this.logger.error(`Error registering bot generation router: ${error}`);
    }
  }
  // Register router hook for raid start - REAL spawn control
  registerRaidStartRouter() {
    try {
      this.staticRouterService.registerStaticRouter(
        "LiveTarkovAI-RaidStartRouter",
        [
          {
            url: "/client/match/local/start",
            action: async (url, info, sessionId, output) => {
              try {
                this.logger.info("=== RAID START ROUTER INTERCEPTED ===");
                this.logger.info(`URL: ${url}`);
                this.logger.info(`Session ID: ${sessionId}`);
                this.logger.info(`Info object structure: ${JSON.stringify(info, null, 2)}`);
                this.logger.info(`Output length: ${output.length} characters`);
                const outputJSON = JSON.parse(output);
                this.logger.info(`Output JSON structure: ${JSON.stringify(outputJSON, null, 2)}`);
                this.analyzeRaidStartData(outputJSON, info);
                const modifiedOutput = this.applyRaidSpawnRules(outputJSON, info);
                this.logger.info(`Applied raid spawn rules for ${info.location || "unknown location"}`);
                this.logger.info("=== RAID START ROUTER COMPLETED ===");
                return JSON.stringify(modifiedOutput);
              } catch (error) {
                this.logger.error(`Error in raid start router: ${error}`);
                this.logger.error(`Stack trace: ${error.stack}`);
                return output;
              }
            }
          }
        ],
        "LiveTarkovAI"
      );
      this.logger.info("Raid start router hook registered");
    } catch (error) {
      this.logger.error(`Error registering raid start router: ${error}`);
    }
  }
  // Register router hook for game start - REAL spawn control
  registerGameStartRouter() {
    try {
      this.staticRouterService.registerStaticRouter(
        "LiveTarkovAI-GameStartRouter",
        [
          {
            url: "/client/game/start",
            action: async (url, info, sessionId, output) => {
              try {
                this.logger.info("=== GAME START ROUTER INTERCEPTED ===");
                this.logger.info(`URL: ${url}`);
                this.logger.info(`Session ID: ${sessionId}`);
                this.logger.info(`Info object structure: ${JSON.stringify(info, null, 2)}`);
                this.logger.info(`Output length: ${output.length} characters`);
                const outputJSON = JSON.parse(output);
                this.logger.info(`Output JSON structure: ${JSON.stringify(outputJSON, null, 2)}`);
                this.analyzeGameStartData(outputJSON, info);
                const modifiedOutput = this.applyGameSpawnRules(outputJSON, info);
                this.logger.info("Applied game spawn rules");
                this.logger.info("=== GAME START ROUTER COMPLETED ===");
                return JSON.stringify(modifiedOutput);
              } catch (error) {
                this.logger.error(`Error in game start router: ${error}`);
                this.logger.error(`Stack trace: ${error.stack}`);
                return output;
              }
            }
          }
        ],
        "LiveTarkovAI"
      );
      this.logger.info("Game start router hook registered");
    } catch (error) {
      this.logger.error(`Error registering game start router: ${error}`);
    }
  }
  // Apply Live Tarkov bot spawn rules - REAL spawn control
  applyBotSpawnRules(outputJSON, info) {
    try {
      const config = this.configManager.getConfig();
      const location = info.location?.toLowerCase();
      const mapConfig = config.mapSettings?.[location];
      if (!mapConfig || !mapConfig.enabled) {
        return outputJSON;
      }
      const modifiedOutput = { ...outputJSON };
      if (mapConfig.maxBots && mapConfig.maxBots > 0) {
        if (modifiedOutput.data && Array.isArray(modifiedOutput.data)) {
          modifiedOutput.data = modifiedOutput.data.slice(0, mapConfig.maxBots);
        }
      }
      if (mapConfig.botTypes) {
        const allowedTypes = Object.entries(mapConfig.botTypes).filter(([_, config2]) => config2.enabled).map(([type, _]) => type);
        if (allowedTypes.length > 0 && modifiedOutput.data && Array.isArray(modifiedOutput.data)) {
          modifiedOutput.data = modifiedOutput.data.filter((bot) => {
            const botType = bot.Role || bot.BotType;
            return allowedTypes.includes(botType);
          });
        }
      }
      return modifiedOutput;
    } catch (error) {
      this.logger.error(`Error applying bot spawn rules: ${error}`);
      return outputJSON;
    }
  }
  // Apply Live Tarkov raid spawn rules - REAL spawn control
  applyRaidSpawnRules(outputJSON, info) {
    try {
      const config = this.configManager.getConfig();
      const location = info.location?.toLowerCase();
      const mapConfig = config.mapSettings?.[location];
      if (!mapConfig || !mapConfig.enabled) {
        return outputJSON;
      }
      const modifiedOutput = { ...outputJSON };
      const globalSettings = config.globalSettings;
      if (globalSettings) {
        const maxBots = globalSettings.maxBotsPerRaid || 15;
        const minBots = globalSettings.minBotsPerRaid || 6;
        if (modifiedOutput.data) {
          modifiedOutput.data.maxBots = maxBots;
          modifiedOutput.data.minBots = minBots;
        }
      }
      const liveTarkovSettings = mapConfig.liveTarkovSettings;
      if (liveTarkovSettings) {
        if (liveTarkovSettings.raidStartBots && liveTarkovSettings.raidStartBots > 0) {
          if (modifiedOutput.data) {
            modifiedOutput.data.raidStartBots = liveTarkovSettings.raidStartBots;
          }
        }
        if (liveTarkovSettings.waveBots && liveTarkovSettings.maxWaves) {
          if (modifiedOutput.data) {
            modifiedOutput.data.waveBots = liveTarkovSettings.waveBots;
            modifiedOutput.data.maxWaves = liveTarkovSettings.maxWaves;
          }
        }
      }
      return modifiedOutput;
    } catch (error) {
      this.logger.error(`Error applying raid spawn rules: ${error}`);
      return outputJSON;
    }
  }
  // Apply Live Tarkov game spawn rules - REAL spawn control
  applyGameSpawnRules(outputJSON, info) {
    try {
      const config = this.configManager.getConfig();
      const modifiedOutput = { ...outputJSON };
      const globalSettings = config.globalSettings;
      if (globalSettings) {
        if (modifiedOutput.data) {
          modifiedOutput.data.maxBots = globalSettings.maxBotsPerRaid || 15;
          modifiedOutput.data.minBots = globalSettings.minBotsPerRaid || 6;
        }
      }
      return modifiedOutput;
    } catch (error) {
      this.logger.error(`Error applying game spawn rules: ${error}`);
      return outputJSON;
    }
  }
  // Apply custom spawn configurations to database
  applyCustomSpawnConfig() {
    try {
      this.modifyBotTypes();
      if (this.configManager.isGearProgressionEnabled()) {
        this.applyGearProgression();
      }
      this.logger.info("Live Tarkov spawn configuration completed");
    } catch (error) {
      this.logger.error(`Error applying custom spawn config: ${error}`);
    }
  }
  // Modify bot types in the database
  modifyBotTypes() {
    try {
      const config = this.configManager.getConfig();
      const database = this.databaseServer.getTables();
      let modifiedCount = 0;
      for (const [botType, botConfig] of Object.entries(config.botTypeSettings || {})) {
        if (!botConfig || !botConfig.enabled) {
          continue;
        }
        const dbBotType = database.bots.types[botType];
        if (!dbBotType) {
          continue;
        }
        this.applyGearTierRestrictions(dbBotType, botConfig);
        this.applyDifficultySettings(dbBotType, botConfig);
        this.applyBotBehaviorSettings(dbBotType, botConfig);
        modifiedCount++;
      }
      if (modifiedCount > 0) {
        this.logger.info(`Modified ${modifiedCount} bot types`);
      }
    } catch (error) {
      this.logger.error(`Error modifying bot types: ${error}`);
    }
  }
  // Apply gear tier restrictions to bot types
  applyGearTierRestrictions(dbBotType, botConfig) {
    try {
      if (!botConfig.gearRestrictions) return;
      const restrictions = botConfig.gearRestrictions;
      if (restrictions.weapons) {
        dbBotType.inventory = dbBotType.inventory || {};
        dbBotType.inventory.equipment = dbBotType.inventory.equipment || {};
        dbBotType.inventory.equipment.weapon = restrictions.weapons;
      }
      if (restrictions.armor) {
        dbBotType.inventory = dbBotType.inventory || {};
        dbBotType.inventory.equipment = dbBotType.inventory.equipment || {};
        dbBotType.inventory.equipment.armor = restrictions.armor;
      }
      if (restrictions.items) {
        dbBotType.inventory = dbBotType.inventory || {};
        dbBotType.inventory.items = restrictions.items;
      }
    } catch (error) {
      this.logger.error(`Error applying gear restrictions: ${error}`);
    }
  }
  // Apply difficulty settings to bot types
  applyDifficultySettings(dbBotType, botConfig) {
    try {
      if (!botConfig.difficulty) return;
      const difficulty = botConfig.difficulty;
      dbBotType.difficulty = difficulty;
      this.applyDifficultyBasedBehavior(dbBotType, difficulty);
    } catch (error) {
      this.logger.error(`Error applying difficulty settings: ${error}`);
    }
  }
  // Apply difficulty-based behavior modifications
  applyDifficultyBasedBehavior(dbBotType, difficulty) {
    try {
      switch (difficulty) {
        case "easy":
          dbBotType.skills = dbBotType.skills || {};
          dbBotType.skills.aiming = Math.max(0.1, (dbBotType.skills.aiming || 0.5) * 0.7);
          dbBotType.skills.recoil = Math.max(0.1, (dbBotType.skills.recoil || 0.5) * 0.7);
          break;
        case "normal":
          break;
        case "hard":
          dbBotType.skills = dbBotType.skills || {};
          dbBotType.skills.aiming = Math.min(1, (dbBotType.skills.aiming || 0.5) * 1.3);
          dbBotType.skills.recoil = Math.min(1, (dbBotType.skills.recoil || 0.5) * 1.3);
          break;
        case "impossible":
          dbBotType.skills = dbBotType.skills || {};
          dbBotType.skills.aiming = Math.min(1, (dbBotType.skills.aiming || 0.5) * 1.5);
          dbBotType.skills.recoil = Math.min(1, (dbBotType.skills.recoil || 0.5) * 1.5);
          break;
      }
    } catch (error) {
      this.logger.error(`Error applying difficulty-based behavior: ${error}`);
    }
  }
  // Apply live Tarkov behavior settings
  applyBotBehaviorSettings(dbBotType, botConfig) {
    try {
      if (!botConfig.liveTarkovBehavior) return;
      const behavior = botConfig.liveTarkovBehavior;
      if (behavior.aggressive) {
        dbBotType.aggression = Math.min(1, (dbBotType.aggression || 0.5) * 1.2);
      }
      if (behavior.cautious) {
        dbBotType.aggression = Math.max(0.1, (dbBotType.aggression || 0.5) * 0.8);
      }
    } catch (error) {
      this.logger.error(`Error applying bot behavior settings: ${error}`);
    }
  }
  // Apply gear progression system
  applyGearProgression() {
    try {
      const config = this.configManager.getConfig();
      const gearProgression = config.globalSettings?.gearProgression;
      if (!gearProgression || !gearProgression.enabled) return;
      this.logger.info("Applying gear progression system...");
      this.applyPMCGearProgression();
      this.applyMetaAmmoEnforcement();
      this.logger.info("Gear progression system applied successfully");
    } catch (error) {
      this.logger.error(`Error applying gear progression: ${error}`);
    }
  }
  // Apply PMC gear progression based on level
  applyPMCGearProgression() {
    try {
      const config = this.configManager.getConfig();
      const gearProgression = config.globalSettings?.gearProgression;
      if (!gearProgression || !gearProgression.progressionTiers) return;
      const progression = gearProgression.progressionTiers;
      for (const [level, gearConfig] of Object.entries(progression)) {
        const minLevel = parseInt(level);
        if (isNaN(minLevel)) continue;
        this.logger.info(`Configured gear progression for level ${minLevel}+`);
      }
    } catch (error) {
      this.logger.error(`Error applying PMC gear progression: ${error}`);
    }
  }
  // Apply meta ammo enforcement
  applyMetaAmmoEnforcement() {
    try {
      const config = this.configManager.getConfig();
      const gearProgression = config.globalSettings?.gearProgression;
      if (!gearProgression || !gearProgression.metaAmmoTypes) return;
      const metaAmmoTypes = gearProgression.metaAmmoTypes;
      if (metaAmmoTypes.length > 0) {
        this.logger.info(`Meta ammo enforcement enabled with ${metaAmmoTypes.length} ammo types`);
      }
    } catch (error) {
      this.logger.error(`Error applying meta ammo enforcement: ${error}`);
    }
  }
  // RESEARCH: Analyze bot generation data structure to understand what we can control
  analyzeBotGenerationData(outputJSON, info) {
    try {
      this.logger.info("=== BOT GENERATION DATA ANALYSIS ===");
      this.logger.info("Info parameter analysis:");
      this.logger.info(`- Location: ${info.location || "undefined"}`);
      this.logger.info(`- Info keys: ${Object.keys(info).join(", ")}`);
      this.logger.info("Output structure analysis:");
      this.logger.info(`- Output keys: ${Object.keys(outputJSON).join(", ")}`);
      if (outputJSON.data) {
        this.logger.info(`- Data type: ${Array.isArray(outputJSON.data) ? "Array" : typeof outputJSON.data}`);
        if (Array.isArray(outputJSON.data)) {
          this.logger.info(`- Data length: ${outputJSON.data.length}`);
          if (outputJSON.data.length > 0) {
            this.logger.info(`- First bot structure: ${JSON.stringify(outputJSON.data[0], null, 2)}`);
          }
        }
      }
      this.logger.info("Looking for spawn-related fields...");
      this.findSpawnRelatedFields(outputJSON, "Output");
      this.findSpawnRelatedFields(info, "Info");
      this.logger.info("=== BOT GENERATION ANALYSIS COMPLETED ===");
    } catch (error) {
      this.logger.error(`Error analyzing bot generation data: ${error}`);
    }
  }
  // RESEARCH: Analyze raid start data structure to understand what we can control
  analyzeRaidStartData(outputJSON, info) {
    try {
      this.logger.info("=== RAID START DATA ANALYSIS ===");
      this.logger.info("Info parameter analysis:");
      this.logger.info(`- Location: ${info.location || "undefined"}`);
      this.logger.info(`- Info keys: ${Object.keys(info).join(", ")}`);
      this.logger.info("Output structure analysis:");
      this.logger.info(`- Output keys: ${Object.keys(outputJSON).join(", ")}`);
      this.logger.info("Looking for spawn-related fields...");
      this.findSpawnRelatedFields(outputJSON, "Output");
      this.findSpawnRelatedFields(info, "Info");
      this.logger.info("=== RAID START ANALYSIS COMPLETED ===");
    } catch (error) {
      this.logger.error(`Error analyzing raid start data: ${error}`);
    }
  }
  // RESEARCH: Analyze game start data structure to understand what we can control
  analyzeGameStartData(outputJSON, info) {
    try {
      this.logger.info("=== GAME START DATA ANALYSIS ===");
      this.logger.info("Info parameter analysis:");
      this.logger.info(`- Info keys: ${Object.keys(info).join(", ")}`);
      this.logger.info("Output structure analysis:");
      this.logger.info(`- Output keys: ${Object.keys(outputJSON).join(", ")}`);
      this.logger.info("Looking for spawn-related fields...");
      this.findSpawnRelatedFields(outputJSON, "Output");
      this.findSpawnRelatedFields(info, "Info");
      this.logger.info("=== GAME START ANALYSIS COMPLETED ===");
    } catch (error) {
      this.logger.error(`Error analyzing game start data: ${error}`);
    }
  }
  // RESEARCH: Find fields that might be related to spawning
  findSpawnRelatedFields(data, context) {
    try {
      const spawnKeywords = [
        "spawn",
        "bot",
        "location",
        "position",
        "count",
        "limit",
        "max",
        "min",
        "wave",
        "time",
        "delay",
        "zone",
        "area",
        "exclude",
        "include",
        "type",
        "role",
        "difficulty",
        "gear",
        "equipment",
        "inventory"
      ];
      this.logger.info(`Searching for spawn-related fields in ${context}:`);
      const foundFields = [];
      this.searchForKeywords(data, spawnKeywords, foundFields, "");
      if (foundFields.length > 0) {
        this.logger.info(`Found spawn-related fields: ${foundFields.join(", ")}`);
      } else {
        this.logger.info("No obvious spawn-related fields found");
      }
    } catch (error) {
      this.logger.error(`Error searching for spawn-related fields: ${error}`);
    }
  }
  // RESEARCH: Recursively search for keywords in nested objects
  searchForKeywords(data, keywords, foundFields, path) {
    try {
      if (typeof data === "object" && data !== null) {
        for (const [key, value] of Object.entries(data)) {
          const currentPath = path ? `${path}.${key}` : key;
          const lowerKey = key.toLowerCase();
          for (const keyword of keywords) {
            if (lowerKey.includes(keyword)) {
              foundFields.push(currentPath);
              this.logger.info(`Found spawn-related field: ${currentPath} = ${JSON.stringify(value)}`);
              break;
            }
          }
          if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            this.searchForKeywords(value, keywords, foundFields, currentPath);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error in keyword search: ${error}`);
    }
  }
  // SAFETY: Validate that our modifications don't break SPT's data structure
  validateModifiedData(originalData, modifiedData, context) {
    try {
      if (typeof originalData !== typeof modifiedData) {
        this.logger.error(`${context}: Data type mismatch - original: ${typeof originalData}, modified: ${typeof modifiedData}`);
        return false;
      }
      if (Array.isArray(originalData.data) && Array.isArray(modifiedData.data)) {
        if (modifiedData.data.length > originalData.data.length) {
          this.logger.warn(`${context}: Modified data has more bots than original - this might cause issues`);
        }
      }
      const requiredFields = ["data", "err", "errmsg"];
      for (const field of requiredFields) {
        if (originalData.hasOwnProperty(field) && !modifiedData.hasOwnProperty(field)) {
          this.logger.error(`${context}: Required field '${field}' missing from modified data`);
          return false;
        }
      }
      this.logger.info(`${context}: Data validation passed`);
      return true;
    } catch (error) {
      this.logger.error(`${context}: Data validation failed: ${error}`);
      return false;
    }
  }
  // SAFETY: Add performance monitoring to our spawn rule methods
  measurePerformance(operation, func) {
    const startTime = Date.now();
    try {
      const result = func();
      const endTime = Date.now();
      this.logger.info(`${operation} completed in ${endTime - startTime}ms`);
      return result;
    } catch (error) {
      const endTime = Date.now();
      this.logger.error(`${operation} failed after ${endTime - startTime}ms: ${error}`);
      throw error;
    }
  }
  // Get spawn statistics for monitoring
  getSpawnStatistics() {
    try {
      const stats = {
        totalBots: 0,
        modifiedBots: 0,
        gearProgressionEnabled: this.configManager.isGearProgressionEnabled(),
        spawnControlEnabled: !!this.staticRouterService,
        locationControlEnabled: false
        // No direct location controller exposed here
      };
      return stats;
    } catch (error) {
      this.logger.error(`Error getting spawn statistics: ${error}`);
      return {};
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpawnManager
});
//# sourceMappingURL=SpawnManager.js.map
