
const connection = require('../database/dbconnection')

class AuditLog {
    insertAuditLog(action, detail, performedby) {
        let currentDate = new Date().toISOString().split("T")[0];
        let insertQuery = `INSERT INTO auditlog(action, detail, performedby, date_performed) VALUES('${action}', '${detail}', '${performedby}','${currentDate}')`;
        connection.query(insertQuery);
    }
}

module.exports = AuditLog;