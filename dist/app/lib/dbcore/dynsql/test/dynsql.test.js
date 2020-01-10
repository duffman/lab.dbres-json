"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * January 2020
 */
const dynsql_1 = require("../dynsql");
let qrCode = 'raffe';
let dynSql = new dynsql_1.DynSQL();
dynSql.get('restaurants').where('qr_code', qrCode);
let sql = dynSql.toSQL();
console.log('SQL ::', sql);
