const Joi = require("joi");
const validateCreateUser = (obj) => {
    const shcema = Joi.object({
        fullName: Joi.string().min(3).max(200).required(),
        email: Joi.string().trim().min(11).max(200).required(),
        password: Joi.string().trim().min(8).max(200).required(),
    });
    return shcema.validate(obj);
}
const validateLogineUser = (obj) => {
    const shcema = Joi.object({
        email: Joi.string().trim().min(11).max(200).required(),
        password: Joi.string().trim().min(8).max(200).required()
    });
    return shcema.validate(obj);
}
module.exports = {
    validateCreateUser,
    validateLogineUser
}