import {Sequelize} from 'sequelize'
import {Dialect} from 'sequelize/types';
import {DB_CONFIG} from '../config/db.config'

const dialect: Dialect = 'postgres'

const sequelize = new Sequelize(
    DB_CONFIG.DB,
    DB_CONFIG.USER,
    DB_CONFIG.PASSWORD,
    {
        host: DB_CONFIG.HOST,
        dialect: dialect
    }
);
export default sequelize