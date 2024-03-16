const asyncHandelr = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dbConnection = require("../config/database");
const ApiError = require("../utils/apiError");
const sendMail = require("../utils/sendEmail");
const { validateCreateUser, validateLogineUser } = require("../models/userModel");

async function hashPassword(pass) {
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(pass, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })
    return hashedPassword
}

async function comparePassword(plainPass, hashword) {
    const result = await new Promise((resolve, reject) => {
        bcrypt.compare(plainPass, hashword, function (err, isPasswordMatch) {
            if (err) reject(err)
            resolve(isPasswordMatch)
        });
    })
    return result
}

const register = asyncHandelr(async (req, res, next) => {
    const { error } = validateCreateUser(req.body);
    if (error) {
        return next(new ApiError(error.details[0].message, 400));
    }
    const [result1] = await (await dbConnection).query('SELECT * FROM users WHERE email = ?', [req.body.email]);
    if (result1.length !== 0) {
        res.status(404).json({ message: "Wrong Email Or Password" });
        return next(new ApiError(`Wrong Email Or Password`, 404));
    }
    const {
        fullName, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const [result2] = await (await dbConnection).query(`INSERT INTO users (fullName,email,password)
        VALUES(?,?,?)`, [fullName, email, hashedPassword]);
    const [result3] = await (await dbConnection).query('SELECT id FROM users WHERE email = ?', [req.body.email]);
    const verificationCode = Math.floor(Math.random() * 9000) + 1000;
    sendMail(email, "verification Code", verificationCode);
    res.status(201).json({ Id: result3[0].id, verificationCode: verificationCode });
}
);
const login = asyncHandelr(async (req, res, next) => {
    const { error } = validateLogineUser(req.body);
    if (error) {
        return next(new ApiError(error.details[0].message, 400));
    }
    const [result] = await (await dbConnection).query('SELECT * FROM users WHERE email = ?', [req.body.email]);
    if (result.length === 0) {
        res.status(404).json({ message: "Wrong Email Or Password" });
        return next(new ApiError(`Wrong Email Or Password`, 404));
    }
    const passwordMatch = comparePassword(req.body.password, result[0].password);
    if (!passwordMatch) {
        return next(new ApiError(`Wrong Email Or Password`, 404));
    }
    res.status(200).json({ Id: result[0].id });
}
);
module.exports = {
    register,
    login
};