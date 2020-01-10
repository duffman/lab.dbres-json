"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * January 2020
 */
const db_kernel_1 = require("@dbcore/db-kernel");
const log_1 = require("@utils/log");
class App {
    constructor() {
        log_1.Log.logBlue('App :: Constructor');
        this.testDb();
    }
    testDb() {
        let db = new db_kernel_1.DBKernel();
        let res;
        db.dbQuery('SELECT * customers').then(res => {
            log_1.Log.logPurple('DB Query', res);
        }).catch(err => {
            log_1.Log.logAppError(this, 'DB Error ::', err);
        });
    }
}
exports.App = App;
