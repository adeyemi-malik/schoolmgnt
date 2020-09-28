

const connection = require('../database/dbconnection');

class RoleManager {


    async find(ID) {
        let findquery = `SELECT * FROM roles WHERE ID = ${ID}`;
        let result = await connection.query(findquery);
        return result[0];
    }

    create(title) {

        let insertQuery = `INSERT INTO roles (title) VALUES( '${title}')`;
        connection.query(insertQuery);
    }
    async list() {
        let selectQuery = `SELECT * FROM roles WHERE is_deleted = ${0}`;
        let result = await connection.query(selectQuery);
        return result;
    }
    async getRoleId(role) {
        let selectQuery = `SELECT ID from roles where title = '${role}' `;
        let result = await connection.query(selectQuery);
        return result[0];
    }

    async update(ID, title) {
        let updateQuery = `UPDATE roles SET title = '${title}' WHERE ID = ${ID} `;
        let result = await connection.query(updateQuery);
        return result;
    }

    async Remove(ID) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let deleteQuery = `UPDATE roles SET is_deleted = ${1} WHERE ID = ${ID}`;
        let result = await connection.query(deleteQuery);
        return result;
    }

}




class Role {
    constructor(ID, title) {
        this.ID = ID;
        this.title = title;
    }
}
module.exports = RoleManager;