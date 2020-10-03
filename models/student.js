import connection from '../database/dbconnection.js';
export default class StudentManager {


    async find(ID) {
        let findquery = `SELECT * FROM students WHERE ID = ${ID}`;
        let result = await connection.query(findquery);
        return result[0][0];
    }
    async registerSuccessfulApplicant(applicant_id, firstname, middlename, lastname, dateofbirth, sex, age, address, class_id, admissiondate, phoneno) {
        let findquery = `SELECT classes.ID FROM classes INNER JOIN students ON students.class_id = classes.ID WHERE classes.ID = ${class_id}`;
        let result = await connection.query(findquery);

        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let insertQuery = `INSERT INTO students (applicant_id,firstname,middlename,lastname,dateofbirth, sex,age,address,class_id,admissiondate,phoneno,date_created) VALUES(${applicant_id},'${firstname}','${middlename}', '${lastname}','${dateofbirth}', '${sex}',${age},'${address}','${class_id}','${admissiondate}','${phoneno}','${currentdate}')`;
        await connection.query(insertQuery);
        return result;
    }
    async getClassNameList() {
        let selectQuery = `SELECT classes.class_name FROM classes INNER JOIN students ON students.class_id = classes.ID`;
        let result = await connection.query(selectQuery);
        return result[0];
    }

    create(firstname, middlename, lastname, dateofbirth, sex, age, address, class_id, admissiondate, phoneno) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let insertQuery = `INSERT INTO students (firstname,middlename,lastname,dateofbirth, sex,age,address,class_id,admissiondate,phoneno,date_created) VALUES('${firstname}','${middlename}', '${lastname}','${dateofbirth}', '${sex}',${age},'${address}',${class_id},'${admissiondate}','${phoneno}','${currentdate}')`;
        connection.query(insertQuery);
    }

    async list() {
        let selectQuery = `SELECT * FROM students WHERE is_deleted = ${0}`;
        let result = await connection.query(selectQuery);
        return result;

    }

    async update(ID, firstname, middlename, lastname, dateofbirth, sex, age, address, class_id, admissiondate, phoneno) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let updateQuery = `UPDATE students SET firstname ='${firstname}',middlename='${middlename}',lastname='${lastname}',sex='${sex}',dateofbirth='${dateofbirth}',age=${age},class_id=${class_id},address='${address}',admissiondate='${admissiondate}',phoneno='${phoneno}',last_modified='${currentdate}'where ID = ${ID}`;
        await connection.query(updateQuery);
    }


    async Remove(ID) {
        let currentdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        //let currentdate = new Date().toISOString().split("T")[0];
        let deleteQuery = `UPDATE students SET is_deleted = ${1}, date_deleted = '${currentdate}' WHERE ID = ${ID}`;
        let result = await connection.query(deleteQuery);
        return result;
    }

}

export  class student {
    constructor(ID, firstname, middlename, lastname, sex, dateofbirth, age, address, class_id, admissiondate) {
        this.ID = ID;
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
        this.sex = sex;
        this.dateofbirth = dateofbirth;
        this.age = age;
        this.address = address;
        this.class_id = class_id;
        this.admissiondate = admissiondate;
    }
}
