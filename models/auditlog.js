
import connection from '../database/dbconnection.js';

export default class AuditLog {
    insertAuditLog(action, detail, performedby) {
        let currentDate = new Date().toISOString().split("T")[0];
        let insertQuery = `INSERT INTO auditlog(action, detail, performedby, date_performed) VALUES('${action}', '${detail}', '${performedby}','${currentDate}')`;
        connection.query(insertQuery);
    }
    async getLogs() {
        let selectQuery = `select * from auditlog`;
        let result = await connection.query(selectQuery);
        return result;
    }
    async removeLog(ID) {
        let deleteQuery = `DELETE FROM auditlog WHERE ID = ${ID}`;
        let result = await connection.query(deleteQuery);
        return result;
    }
}