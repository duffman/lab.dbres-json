/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * January 2020
 */
import { DBKernel } from "@dbcore/db-kernel";
import { IDbResult } from "@dbcore/db-result";
import { Log } from "@utils/log";

export class App {
	constructor () {
		Log.logBlue('App :: Constructor');
		this.testDb();
	}

	public testDb() {
		let db = new DBKernel();
		let res: IDbResult;
		db.dbQuery('SELECT * customers').then(res => {
			Log.logPurple('DB Query', res);
		}).catch(err => {
			Log.logAppError(this, 'DB Error ::', err);
		});
	}
}
