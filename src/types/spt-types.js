"use strict";
// SPT Type Definitions for Live Tarkov AI Mod
// These interfaces match the actual SPT API structure
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigTypes = exports.EquipmentSlots = exports.BotType = exports.BotDifficulty = void 0;
var BotDifficulty;
(function (BotDifficulty) {
    BotDifficulty["EASY"] = "easy";
    BotDifficulty["NORMAL"] = "normal";
    BotDifficulty["HARD"] = "hard";
    BotDifficulty["IMPOSSIBLE"] = "impossible";
})(BotDifficulty || (exports.BotDifficulty = BotDifficulty = {}));
var BotType;
(function (BotType) {
    BotType["ASSAULT"] = "assault";
    BotType["PMCBEAR"] = "pmcbear";
    BotType["PMCUSEC"] = "pmcusec";
    BotType["BOSS"] = "boss";
    BotType["FOLLOWER"] = "follower";
    BotType["SCAV"] = "scav";
})(BotType || (exports.BotType = BotType = {}));
var EquipmentSlots;
(function (EquipmentSlots) {
    EquipmentSlots["HEAD"] = "Head";
    EquipmentSlots["EARS"] = "Ears";
    EquipmentSlots["EYES"] = "Eyes";
    EquipmentSlots["FACE"] = "Face";
    EquipmentSlots["BODY"] = "Body";
    EquipmentSlots["ARMS"] = "Arms";
    EquipmentSlots["HANDS"] = "Hands";
    EquipmentSlots["LEGS"] = "Legs";
    EquipmentSlots["FEET"] = "Feet";
    EquipmentSlots["BACKPACK"] = "Backpack";
    EquipmentSlots["POCKETS"] = "Pockets";
    EquipmentSlots["SECURED"] = "Secured";
})(EquipmentSlots || (exports.EquipmentSlots = EquipmentSlots = {}));
var ConfigTypes;
(function (ConfigTypes) {
    ConfigTypes["CORE"] = "CORE";
    ConfigTypes["BOTS"] = "BOTS";
    ConfigTypes["LOCATIONS"] = "LOCATIONS";
    ConfigTypes["SPAWNS"] = "SPAWNS";
})(ConfigTypes || (exports.ConfigTypes = ConfigTypes = {}));
//# sourceMappingURL=spt-types.js.map