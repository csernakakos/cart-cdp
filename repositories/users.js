import fs from "fs";

class usersRepository {
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

    async checkForFile() {

    }

}

const repo = new usersRepository("users.json");