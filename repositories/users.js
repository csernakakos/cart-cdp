import fs from "fs";
import crypto from "crypto";
import util from "util";
import Repository from "./repository.js";
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
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
    };

    async comparePasswords(saved, entered) {
        // saved = password stored in database
        // entered = password entered by user when attempting to sign in   
   
   
       //  const result = saved.split(".");
       //  const hashed = result[0];
       //  const salt = result[1];
   
        const [ hashed, salt ] = saved.split(".");
   
        const hashedEnteredBuffer = await scrypt(entered, salt, 64);
   
        return hashed === hashedEnteredBuffer.toString("hex");
    };
};

export default new UsersRepository("users.json");