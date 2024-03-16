const asyncHandelr = require("express-async-handler");
const fs = require('fs');
const dbConnection = require("../config/database");
const ApiError = require("../utils/apiError");
const { PythonShell } = require("python-shell");

const getAllData = asyncHandelr(async (req, res, next) => {
    const [result] = await (await dbConnection).query(`SELECT * FROM data`);
    if (result.length == 0) {
        res.status(404).json({ message: "Not Found Data" });
        return next(new ApiError(`Not Found Data`, 404));
    }
    res.status(200).json(result);
});

const getDataById = asyncHandelr(async (req, res, next) => {
    const [result] = await (await dbConnection).query(`SELECT * FROM data WHERE userId=?`, [req.params.id]);
    if (result.length == 0) {
        res.status(404).json({ message: "Not Found Data" });
        return next(new ApiError(`Not Found Data`, 404));
    }
    res.status(200).json(result);
});

const storeData = asyncHandelr(async (req, res, next) => {
    fs.readFile('DATA.TXT', 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const lines = data.trim().split('\n');
        const twoDArray = lines.map(line => line.split(',').map(Number));
        PythonShell.run('main.py', options).then(async messages => {
            let Result = parseFloat(messages[0].slice(1, -1));
            console.log(Result)
            for (let i = 0; i < twoDArray.length; i++) {
                const [result] = await (await dbConnection).query(`INSERT INTO data values(?,?,?,?,?)`, [twoDArray[i][1], twoDArray[i][2], twoDArray[i][3], 12, Result]);
            }
        });
    });
    res.status(200).json({ message: "Done" });
});

const sendData = asyncHandelr(async (req, res, next) => {
    const id = req.params.id;
    const { age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal } = req.body;
    // let options = {
    //     mode: 'text',
    //     scriptPath: '.',
    //     args: [age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]
    // };
    // PythonShell.run('main.py', options).then(async messages => {
    //     const target = parseFloat(messages[0].slice(1, -1));
    const target = Math.round(Math.random())
    const [result] = await (await dbConnection).query(`INSERT INTO data values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [id, age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal, target]);
    res.status(200).json({ Target: target });
    // });
});

const deleteAllData = asyncHandelr(async (req, res, next) => {
    const [result] = await (await dbConnection).query(`DELETE FROM data`);
    if (result.length == 0) {
        res.status(404).json({ message: "Not Found Data" });
        return next(new ApiError(`Not Found Data`, 404));
    }
    res.status(200).json(result);
});

const deleteDataById = asyncHandelr(async (req, res, next) => {
    const [result] = await (await dbConnection).query(`DELETE FROM data WHERE userId=?`, [req.params.id]);
    if (result.length == 0) {
        res.status(404).json({ message: "Not Found Data" });
        return next(new ApiError(`Not Found Data`, 404));
    }
    res.status(200).json(result);
});

module.exports = {
    getAllData,
    getDataById,
    sendData,
    deleteAllData,
    deleteDataById
}