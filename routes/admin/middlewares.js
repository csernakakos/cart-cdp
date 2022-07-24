import { validationResult } from "express-validator";

const validatorFunctions = {
    handleErrors(template, dataCallback) { 
        return async (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                let data = {};
                if (dataCallback) {
                    data = await dataCallback(req);
                }
                return res.send(template({ errors, ...data }));
            }

            next();
        }
    },
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect("/signin");
      };

      next();
    }
}

export default validatorFunctions;