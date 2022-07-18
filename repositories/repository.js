import fs from "fs";
import crypto from "crypto";

class Repository {
     // constructor function is called instantly when a new instance of a class is created.
     constructor(filename) {
        if (!filename) {
            throw new Error("Creating a repository required a file name.");
        }

        this.filename = filename;

        try {
            fs.accessSync(this.filename);
        } catch (error) {
            fs.writeFileSync(this.filename, "[]");
        }
    }

    async create(attributes) {
        attributes.id = this.randomId();
        
        const records = await this.getAll();
        records.push(attributes);

        await this.writeAll(records);

        return attributes;
    }

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {encoding: "utf8"})
        );
    };

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2), {encoding: "utf8"});
        // null and 2 ensure to pretty-print JSON instead of printing all records on one line.
        // null: no custom formatters
        // 2: the level of identation to use in the string we create
    }

    randomId() {
        return crypto.randomBytes(7).toString("hex");
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(rec => rec.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(rec => rec.id !== id);

        await this.writeAll(filteredRecords);
    }
    
    async update(id, attributes) {
        const records = await this.getAll();
        const record = records.find(rec => rec.id === id);

        if (!record) {
            throw new Error(`No such record with id ${id}`);
        }

        Object.assign(record, attributes);

        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }

}

export default Repository;