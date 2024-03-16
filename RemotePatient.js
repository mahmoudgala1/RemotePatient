const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("./middlewares/logger");
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

dotenv.config({ path: "config.env" });
process.env.TZ = process.env.TIMEZONE;
const RemotePatient = express();

RemotePatient.use(cors());
RemotePatient.use(express.json());
RemotePatient.use(express.urlencoded({ extended: false }));
RemotePatient.use(logger);
RemotePatient.use("/api", require("./routes/authRoute"));
RemotePatient.use("/api", require("./routes/dataRoute"));
RemotePatient.use("/api", require("./routes/userRoute"));

RemotePatient.delete("/", async (req, res) => {
    const [result] = await (await dbConnection).query(`delete from data where 1`);
    res.status(200).json("deleted");
});

RemotePatient.all("*", (req, res, next) => {
    next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

RemotePatient.use(globalError);
const PORT = process.env.PORT;
const server = RemotePatient.listen(PORT, () => {
    console.log(`Server start in port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.log(`unhandledRejection Errors ${err.name} | ${err.message}`);
    server.close(() => {
        console.log("Shutting down......");
        process.exit(1);
    });
});


