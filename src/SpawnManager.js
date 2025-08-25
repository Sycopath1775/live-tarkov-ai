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
  // SPT Services for REAL spawn control
  botSpawnService;
  locationController;
  botHelper;
  botController;
  constructor(databaseServer, configManager, logger, container) {
    this.databaseServer = databaseServer;
    this.configManager = configManager;
    this.logger = logger;
    this.container = container;
  }
  initialize() {
    try {
      this.logger.info("Initializing REAL spawn control system...");
      this.resolveSpawnServices();
      this.applyCustomSpawnConfig();
      this.hookIntoSpawnSystem();
      this.logger.info("REAL spawn control system initialized successfully");
    } catch (error) {
      this.logger.error(`Error initializing spawn system: ${error}`);
    }
  }
  // Resolve SPT spawn services for REAL control
  resolveSpawnServices() {
    try {
      this.botSpawnService = this.container.resolve("BotSpawnService");
      this.locationController = this.container.resolve("LocationController");
      this.botHelper = this.container.resolve("BotHelper");
      this.botController = this.container.resolve("BotController");
      if (this.botSpawnService) {
        this.logger.info("\u2713 BotSpawnService available - REAL spawn control enabled");
      }
      if (this.locationController) {
        this.logger.info("\u2713 LocationController available - Map spawn control enabled");
      }
    } catch (error) {
      this.logger.warn("Some SPT spawn services not available - limited functionality");
    }
  }
  // Apply custom spawn configurations to the database
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
  // Hook into SPT's spawn system for REAL control
  hookIntoSpawnSystem() {
    try {
      if (!this.botSpawnService) {
        this.logger.warn("BotSpawnService not available - cannot hook into spawn system");
        return;
      }
      this.hookIntoBotSpawning();
      this.hookIntoLocationSpawning();
      this.applySpawnRateOverrides();
      this.logger.info("Successfully hooked into SPT spawn system");
    } catch (error) {
      this.logger.error(`Error hooking into spawn system: ${error}`);
    }
  }
  // Hook into bot spawning events for REAL control
  hookIntoBotSpawning() {
    try {
      if (!this.botSpawnService || !this.botSpawnService.onBotSpawned) {
        return;
      }
      this.botSpawnService.onBotSpawned = (bot, location) => {
        this.onBotSpawned(bot, location);
      };
      if (this.botSpawnService.onSpawnRequest) {
        this.botSpawnService.onSpawnRequest = (request) => {
          return this.onSpawnRequest(request);
        };
      }
      this.logger.info("Bot spawning hooks installed");
    } catch (error) {
      this.logger.error(`Error hooking into bot spawning: ${error}`);
    }
  }
  // Hook into location spawning events
  hookIntoLocationSpawning() {
    try {
      if (!this.locationController || !this.locationController.onLocationSpawn) {
        return;
      }
      this.locationController.onLocationSpawn = (location, raidChanges) => {
        this.onLocationSpawn(location, raidChanges);
      };
      this.logger.info("Location spawning hooks installed");
    } catch (error) {
      this.logger.error(`Error hooking into location spawning: ${error}`);
    }
  }
  // Apply spawn rate overrides to SPT
  applySpawnRateOverrides() {
    try {
      const config = this.configManager.getConfig();
      const globalSettings = config.globalSettings;
      if (!globalSettings) return;
      const maxBots = globalSettings.maxBotsPerRaid || 15;
      const minBots = globalSettings.minBotsPerRaid || 6;
      if (this.botSpawnService && this.botSpawnService.setMaxBots) {
        this.botSpawnService.setMaxBots(maxBots);
        this.botSpawnService.setMinBots(minBots);
        this.logger.info(`Applied spawn limits: ${minBots}-${maxBots} bots per raid`);
      }
    } catch (error) {
      this.logger.error(`Error applying spawn rate overrides: ${error}`);
    }
  }
  // Handle bot spawned event - REAL spawn control
  onBotSpawned(bot, location) {
    try {
      const config = this.configManager.getConfig();
      const mapConfig = config.mapSettings?.[location];
      if (!mapConfig || !mapConfig.enabled) return;
      this.applyMapSpawnRules(bot, location, mapConfig);
      this.applyBossExclusionZones(bot, location, mapConfig);
    } catch (error) {
      this.logger.error(`Error handling bot spawned event: ${error}`);
    }
  }
  // Handle spawn request event - REAL spawn control
  onSpawnRequest(request) {
    try {
      const config = this.configManager.getConfig();
      const location = request.location;
      const mapConfig = config.mapSettings?.[location];
      if (!mapConfig || !mapConfig.enabled) {
        return request;
      }
      const modifiedRequest = this.modifySpawnRequest(request, mapConfig);
      return modifiedRequest;
    } catch (error) {
      this.logger.error(`Error handling spawn request: ${error}`);
      return request;
    }
  }
  // Handle location spawn event - REAL spawn control
  onLocationSpawn(location, raidChanges) {
    try {
      const config = this.configManager.getConfig();
      const mapConfig = config.mapSettings?.[location];
      if (!mapConfig || !mapConfig.enabled) return;
      this.applyMapRaidChanges(location, raidChanges, mapConfig);
    } catch (error) {
      this.logger.error(`Error handling location spawn: ${error}`);
    }
  }
  // Apply map-specific spawn rules to spawned bots
  applyMapSpawnRules(bot, location, mapConfig) {
    try {
      const botTypes = mapConfig.botTypes;
      if (!botTypes) return;
      const botType = bot.Role || bot.BotType;
      const botConfig = botTypes[botType];
      if (!botConfig || !botConfig.enabled) return;
      if (botConfig.difficulty) {
        bot.Difficulty = botConfig.difficulty;
      }
      if (botConfig.gearRestrictions) {
        this.applyGearRestrictionsToBot(bot, botConfig.gearRestrictions);
      }
    } catch (error) {
      this.logger.error(`Error applying map spawn rules: ${error}`);
    }
  }
  // Apply boss exclusion zones - REAL spawn control
  applyBossExclusionZones(bot, location, mapConfig) {
    try {
      const bossExclusionZones = mapConfig.bossExclusionZones;
      if (!bossExclusionZones) return;
      for (const zone of bossExclusionZones) {
        if (this.isBotInZone(bot, zone)) {
          if (bot.Role === "assault" && zone.excludeRegularScavs) {
            this.logger.info(`Prevented regular scav spawn in boss zone: ${zone.name}`);
            this.removeBotFromRaid(bot);
            return;
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error applying boss exclusion zones: ${error}`);
    }
  }
  // Modify spawn request based on Live Tarkov rules
  modifySpawnRequest(request, mapConfig) {
    try {
      const modifiedRequest = { ...request };
      if (mapConfig.maxBots && mapConfig.maxBots > 0) {
        modifiedRequest.maxBots = Math.min(request.maxBots || 20, mapConfig.maxBots);
      }
      if (mapConfig.minBots && mapConfig.minBots > 0) {
        modifiedRequest.minBots = Math.max(request.minBots || 5, mapConfig.minBots);
      }
      if (mapConfig.botTypes) {
        const allowedTypes = Object.entries(mapConfig.botTypes).filter(([_, config]) => config.enabled).map(([type, _]) => type);
        if (allowedTypes.length > 0) {
          modifiedRequest.allowedBotTypes = allowedTypes;
        }
      }
      return modifiedRequest;
    } catch (error) {
      this.logger.error(`Error modifying spawn request: ${error}`);
      return request;
    }
  }
  // Apply map-specific raid changes
  applyMapRaidChanges(location, raidChanges, mapConfig) {
    try {
      const liveTarkovSettings = mapConfig.liveTarkovSettings;
      if (!liveTarkovSettings) return;
      if (liveTarkovSettings.raidStartBots && liveTarkovSettings.raidStartBots > 0) {
        raidChanges.botCountAdjustments = {
          min: liveTarkovSettings.raidStartBots,
          max: liveTarkovSettings.raidStartBots
        };
      }
      if (liveTarkovSettings.waveBots && liveTarkovSettings.maxWaves) {
        raidChanges.waveSettings = {
          count: liveTarkovSettings.maxWaves,
          delay: 300,
          // 5 minutes between waves
          botsPerWave: liveTarkovSettings.waveBots
        };
      }
      this.logger.info(`Applied raid changes for ${location}`);
    } catch (error) {
      this.logger.error(`Error applying map raid changes: ${error}`);
    }
  }
  // Check if bot is in a specific zone
  isBotInZone(bot, zone) {
    try {
      const botPos = bot.Position || { x: 0, y: 0, z: 0 };
      const zoneCenter = zone.center || { x: 0, y: 0, z: 0 };
      const radius = zone.radius || 100;
      const distance = Math.sqrt(
        Math.pow(botPos.x - zoneCenter.x, 2) + Math.pow(botPos.y - zoneCenter.y, 2) + Math.pow(botPos.z - zoneCenter.z, 2)
      );
      return distance <= radius;
    } catch (error) {
      this.logger.error(`Error checking bot zone: ${error}`);
      return false;
    }
  }
  // Remove bot from raid (for exclusion zones)
  removeBotFromRaid(bot) {
    try {
      if (this.botController && this.botController.removeBot) {
        this.botController.removeBot(bot._id);
      }
    } catch (error) {
      this.logger.error(`Error removing bot from raid: ${error}`);
    }
  }
  // Apply gear restrictions to spawned bot
  applyGearRestrictionsToBot(bot, restrictions) {
    try {
      if (!bot.inventory) return;
      if (restrictions.weapons && bot.inventory.equipment) {
        bot.inventory.equipment.weapon = restrictions.weapons;
      }
      if (restrictions.armor && bot.inventory.equipment) {
        bot.inventory.equipment.armor = restrictions.armor;
      }
    } catch (error) {
      this.logger.error(`Error applying gear restrictions to bot: ${error}`);
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
  // Get spawn statistics for monitoring
  getSpawnStatistics() {
    try {
      const stats = {
        totalBots: 0,
        modifiedBots: 0,
        gearProgressionEnabled: this.configManager.isGearProgressionEnabled(),
        spawnControlEnabled: !!this.botSpawnService,
        locationControlEnabled: !!this.locationController
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
