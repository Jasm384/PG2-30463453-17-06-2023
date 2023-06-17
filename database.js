const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');

    db.run("CREATE TABLE IF NOT EXISTS contactos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, date TEXT NOT NULL, ip TEXT NOT NULL, locat TEXT NOT NULL)");
});


module.exports = {
    insert: function (name, email, message, date, ip, locat) {
        db.run("INSERT INTO contactos (name, email, message, date, ip, locat) VALUES (?, ?, ?, ?, ?, ?)", [name, email, message, date, ip, locat], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    },
    select: function (callback) {
        db.all("SELECT * FROM contactos", [], (err, rows) => {
            if (err) {
                throw err;
            }
            callback(rows);
        });
    }
}