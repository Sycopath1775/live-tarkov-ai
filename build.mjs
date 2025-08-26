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
                join(__dirname, "src/SpawnManager.ts")
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
`;
    
    try {
        await fs.writeFile(join(__dirname, "src/mod.js"), modJsContent);
        console.log("✓ mod.js recreated with correct SPT exports (no tsyringe dependency)");
    } catch (error) {
        console.error("Failed to recreate mod.js:", error);
        throw error;
    }
}

// Run build
buildMod();
