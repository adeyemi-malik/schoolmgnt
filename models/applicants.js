import connection from '../database/dbconnection.js';
export default class ApplicantManager {


    async find(ID) {
        let findquery = `SELECT * FROM applicants WHERE ID = ${ID}`;
        let result = await connection.query(findquery);
        return result[0][0];
    }
    async admit(ID) {
        let DateModified = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let currentdate = new Date()//.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var dd = currentdate.getDate();
        var mm = currentdate.getMonth() + 1;
        var yyyy = currentdate.getFullYear();

        let DateResult = yyyy + '-' + mm + '-' + dd;
        console.log(DateResult);
        //let Today = DateResult.tostring();
        //console.log(Today);

        let admitquery = `UPDATE applicants SET is_admitted = ${1},date_admitted = '${DateResult}',last_modified = '${DateModified}'  WHERE ID = ${ID}`;
        let result = await connection.query(admitquery);
        return result;
    }
    async getAdmittedStudent(ID) {
        let selectQuery = `SELECT * FROM applicants WHERE is_admitted = ${1} AND ID = ${ID}`;
        let result = await connection.query(selectQuery);
        return result[0];
    }
    async listAdmitted() {
        let selectQuery = `SELECT * FROM applicants WHERE is_admitted = ${1}`;
        let result = await connection.query(selectQuery);
        return result;
    }

    async create(firstname, middlename, lastname, dateofbirth, sex, age, class_id, address, phoneno) {
        // let findquery = `SELECT classes.ID FROM classes INNER JOIN applicants ON applicants.class_id = classes.ID WHERE classes.ID = ${class_id}`;
        // let result = await connection.query(findquery);
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let insertQuery = `INSERT INTO applicants (firstname, middlename, lastname, dateofbirth, sex, age, class_id, address, phoneno,date_created) VALUES( '${firstname}','${middlename}', '${lastname}','${dateofbirth}','${sex}',${age},${class_id},'${address}','${phoneno}','${currentdate}')`;
        await connection.query(insertQuery);
        //return result;
    }

    async list() {
        let selectQuery = `SELECT * FROM applicants WHERE is_deleted = ${0}`;
        let result = await connection.query(selectQuery);
        return result[0];
    }
    async getClassNameList() {
        let selectQuery = `SELECT classes.class_name FROM classes INNER JOIN applicants ON applicants.class_id = classes.ID`;
        let result = await connection.query(selectQuery);
        return result[0];
    }
    async getClassName(ID) {
        let selectQuery = `SELECT classes.class_name FROM classes INNER JOIN applicants ON applicants.class_id = classes.ID WHERE applicants.ID = ${ID}`;
        let result = await connection.query(selectQuery);
        return result[0];
    }

    update(ID, firstname, middlename, lastname, dateofbirth, sex, age, class_id, address, phoneno) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        //let currentdate = new Date().toISOString().split("T")[0];
        let updateQuery = `UPDATE applicants SET firstname = '${firstname}}', middlename = '${middlename}}',lastname = '${lastname}',sex = '${sex}',dateofbirth = '${dateofbirth}',age = ${age},class_id = '${class_id}',address = '${address}',phoneno = '${phoneno}',last_modified = '${currentdate}' where ID = ${ID}`;
        connection.query(updateQuery);
    }


    async Remove(ID) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        //let currentdate = new Date().toISOString().split("T")[0];
        let deleteQuery = `UPDATE applicants SET is_deleted = ${1}, date_deleted = '${currentdate}' WHERE ID = ${ID}`;
        let result = await connection.query(deleteQuery);
        return result;
    }

}

export class Applicant {
    constructor(ID, firstname, middlename, lastname, dateofbirth, sex, age, class_id, address, phoneno, is_admitted, is_deleted, date_created, last_modified, date_deleted) {
        this.ID = ID;
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
        this.sex = sex;
        this.dateofbirth = dateofbirth;
        this.age = age;
        this.class_id = class_id;
        this.address = address;
        this.phoneno = phoneno;
        this.is_admitted = is_admitted;
        this.is_deleted = is_deleted;
        this.date_created = date_created;
        this.last_modified = last_modified;
        this.date_deleted = date_deleted;
    }
}
