"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * January 2020
 */
const dynsql_1 = require("./dynsql");
class Dynsql_test {
    constructor() {
        console.log('Kalle');
        let dyn = new dynsql_1.DynSQL();
        dyn.get('restaurants').where('elem', 'vad').where('id', 345);
        let sql = dyn.toSQL();
        console.log('SQL:', sql);
    }
}
exports.Dynsql_test = Dynsql_test;
let test = new Dynsql_test();
