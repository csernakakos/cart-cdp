import fs from "fs";
import crypto from "crypto";
import util from "util";
const scrypt = util.promisify(crypto.scrypt);

class usersRepository {
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

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {encoding: "utf8"})
        );
    };

    async create(attributes) {
        attributes.id = this.randomId();

        // Generate salt, hashedPassword
        const salt = crypto.randomBytes(8).toString("hex");
        const buffer = await scrypt(attributes.password, salt, 64);

        const records = await this.getAll();

        // Replace the default password inside attributes with the buffer and the salt
        const record = {
            ...attributes,
            password: `${buffer.toString("hex")}.${salt}`,
        };

        records.push(record);

        await this.writeAll(records);

        return record;
    }

    async comparePasswords(saved, entered) {
     // saved = password stored in database
     // entered = password entered by user when attempting to sign in   


    //  const result = saved.split(".");
    //  const hashed = result[0];
    //  const salt = result[1];

     const [ hashed, salt ] = saved.split(".");

     const hashedEnteredBuffer = await scrypt(entered, salt, 64);

     return hashed === hashedEnteredBuffer.toString("hex");
    }

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

};

export default new usersRepository("users.json");