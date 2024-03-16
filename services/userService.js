const dbConnection = require("../config/database");
const asyncHandelr = require("express-async-handler");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

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

const getUser = asyncHandelr(async (req, res, next) => {
    const [result] = await (await dbConnection).query(`SELECT fullName,email FROM users WHERE id = ?`, [req.params.id]);
    if (result.length === 0) {
        res.status(404).json({ message: "No users Found" });
        return next(new ApiError(`No users Found`, 404));
    }
    res.status(200).json(result);
}
);

const updateUser = asyncHandelr(async (req, res, next) => {
    const { fullName, email } = req.body;
    const [result] = await (await dbConnection).query(`UPDATE users SET fullName = ?, email = ? WHERE id=?`, [fullName, email, req.params.id]);
    res.status(200).json({ message: "User Updated" });
}
);

const changeEmail = asyncHandelr(async (req, res, next) => {
    const email = req.body.email;
    const [result] = await (await dbConnection).query(`UPDATE users SET email=? WHERE id=?`, [email, req.params.id]);
    res.status(200).json({ message: "Email Updated" });
});

const changePassword = asyncHandelr(async (req, res, next) => {
    const hashedPassword = await hashPassword(req.body.password);
    const [result] = await (await dbConnection).query(`UPDATE users SET password=? WHERE id=?`, [hashedPassword, req.params.id]);
    res.status(200).json({ message: "Password Updated" });
});

const forgotPassword = asyncHandelr(async (req, res, next) => {
    const email = req.body.email;
    const [result] = await (await dbConnection).query(`SELECT * FROM users WHERE email=?`, [email]);
    if (result.length === 0) {
        res.status(404).json({ message: "Wrong Email" });
        return next(new ApiError(`Wrong Email`, 404));
    }
    const ResetPasswordCode = Math.floor(Math.random() * 9000) + 1000;
    sendEmail(email, "Reset Password", ResetPasswordCode);
    res.status(200).json({ ResetPasswordCode: ResetPasswordCode });
});

module.exports = {
    getUser,
    updateUser,
    changeEmail,
    changePassword,
    forgotPassword
}; 