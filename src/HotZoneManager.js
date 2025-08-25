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
var HotZoneManager_exports = {};
__export(HotZoneManager_exports, {
  HotZoneManager: () => HotZoneManager
});
module.exports = __toCommonJS(HotZoneManager_exports);
class HotZoneManager {
  configManager;
  locationController;
  logger;
  hotZoneConfig;
  activeHotZones = /* @__PURE__ */ new Map();
  constructor(configManager, locationController, logger) {
    this.configManager = configManager;
    this.locationController = locationController;
    this.logger = logger;
  }
  initialize() {
    try {
      this.logger.info("[LiveTarkovAI] Initializing HotZoneManager...");
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
  hookIntoLocationController(locationController) {
    try {
      if (!locationController || typeof locationController !== "object") return;
      this.locationController = locationController;
      if (locationController.getSpawnPoints && typeof locationController.getSpawnPoints === "function") {
        const originalGetSpawnPoints = locationController.getSpawnPoints;
        locationController.getSpawnPoints = (locationName) => {
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
  setupHotZones() {
    try {
      const config = this.configManager.getConfig();
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
  createHotZonesForMap(mapName, mapConfig) {
    try {
      const hotZones = [];
      if (mapConfig.spawnPoints) {
        for (const [spawnPointName, spawnPoint] of Object.entries(mapConfig.spawnPoints)) {
          if (spawnPoint && typeof spawnPoint === "object" && "enabled" in spawnPoint && spawnPoint.enabled) {
            if (spawnPointName.includes("boss") || spawnPointName.includes("Boss")) {
              hotZones.push({
                name: `${mapName}_${spawnPointName}`,
                type: "boss",
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
      this.createQuestHotZones(mapName, mapConfig, hotZones);
      this.createHighTrafficHotZones(mapName, mapConfig, hotZones);
      if (hotZones.length > 0) {
        this.activeHotZones.set(mapName, hotZones);
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error creating hot zones for map ${mapName}: ${error}`);
    }
  }
  // Create quest-related hot zones
  createQuestHotZones(mapName, mapConfig, hotZones) {
    try {
      const questLocations = {
        "bigmap": [
          { name: "dorms", priority: 2, maxBots: 3, botTypes: ["assault", "pmcbear"] },
          { name: "gas_station", priority: 2, maxBots: 2, botTypes: ["assault"] },
          { name: "construction", priority: 1, maxBots: 2, botTypes: ["assault"] }
        ],
        "shoreline": [
          { name: "resort", priority: 3, maxBots: 4, botTypes: ["assault", "pmcbear"] },
          { name: "pier", priority: 2, maxBots: 2, botTypes: ["assault"] },
          { name: "gas_station", priority: 1, maxBots: 2, botTypes: ["assault"] }
        ],
        "lighthouse": [
          { name: "water_treatment", priority: 3, maxBots: 3, botTypes: ["assault", "pmcbear"] },
          { name: "mountain", priority: 2, maxBots: 2, botTypes: ["assault"] }
        ],
        "woods": [
          { name: "sawmill", priority: 2, maxBots: 3, botTypes: ["assault", "pmcbear"] },
          { name: "scav_house", priority: 1, maxBots: 2, botTypes: ["assault"] }
        ],
        "reserve": [
          { name: "bunker", priority: 3, maxBots: 4, botTypes: ["assault", "pmcbear"] },
          { name: "heli_pad", priority: 2, maxBots: 2, botTypes: ["assault"] }
        ],
        "streets": [
          { name: "lexos", priority: 3, maxBots: 3, botTypes: ["assault", "pmcbear"] },
          { name: "chekannaya", priority: 2, maxBots: 2, botTypes: ["assault"] }
        ]
      };
      const mapQuestLocations = questLocations[mapName] || [];
      for (const questLocation of mapQuestLocations) {
        hotZones.push({
          name: `${mapName}_${questLocation.name}`,
          type: "quest",
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
  createHighTrafficHotZones(mapName, mapConfig, hotZones) {
    try {
      const highTrafficLocations = {
        "bigmap": [
          { name: "crossroads", priority: 1, maxBots: 2, botTypes: ["assault"] },
          { name: "old_gas", priority: 1, maxBots: 2, botTypes: ["assault"] }
        ],
        "shoreline": [
          { name: "village", priority: 1, maxBots: 2, botTypes: ["assault"] },
          { name: "power_station", priority: 1, maxBots: 2, botTypes: ["assault"] }
        ],
        "lighthouse": [
          { name: "village", priority: 1, maxBots: 2, botTypes: ["assault"] },
          { name: "rocks", priority: 1, maxBots: 2, botTypes: ["assault"] }
        ],
        "woods": [
          { name: "village", priority: 1, maxBots: 2, botTypes: ["assault"] },
          { name: "lumber_mill", priority: 1, maxBots: 2, botTypes: ["assault"] }
        ],
        "reserve": [
          { name: "village", priority: 1, maxBots: 2, botTypes: ["assault"] },
          { name: "garage", priority: 1, maxBots: 2, botTypes: ["assault"] }
        ],
        "streets": [
          { name: "village", priority: 1, maxBots: 2, botTypes: ["assault"] },
          { name: "garage", priority: 1, maxBots: 2, botTypes: ["assault"] }
        ]
      };
      const mapHighTrafficLocations = highTrafficLocations[mapName] || [];
      for (const highTrafficLocation of mapHighTrafficLocations) {
        hotZones.push({
          name: `${mapName}_${highTrafficLocation.name}`,
          type: "high_traffic",
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
  modifySpawnPointsForHotZones(locationName, originalSpawnPoints) {
    try {
      const hotZones = this.activeHotZones.get(locationName);
      if (!hotZones || hotZones.length === 0) {
        return originalSpawnPoints;
      }
      const modifiedSpawnPoints = [...originalSpawnPoints];
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
  applyHotZoneToSpawnPoints(hotZone, spawnPoints) {
    try {
      for (const spawnPoint of spawnPoints) {
        if (this.isSpawnPointNearHotZone(spawnPoint, hotZone)) {
          this.modifySpawnPointForHotZone(spawnPoint, hotZone);
        }
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying hot zone to spawn points: ${error}`);
    }
  }
  // Check if spawn point is near hot zone
  isSpawnPointNearHotZone(spawnPoint, hotZone) {
    try {
      if (spawnPoint.name && hotZone.spawnPoint) {
        return spawnPoint.name.toLowerCase().includes(hotZone.spawnPoint.toLowerCase()) || hotZone.spawnPoint.toLowerCase().includes(spawnPoint.name.toLowerCase());
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  // Modify spawn point based on hot zone
  modifySpawnPointForHotZone(spawnPoint, hotZone) {
    try {
      if (hotZone.priority > (spawnPoint.priority || 1)) {
        spawnPoint.priority = hotZone.priority;
      }
      if (hotZone.botTypes && hotZone.botTypes.length > 0) {
        if (!spawnPoint.botTypes) {
          spawnPoint.botTypes = [];
        }
        for (const botType of hotZone.botTypes) {
          if (!spawnPoint.botTypes.includes(botType)) {
            spawnPoint.botTypes.push(botType);
          }
        }
      }
      if (hotZone.excludeRegularScavs) {
        spawnPoint.excludeRegularScavs = true;
      }
      if (hotZone.minDistanceFromRegularSpawns) {
        spawnPoint.minDistanceFromRegularSpawns = hotZone.minDistanceFromRegularSpawns;
      }
      spawnPoint.hotZoneModified = true;
      spawnPoint.hotZoneName = hotZone.name;
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error modifying spawn point for hot zone: ${error}`);
    }
  }
  // Get hot zone information for a specific map
  getHotZonesForMap(mapName) {
    try {
      return this.activeHotZones.get(mapName) || [];
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error getting hot zones for map ${mapName}: ${error}`);
      return [];
    }
  }
  // Get all active hot zones
  getAllHotZones() {
    try {
      return this.activeHotZones;
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error getting all hot zones: ${error}`);
      return /* @__PURE__ */ new Map();
    }
  }
  // Update hot zone configuration
  updateHotZoneConfig(newConfig) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HotZoneManager
});
//# sourceMappingURL=HotZoneManager.js.map
