"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const mysql = require("mysql");
const db_result_parser_1 = require("./db-result-parser");
const app_settings_1 = require("@app/app.settings");
const log = console.log;
var DbState;
(function (DbState) {
    DbState[DbState["Unset"] = 0] = "Unset";
    DbState[DbState["Connected"] = 1] = "Connected";
    DbState[DbState["Disconnected"] = 2] = "Disconnected";
})(DbState || (DbState = {}));
let DBKernel = class DBKernel {
    constructor() {
        this.connLost = false;
        this.connSettings = {
            host: app_settings_1.Settings.Database.dbHost,
            user: app_settings_1.Settings.Database.dbUser,
            password: app_settings_1.Settings.Database.dbPass,
            database: app_settings_1.Settings.Database.dbName
        };
        //console.log("DB SETTINGS ::", this.connSettings);
    }
    assignSettings(settings) {
        this.connSettings = settings;
    }
    createConnection(openConnection = true) {
        let conn;
        try {
            conn = mysql.createConnection({
                host: this.connSettings.host,
                user: this.connSettings.user,
                password: this.connSettings.password,
                database: this.connSettings.database
            });
            conn.on("error", (err) => {
                console.log("FAT FET FUCK::: TAG ==");
                if (err.code == 'PROTOCOL_CONNECTION_LOST') {
                    console.log("FAT FET FUCK -- LOST --:::", err);
                    this.connLost = true;
                }
            });
            if (openConnection) {
                conn.connect();
            }
        }
        catch (ex) {
            console.log("createConnection :: ERROR ::", ex);
        }
        return conn;
    }
    executeTransaction(sql) {
        let scope = this;
        let subConn = this.createConnection();
        let result;
        let executeError = null;
        function beginTransaction() {
            return new Promise((resolve, reject) => {
                subConn.query("START TRANSACTION", (error, result) => {
                    if (!error) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
            });
        }
        function executeSql(sql) {
            return new Promise((resolve, reject) => {
                subConn.query(sql, (error, result, tableFields) => {
                    db_result_parser_1.DbResultParser.parseQueryResult(error, result, tableFields).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                });
            });
        }
        function commit() {
            return new Promise((resolve, reject) => {
                subConn.query("COMMIT", (error, result) => {
                    console.log("error ::", error);
                    console.log("result ::", result);
                    if (!error) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
            });
        }
        function rollback() {
            return new Promise((resolve, reject) => {
                subConn.query("ROLLBACK", (error, result) => {
                    console.log("error ::", error);
                    console.log("result ::", result);
                    if (!error) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
            });
        }
        async function execute() {
            let beginTransRes = await beginTransaction();
            try {
                result = await executeSql(sql);
                await commit();
            }
            catch (err) {
                let transError = err != null ? err : new Error("SQL Execution failed");
                executeError = transError;
            }
            if (executeError != null || !result.success) {
                await rollback();
            }
        }
        return new Promise((resolve, reject) => {
            execute().then(() => {
                if (executeError != null) {
                    reject(executeError);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    /**
     *
     * @param {string} table
     * @param {string} where
     * @param {string} is
     * @returns {Promise<number>}
     */
    countRows(table, where, is) {
        let countAlias = "count";
        return new Promise((resolve, reject) => {
            let query = `SELECT COUNT(*) AS ${countAlias} FROM ${table} WHERE ${where}${is}`;
            this.dbQuery(query).then(res => {
                let row = res.safeGetFirstRow();
                let count = row.getValAsNum(countAlias);
                resolve(count);
            }).catch(err => {
                resolve(-1);
            });
        });
    }
    dbQuery(sql) {
        return new Promise((resolve, reject) => {
            let conn;
            try {
                conn = this.createConnection(true);
            }
            catch (ex) {
                console.log("Error Creating Connection");
                reject(ex);
            }
            conn.query(sql, (error, result, tableFields) => {
                if (error) {
                    console.log("dbQuery ERROR ::", error);
                    if (error.fatal) {
                        console.trace('fatal error: ' + error.message);
                    }
                    conn.end();
                    reject(error);
                }
                else {
                    return db_result_parser_1.DbResultParser.parseQueryResult(error, result, tableFields).then((res) => {
                        if (error) {
                            console.log("FET ERROR ::", error);
                            throw error;
                        }
                        return res;
                    }).then((res) => {
                        conn.end();
                        resolve(res);
                    }).catch((err) => {
                        conn.end();
                        reject(err);
                    });
                }
            });
        });
    }
};
DBKernel = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], DBKernel);
exports.DBKernel = DBKernel;
