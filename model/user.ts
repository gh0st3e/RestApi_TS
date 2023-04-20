import sequelize from "./db"
import fs from "fs"

import {Model, DataTypes} from "sequelize";

const userPdf = "assets/pdf/userPDF.pdf"
class User extends Model {
    public email!: string;
    public firstName!: string;
    public lastName!: string;
    public image!: string;
    public pdf!: any;

}

async function RetrieveAll() {
    return User.findAll({raw: true})
}

async function RetrieveById(email: string) {
    return User.findOne({where: {email: email}, raw: true})
}

async function Insert(user: User) {
    return User.create({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        pdf: null
    }, {raw: true})

}

async function Update(user: User) {
    return User.update(
        {
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image
        },
        {where: {email: user.email}}
    )

}

async function Delete(email: string) {
    return User.destroy({where: {email: email}})
}

async function SavePDF(email: string) {

    const data = await fs.promises.readFile(userPdf);

    const [count] = await User.update(
        {
            pdf: Buffer.from(data),
        },
        {
            where: {email},
        }
    );
    return count > 0;
}

User.init(
    {
        email: {
            type: DataTypes.TEXT,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.TEXT
        },
        lastName: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.TEXT
        },
        pdf: {
            type: DataTypes.BLOB
        }
    }, {
        tableName: '\"users\"',
        sequelize,
        createdAt: false,
        updatedAt: false,
    }
)

export default {
    RetrieveById,
    RetrieveAll,
    Insert,
    Update,
    Delete,
    SavePDF,
    User
}

export {User}
