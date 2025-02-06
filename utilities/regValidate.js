const { body, validationResult } = require("express-validator");

const loginRules = () => {
    return [
        body("email").isEmail().withMessage("E-mail inválido."),
        body("password").notEmpty().withMessage("Senha é obrigatória.")
    ];
};

const checkLoginData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { loginRules, checkLoginData };
