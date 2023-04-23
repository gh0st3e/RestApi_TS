import {userRouter} from "./controller/user";
import {authRouter} from "./controller/auth"
import {pdfRouter} from "./controller/pdf";
import sequelize from "./model/db"

import express from "express";
import bodyParser from "body-parser";
import log4js from "log4js";


const app: express.Application = express();
app.use(bodyParser.json())

app.use(userRouter)
app.use(authRouter)
app.use(pdfRouter)

log4js.configure('./log4js.json');
const logger = log4js.getLogger()

const port = 8000

sequelize
    .authenticate()
    .then(() => {
        logger.info('Connection has been established successfully.');
        app.listen(port, () => {
            logger.info(`Server is running on port: ${port}`);
        });
    })
    .catch((err) => {
        logger.error('Unable to connect to the database:', err);
    });

app.get("/", (req, res) => {
    res.send("It works")
})

export {app,logger}