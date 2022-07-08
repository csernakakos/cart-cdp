import fs from "fs";

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
        // Open file
        const contents = await fs.promises.readFile(this.filename, {encoding: "utf8"});

        // Read file contents
        // console.log(contents); // This time, we get a string

        // Parse file contents
        const data = JSON.parse(contents);

        // Return parsed data
        return data;
    }
};

const test = async () => {
    const repo = new usersRepository("users.json");
    const users = await repo.getAll();
    console.log(users); // This time, we get a JavaScript array
}

test(); 