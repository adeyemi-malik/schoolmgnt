import connection from '../database/dbconnection.js';
export class users {
    constructor(ID, firstname, lastname, email, phone_no) {
        this.ID = ID;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone_no = phone_no;
    }
}

export default class UsersManager {

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
    async create(firstname, lastname, email, phone_no, password) {
        let insertQuery = `INSERT INTO users (firstname,lastname,email,phoneno,password) VALUES( '${firstname}', '${lastname}', '${email}', '${phone_no}','${password}')`;
        await connection.query(insertQuery);
    }


    async list() {
        let selectQuery = `SELECT * FROM users WHERE is_deleted = ${0}`;
        let result = await connection.query(selectQuery);
        return result;
    }
    async getUserId(email) {
        let userQuery = `select ID from users WHERE email='${email}'`;
        let result = await connection.query(userQuery);
        return result[0];
    }
    async getRoles(userId) {
        let rolesQuery = `select title from roles r inner join user_role ur on r.id = ur.role_id and ur.user_id = ${userId}`;
        let result = await connection.query(rolesQuery);
        return result[0];
    }
    async update(ID, firstname, lastname, email, phone_no, password) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let updateQuery = `UPDATE users SET firstname = '${firstname}',lastname = '${lastname}',lastname = '${lastname}', email ='${email}',phoneno = '${phone_no}',password = '${password}',last_modified = '${currentdate}' where ID = ${ID}`;
        await connection.query(updateQuery);
    }


    async Remove(ID) {

        //let currentdate = new Date().toISOString().split("T")[0];
        let deleteQuery = `UPDATE users SET is_deleted = ${1}  WHERE ID = ${ID}`;
        let result = await connection.query(deleteQuery);
        return result;
    }
}