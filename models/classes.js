const connection = require('../database/dbconnection')

class ClassManager {



    async find(ID) {
        let findquery = `SELECT * FROM classes WHERE ID = ${ID}`;
        let result = await connection.query(findquery);
        return result[0][0];
    }

    create(classname, category) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let insertQuery = `INSERT INTO classes ( class_name, class_category_id, date_created ) VALUES('${classname}', '${category}', '${currentdate}')`;
        connection.query(insertQuery);
    }

    async list() {
        let selectQuery = `SELECT * FROM classes WHERE is_deleted = ${0}`;
        let result = await connection.query(selectQuery);
        return result;
    }
    async listByCategoryId(categoryId) {
        let selectQuery = `SELECT * FROM classes WHERE is_deleted = ${0} and class_category_id = ${categoryId}`;
        let result = await connection.query(selectQuery);
        return result[0];

    }

    update(ID, classname, category) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let updateQuery = `UPDATE classes SET class_name = '${classname}}',class_category = '${category}',last_modified = '${currentdate}' where ID = ${ID}`;
        connection.query(updateQuery);
    }


    async Remove(ID) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let deleteQuery = `UPDATE classes SET is_deleted = ${1}, date_deleted = '${currentdate}' WHERE ID = ${ID}`;
        let result = await connection.query(deleteQuery);
        return result;
    }

}



class Class {
    constructor(ID, classname, category) {
        this.ID = ID;
        this.classname = classname;
        this.category = category;
    }
}
module.exports = { ClassManager, Class };