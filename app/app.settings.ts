/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * January 2020
 */

export module Settings {
	export const DebugMode = true;

	export const allowedCORSOrigins = "*";
	export const sessionCookieKey = "kaknyckel";
	export const sessionSecret = "1gulka9n";

	export module Database {
		export const dbName = "wizum";
		export const dbHost = "localhost";
		export const dbUser = "duffman";
		export const dbPass = "bjoe7151212";
	}
}
