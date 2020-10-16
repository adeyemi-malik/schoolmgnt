import connection from '../database/dbconnection.js';


export default class ContactManager {
    async find(ID) {
        let findquery = `SELECT * FROM contacts WHERE ID = ${ID}`;
        let result = await connection.query(findquery);
        return result[0];
    }

    create(name, email, message) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let insertQuery = `INSERT INTO contacts (name, email, message, date_contacted) VALUES('${name}','${email}','${message}','${currentdate}')`;
        connection.query(insertQuery);
    }

    async list() {
        let selectQuery = `SELECT * FROM contacts WHERE is_deleted = ${0}`;
        let result = await connection.query(selectQuery);
        return result;
    }
    async Remove(ID) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let deleteQuery = `UPDATE contacts SET is_deleted = ${1},date_deleted = '${currentdate}' WHERE ID = ${ID}`;
        let result = await connection.query(deleteQuery);
        return result;
    }

}

export class contact {
    constructor(ID, name, email, message) {
        this.ID = ID;
        this.name = name;
        this.email = email;
        this.message = message;
    }

}