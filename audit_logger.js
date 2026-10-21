const fs = require("fs");
const path = require("path");

class AuditLogger {
    constructor() {
        this.logFile = path.join(__dirname, "audit.log");
    }

    record(event, details = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            event,
            ...details
        };

        const line = JSON.stringify(entry);

        console.log(`[AUDIT] ${line}`);

        fs.appendFileSync(
            this.logFile,
            line + "\n",
            "utf8"
        );
    }
}

module.exports = AuditLogger;
