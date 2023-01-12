import knex from 'knex';

class Controller {
	constructor(optionsMariaDB, table) {
		this.knex = knex(optionsMariaDB);
		this.table = table;
	}

	getAll() {
		let data = this.knex(this.table)
			.select('*')
			.then((resp) => resp)
			.catch((err) => console.log(err));

		return data;
	}

	save(object) {
		let save = this.knex(this.table)
			.insert(object)
			.then((res) => res)
			.catch((err) => console.log(err));

		return save;
	}
}

export { Controller };
