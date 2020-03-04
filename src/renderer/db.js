import sqlite3 from 'sqlite3'

export let db

export function initDB() {
    db = new sqlite3.Database('db.sqlite', function(err) {
        console.log(err)
    })
    
}

