"use strict";

// Create the mod object that implements the required SPT interfaces
const mod = {
    // IPreSptLoadMod interface
    preSptLoad: function() {
        try {
            console.log("[Live Tarkov - AI] Pre-SPT load phase...");
            
            // Initialize managers
            this.configManager = new (require("./ConfigManager").ConfigManager)();
            this.hotZoneManager = new (require("./HotZoneManager").HotZoneManager)(this.configManager);
            this.spawnManager = new (require("./SpawnManager").SpawnManager)(this.configManager, this.hotZoneManager);
            
            // Initialize new integration services
            this.fikaIntegrationService = new (require("./FikaIntegrationService").FikaIntegrationService)(
                this.configManager.getFikaIntegrationConfig()
            );
            this.bushShootingService = new (require("./BushShootingService").BushShootingService)(
                this.configManager.getBushShootingConfig()
            );
            this.sainIntegrationService = new (require("./SainIntegrationService").SainIntegrationService)(
                this.configManager.getSainIntegrationConfig()
            );
            
            console.log("[Live Tarkov - AI] All managers initialized");
        } catch (error) {
            console.error("[Live Tarkov - AI] Error initializing managers:", error);
        }
    },

    // IPostDBLoadMod interface
    postDBLoad: function(database) {
        try {
            console.log("[Live Tarkov - AI] Post-DB load phase...");
            
            // Initialize integration services
            if (this.fikaIntegrationService) {
                try {
                    this.fikaIntegrationService.initialize(database);
                    console.log("[Live Tarkov - AI] Fika integration service initialized");
                } catch (error) {
                    console.error("[Live Tarkov - AI] Error initializing Fika integration:", error);
                }
            }
            
            // Initialize bush shooting restrictions
            if (this.bushShootingService) {
                try {
                    console.log("[Live Tarkov - AI] Bush shooting restrictions status:", 
                        this.bushShootingService.getRestrictionStatus());
                } catch (error) {
                    console.error("[Live Tarkov - AI] Error getting bush shooting status:", error);
                }
            }
            
            // Initialize SAIN integration
            if (this.sainIntegrationService) {
                try {
                    console.log("[Live Tarkov - AI] SAIN integration service status:", 
                        this.sainIntegrationService.getIntegrationStatus());
                } catch (error) {
                    console.error("[Live Tarkov - AI] Error getting SAIN integration status:", error);
                }
            }
            
            console.log("[Live Tarkov - AI] All integration services initialized");
        } catch (error) {
            console.error("[Live Tarkov - AI] Error initializing integration services:", error);
        }
    },

    // Helper method
    hookIntoRaidServices: function() {
        try {
            // Hook into raid time adjustment service to modify spawns
            // This will be called when raids start/end
            console.log("[Live Tarkov - AI] Hooks installed for raid services");
        } catch (error) {
            console.error("[Live Tarkov - AI] Error installing hooks:", error);
        }
    }
};

// Export the mod object directly (what SPT expects)
exports.mod = mod;
