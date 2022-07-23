import { validationResult } from "express-validator";

const validatorFunctions = {
    handleErrors(template) {
        return (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.send(template({ errors }));
            }

            next();
        }
    }
}

export default validatorFunctions;