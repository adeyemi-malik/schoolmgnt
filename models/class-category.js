const connection = require('../database/dbconnection')
class ClassCategoryManager {
    async find(ID) {
        let findquery = `SELECT * FROM class_category WHERE ID = ${ID}`;
        let result = await connection.query(findquery);
        return result[0][0];
    }
    /* async getCategoryId() {
         let findquery = `SELECT ID FROM class_category`;
         let result = await connection.query(findquery);
         return result[0];
     }*/

    create(name) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let insertQuery = `INSERT INTO class_category ( name, date_created ) VALUES('${name}', '${currentdate}')`;
        connection.query(insertQuery);
    }

    async list() {
        let selectQuery = `SELECT * FROM class_category WHERE is_deleted = ${0}`;
        let result = await connection.query(selectQuery);
        return result[0];

    }

    update(ID, name) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let updateQuery = `UPDATE class_category SET name = '${name}',last_modified = '${currentdate}' where ID = ${ID}`;
        connection.query(updateQuery);
    }


    async Remove(ID) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let deleteQuery = `UPDATE class_category SET is_deleted = ${1}, date_deleted = '${currentdate}' WHERE ID = ${ID}`;
        let result = await connection.query(deleteQuery);
        return result;
    }
}

class Category {
    constructor(ID, name) {
        this.ID = ID;
        this.name = name;
    }
}

module.exports = { ClassCategoryManager, Category }

