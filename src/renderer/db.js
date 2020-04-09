import sqlite3 from 'sqlite3'

class sqliteDB {
    constructor() {
        this.db = new sqlite3.Database('db.sqlite', function(err) {
            if (err) {
                console.log(err)
            }
        })
        this.excute('PRAGMA foreign_keys = ON;')
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
        let sql = `insert or replace into file (path) values `
        file_paths = file_paths.join(`'),('`)
        file_paths = `('` + file_paths + `');`
        sql += file_paths
        console.log(sql)
        return this.excute(sql)
    }

    /**
     * 根据文件路径确定文件是否存在
     * @param {string} file_path 
     * @return {boolean}
     */
    async isFileExist(file_path) {
        let sql = `select * from file where path='${file_path}';`
        let res = await this.excute(sql)
        console.log(res)
        if (res.length !== 0) {
            return true
        }
        else {
            return false
        }
    }

    async getFile(start=0, end=1000) {
        let sql = `select * from file where id >= ${start} and id < ${end};`
        let res = await this.excute(sql)
        return res
    }

    async getTagGroup() {
        let sql = `select * from tag_group order by id;`
        let res = await this.excute(sql)
        return res
    }

    async addTagGroup(tag_group_name) {
        let sql = `insert into tag_group (name) values ('${tag_group_name}');`
        await this.excute(sql)
        sql = `select * from tag_group where name = '${tag_group_name}';`
        let res = await this.excute(sql)
        return res[0]
    }

    async deleteTagGroupByID(tag_group_id) {
        let sql = `delete from tag_group where id = ${tag_group_id};`
        await this.excute(sql)
    }

    async getTagsByGroupID(group_id) {
        let sql = `select * from tag where tag_group_id = ${group_id};`
        let res = await this.excute(sql)
        return res
    }

    async getTagsByFileID(file_id) {
        let sql = `select tag.id, tag.name, tag.tag_group_id from tag, file_tag 
                    where file_tag.file_id = ${file_id} and file_tag.tag_id = tag.id;`
        let res = await this.excute(sql)
        return res
    }

    /**
     * 根据标签名确认标签是否存在
     * @param {string} tag_name 
     * @return {boolean}
     */
    async isTagExist(tag_name) {
        let sql = `select * from tag where name = '${tag_name}';`
        let res = await this.excute(sql)
        if (res.length !== 0) {
            return true
        }
        else {
            return false
        }
    }

    async addTag(tag_name, group_id) {
        let sql = `insert into tag (name, tag_group_id) values ('${tag_name}', ${group_id});`
        console.log(sql)
        let res = await this.excute(sql)
    }

    async getTagByID(tag_id) {
        let sql = `select * from tag where id = ${tag_id};`
        let res = await this.excute(sql)
        return res[0]
    }

    async updateTagByID(tag) {
        let sql = `update tag 
                    set name = '${tag.name}',
                    tag_group_id = ${tag.tag_group_id} 
                    where id = ${tag.id}`
        let res = await this.excute(sql)
        return
    }

    async deleteTagByID(tag_id) {
        let sql = `delete from tag where id = ${tag_id};`
        let res = await this.excute(sql)
        return
    }
}

export default new sqliteDB()

