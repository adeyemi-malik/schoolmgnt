const connection = require('../database/dbconnection');

class users {
    constructor(ID, firstname, lastname, email, phone_no) {
        this.ID = ID;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone_no = phone_no;
    }
}

class UsersManager {

    async find(ID) {
        let findquery = `SELECT * FROM users WHERE ID = ${ID}`;
        let result = await connection.query(findquery);
        return result[0][0];
    }
    async findByEmail(email) {
        let findquery = `SELECT * FROM users WHERE email = '${email}'`;
        let result = await connection.query(findquery);
        return result[0][0];
    }

    async find(email, password) {
        let findquery = `SELECT * FROM users WHERE email = '${email}' and password = '${password}'`;
        let result = await connection.query(findquery);
        return result[0][0];
    }
    async checkemail(email) {
        let emailquery = `SELECT * FROM users WHERE email = '${email}'`;
        let result = await connection.query(emailquery);
        return result[0][0];
    }
    create(firstname, lastname, email, phone_no, password) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let insertQuery = `INSERT INTO users (firstname,lastname,email,phoneno,password) VALUES( '${firstname}', '${lastname}', '${email}', '${phone_no}','${password}',${currentdate})`;
        connection.query(insertQuery);
    }


    async list() {
        let selectQuery = `SELECT * FROM users WHERE is_deleted = ${0}`;
        let result = await connection.query(selectQuery);
        return result;
    }
    async getRoles(userId) {
        let rolesQuery = `select name from roles r inner join userroles ur on r.id = ur.roleid and ur.userid = ${userId}`;
        let result = await connection.query(rolesQuery);
        return result[0];
    }

}
module.exports = UsersManager;