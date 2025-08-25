"use strict";

// Create the mod object that implements the required SPT interfaces
const mod = {
    // IPreSptLoadMod interface
    preSptLoad: function(container) {
        try {
            console.log("[LiveTarkovAI] Initializing Live Tarkov - AI Mod...");
            
            // Initialize configuration
            this.configManager = new (require("./ConfigManager").ConfigManager)();
            this.configManager.initialize();
            
            console.log("[LiveTarkovAI] Live Tarkov - AI Mod initialized successfully!");
        } catch (error) {
            console.error("[LiveTarkovAI] Error during preSptLoad:", error);
        }
    },

    // IPostDBLoadMod interface
    postDBLoad: function(container) {
        try {
            console.log("[LiveTarkovAI] Configuring live Tarkov spawn data...");
            
            // Resolve required SPT services
            const databaseServer = container.resolve("DatabaseServer");
            
            // Initialize SpawnManager with container for REAL spawn control
            this.spawnManager = new (require("./SpawnManager").SpawnManager)(databaseServer, this.configManager, this.logger, container);
            this.spawnManager.initialize();
            
            console.log("[LiveTarkovAI] Live Tarkov spawn data configuration completed!");
        } catch (error) {
            console.error("[LiveTarkovAI] Error during postDBLoad:", error);
        }
    },

    // Logger for the mod
    logger: {
        info: function(msg) { console.log("[LiveTarkovAI] " + msg); },
        warn: function(msg) { console.warn("[LiveTarkovAI] " + msg); },
        error: function(msg) { console.error("[LiveTarkovAI] " + msg); },
        debug: function(msg) { console.log("[LiveTarkovAI] [DEBUG] " + msg); }
    }
};

// Export the mod object directly (what SPT expects)
exports.mod = mod;
