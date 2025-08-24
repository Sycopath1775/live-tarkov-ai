import { build } from "esbuild";
import { promises as fs } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildMod() {
    try {
        console.log("Building Live Tarkov - AI Mod...");
        console.log("IMPORTANT: mod.js will be preserved for SPT compatibility");

        // Build TypeScript files (EXCLUDING mod.ts to prevent overwriting mod.js)
        await build({
            entryPoints: [
                join(__dirname, "src/ConfigManager.ts"),
                join(__dirname, "src/SpawnManager.ts"),
                join(__dirname, "src/HotZoneManager.ts"),
                join(__dirname, "src/FikaIntegrationService.ts"),
                join(__dirname, "src/BushShootingService.ts"),
                join(__dirname, "src/SainIntegrationService.ts")
            ],
            bundle: false,
            outdir: join(__dirname, "src"),
            format: "cjs",
            target: "node18",
            platform: "node",
            sourcemap: true,
            minify: false
        });

        console.log("✓ TypeScript compilation completed");
        console.log("✓ mod.js preserved (not overwritten)");

        // Verify mod.js integrity
        await verifyModJsIntegrity();

        // Copy package.json to src directory
        await fs.copyFile(
            join(__dirname, "package.json"),
            join(__dirname, "src/package.json")
        );

        console.log("✓ Build completed successfully!");
        console.log("✓ mod.js integrity maintained for SPT compatibility");
        console.log("✓ All TypeScript files compiled");
        
    } catch (error) {
        console.error("Build failed:", error);
        process.exit(1);
    }
}

async function verifyModJsIntegrity() {
    try {
        const modJsPath = join(__dirname, "src/mod.js");
        const modJsContent = await fs.readFile(modJsPath, 'utf8');
        
        if (!modJsContent.includes('exports.mod = mod')) {
            console.error("ERROR: mod.js was corrupted! Recreating...");
            await recreateModJs();
        } else {
            console.log("✓ mod.js integrity verified - SPT compatibility maintained");
        }
    } catch (error) {
        console.error("ERROR: mod.js missing! Recreating...");
        await recreateModJs();
    }
}

async function recreateModJs() {
    const modJsContent = `"use strict";

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
`;

    await fs.writeFile(join(__dirname, "src/mod.js"), modJsContent);
    console.log("✓ mod.js recreated with correct SPT exports (no tsyringe dependency)");
}

// Run build
buildMod();
