"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * January 2020
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Settings;
(function (Settings) {
    Settings.DebugMode = true;
    Settings.allowedCORSOrigins = "*";
    Settings.sessionCookieKey = "kaknyckel";
    Settings.sessionSecret = "1gulka9n";
    let Database;
    (function (Database) {
        Database.dbName = "wizum";
        Database.dbHost = "localhost";
        Database.dbUser = "duffman";
        Database.dbPass = "bjoe7151212";
    })(Database = Settings.Database || (Settings.Database = {}));
})(Settings = exports.Settings || (exports.Settings = {}));
