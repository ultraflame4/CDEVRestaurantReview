const {GetQueryParams, GetJsonParams} = require("../validateQuery");
const {RestauRantDB} = require("../database");
const {resInternalErr, resUnauthorised} = require("../errorResponses");
const {IsLoggedIn, FormatTimestamp} = require("../tools");
const {User} = require("../user");

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function CreateUser(req, res) {
    let queryParams = GetJsonParams(req, res, {
        username: {type: "string"}, password: {type: "string"}, email: {type: "string"}
    })
    if (!queryParams) return;

    // Check for existing user
    let user = await RestauRantDB.FindUser(queryParams.email)
    if (user !== null) {
        res.status(200).json({success: false})
        return
    }
    try {
        let result = await RestauRantDB.CreateUser(queryParams.username, queryParams.password, queryParams.email)
        res.json({success: true, data: result})
    } catch (err) {
        resInternalErr(res, {success: false, sqlErrors: err})
    }

}

/**
 * Returns the current logged in user information
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function GetUserInfo(req, res) {
    try {
        let user = await RestauRantDB.FindUserById(req.user.id)

        if (!user) {
            return resInternalErr(res, {success: false, message: "Cannot find user with id " + req.user.id})
        }

        res.status(200).json({
            success: true,
            username: user.username,
            email: user.email,
            date_created: user.date_created,
            user_id: user.id
        })
    } catch (err) {
        resInternalErr(res, {success: false, sqlErrors: err})
    }
}


/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function TestUserLoggedIn(req, res) {
    res.status(200).json({isLoggedIn: IsLoggedIn(req), isAuth: req.isAuthenticated(), user: req.user})
}

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function LoginUser(req, res) {
    // Ensure there is only one session per user. Else destroy the old session
    req.sessionStore.length((err1, length) => console.log(length))
    req.sessionStore.all((err, obj) => {
        if (err) {
            console.log(err)
            return
        }

        // Loop through all sessions and destroy the ones that belong to the same user
        for (let sessionId in obj) {

            if (sessionId === req.session.id) continue //Skip if its the current session

            if (obj[sessionId].passport.user === req.user.id) {
                req.sessionStore.destroy(sessionId, err => err&&console.log(err))
            }
        }

    })
    res.status(200).json({success: IsLoggedIn(req)})
}

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function LogoutUser(req, res) {
    req.logout(err => {
    })
    res.status(200).json({isLoggedIn: IsLoggedIn(req), isAuth: req.isAuthenticated(), user: req.user})
}

/**
 * Gets all reviews by the logged in user
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function GetAllReviews(req, res) {
    let queryParams = GetQueryParams(req, res, {
        start: {default: 0, type: "int", min: 0}, limit: {default: 10, type: "int", min: 0, max: 15}
    })
    if (!queryParams) return

    try {
        let usrReviews = await RestauRantDB.GetUserReviews(req.user.id, queryParams.start, queryParams.limit)
        res.json({
            start: queryParams.start, limit: queryParams.limit, total: usrReviews.length, reviews: usrReviews
        })
    } catch (err) {
        resInternalErr(res, {success: false, sqlErrors: err})
    }

}

/**
 * Updates the user's username
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function UpdateUsername(req, res) {
    let queryParams = GetJsonParams(req, res, {
        newUsername: {type: "string"},
        password: {type: "string"}
    })
    if (!queryParams) return

    try {
        let usr = await RestauRantDB.FindUserById(req.user.id)
        let checkPasswd = await usr.ComparePassword(queryParams.password)
        if (!checkPasswd) {
            return resUnauthorised(res)
        }

        let r = await RestauRantDB.UpdateUsername(req.user.id, queryParams.newUsername)
        res.json({sql: r})
    } catch (err) {
        resInternalErr(res, {success: false, sqlErrors: err})
    }

}

/**
 * Updates the user's Email
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function UpdateEmail(req, res) {
    let queryParams = GetJsonParams(req, res, {
        newEmail: {type: "string"},
        password: {type: "string"}
    })
    if (!queryParams) return

    try {
        let usr = await RestauRantDB.FindUserById(req.user.id)
        let checkPasswd = await usr.ComparePassword(queryParams.password)
        if (!checkPasswd) {
            return resUnauthorised(res)
        }

        let r = await RestauRantDB.UpdateEmail(req.user.id, queryParams.newEmail)
        res.json({sql: r})
    } catch (err) {
        resInternalErr(res, {success: false, sqlErrors: err})
    }

}

/**
 * Updates the user's Password
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function UpdatePassword(req, res) {
    let queryParams = GetJsonParams(req, res, {
        newPassword: {type: "string"},
        password: {type: "string"}
    })
    if (!queryParams) return

    try {
        let usr = await RestauRantDB.FindUserById(req.user.id)
        let checkPasswd = await usr.ComparePassword(queryParams.password)
        if (!checkPasswd) {

            return resUnauthorised(res)
        }

        let newHash = await User.HashUserPassword(queryParams.newPassword, FormatTimestamp(usr.date_created))
        let r = await RestauRantDB.UpdatePassword(req.user.id, newHash)
        res.json({sql: r})
    } catch (err) {
        resInternalErr(res, {success: false, sqlErrors: err})
    }

}
/**
 * Delete the user's account
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function DeleteAccount(req, res) {
    let queryParams = GetJsonParams(req, res, {
        email: {type: "string"},
        password: {type: "string"}
    })
    if (!queryParams) return

    try {
        let usr = await RestauRantDB.FindUserById(req.user.id)
        let checkPasswd = await usr.ComparePassword(queryParams.password)
        if (!checkPasswd || usr.email !== queryParams.email) {

            return resUnauthorised(res)
        }
        let r = await RestauRantDB.DeleteUser(req.user.id)
        req.session.destroy()
        res.json({sql: r})
    } catch (err) {
        resInternalErr(res, {success: false, sqlErrors: err})
    }

}


module.exports = {
    CreateUser,
    TestUserLoggedIn,
    LoginUser,
    LogoutUser,
    GetAllReviews,
    UpdateEmail,
    UpdateUsername,
    UpdatePassword,
    GetUserInfo,
    DeleteAccount
}
