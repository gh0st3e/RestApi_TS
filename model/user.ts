import sequelize from "./db"

import {Model, DataTypes} from "sequelize";

class User extends Model {
    public email!: string;
    public firstName!: string;
    public lastName!: string;
    public image!: string;
    public pdf!: Buffer;

}

// Get all users from db.
async function RetrieveAll() {
    return User.findAll({raw: true})
}

// Get user by email from db.
async function RetrieveByEmail(email: string) {
    return User.findOne({where: {email: email}, raw: true})
}

// Insert user to db.
async function Insert(user: User) {
    return User.create({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        pdf: null
    }, {raw: true})

}

// Update user in db.
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

// Delete user from db.
async function Delete(email: string) {
    return User.destroy({where: {email: email}})
}

// Update user pdf-field in db.
async function UpdateUserPDF(email: string, data: Buffer) {
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
        tableName: 'users',
        sequelize,
        createdAt: false,
        updatedAt: false,
    }
)

export default {
    RetrieveByEmail,
    RetrieveAll,
    Insert,
    Update,
    Delete,
    UpdateUserPDF,
    User
}

export {User}
