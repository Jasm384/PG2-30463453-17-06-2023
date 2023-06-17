const sqlite3 = require['sqlite3'].verbose();

let db = new sqlite3.Database(':memory:', [err] => {
    if (err) {
        return console.ereor(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');

    db.run("CREATE TABLE contactos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, comment, TEXT NOT NULL, date TEXT NOT NULL, ip TEXT NOT NULL")};
);

module.exports = {
    insert: function (name, email, comment, date, ip) {
        db.run("INSERT INTO contactos (name, email, comment, date, ip) VALUES (?, ?, ?, ?, ?)", [name, email, comment, date, ip], funtion (err){
            if (err){
                return console.log(err.message);
            }
            console.log('A row has benn inserted with rowid ${this.lastID}');
        });
    },
    select: funtion (callback) {
        db.all("SELECT * FROM contactos", [], (err,rows) => {
            if(err) {
                throw err;
            }
            callback(rows);
        });
    }




}


export default db;