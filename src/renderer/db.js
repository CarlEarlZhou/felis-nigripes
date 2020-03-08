import sqlite3 from 'sqlite3'

class sqliteDB {
    constructor() {
        this.db = new sqlite3.Database('db.sqlite', function(err) {
            if (err) {
                console.log(err)
            }
        })
    }

    async excute(sql) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, function(err, res) {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(res)
                }
            })
        })
    }

    async storeFiles(file_paths) {
        let sql = `insert or replace into test (c) values `
        file_paths = file_paths.join(`'),('`)
        file_paths = `('` + file_paths + `');`
        sql += file_paths
        console.log(sql)
        return this.excute(sql)
    }

    async isFileExist(file_path) {
        let sql = `select * from test where c='${file_path}';`
        let res = await this.excute(sql)
        console.log(res)
        if (res.length !== 0) {
            return true
        }
        else {
            return false
        }
    }

    async getTagGroup() {
        let sql = `select * from tag_group;`
        let res = await this.excute(sql)
        return res
    }

    async getTagsByGroupID(group_id) {
        let sql = `select * from tag where tag_group_id = ${group_id};`
        let res = await this.excute(sql)
        return res
    }
}

export default new sqliteDB()

