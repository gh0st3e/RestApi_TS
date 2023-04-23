import UserModel, {User} from "../model/user"
import {logger} from "../main"
export const RetrieveAll = async () => {
    logger.info("RetrieveAll started")
    const users = await UserModel.RetrieveAll()
    logger.info(users)
    logger.info("RetrieveAll ended")

    return users
}

export const RetrieveByEmail = async (email: string) => {
    logger.info("RetrieveByEmail started")
    logger.info(email)
    const user = await UserModel.RetrieveByEmail(email)
    logger.info(user)
    logger.info("RetrieveByEmail ended")

    return user
}

export const Insert = async (user: User) => {
    logger.info("Insert User Started")
    if (!user.email) {
        logger.warn("Empty Email")
        return null
    }
    logger.info(user)
    const inserted = await UserModel.Insert(user)
    logger.info(inserted)
    logger.info("Insert User Ended")

    return inserted
}

export const Update = async (user: User) => {
    logger.info("Update User Started")
    logger.info(user)
    if (!(user.email)) {
        logger.warn("Empty User")
        return null
    }
    const updated = await UserModel.Update(user)
    logger.info("Update User Ended")

    return updated[0]
}

export const Delete = async (email: string)=>{
    logger.info("Delete User Started")
    logger.info(email)
    const deleted = await UserModel.Delete(email)
    logger.info("Update User Ended")
    logger.info(deleted)

    return deleted
}

export const UserService = {
    RetrieveAll,
    RetrieveByEmail,
    Insert,
    Update,
    Delete,

}