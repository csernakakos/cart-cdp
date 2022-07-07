class usersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error("Creating a repository required a file name.");
        }
    }
}

new usersRepository("a.json");