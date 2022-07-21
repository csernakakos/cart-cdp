import layout from "../layout.js";
import { getError } from "../../helpers.js";

export default ({ errors }) => {
    return layout({
        template: `
            <form method="POST">
                <input placeholder="Title" name="title" />
                <input placeholder="Price" name="price" />
                <input type="file" name="image" />
                <button>Submit</button>
            </form>
        `
    })
};