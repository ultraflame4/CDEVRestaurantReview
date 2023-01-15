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
        res.status(400).json({success: false})
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
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function TestUserLoggedIn(req, res) {
    res.status(200).json({isLoggedIn: IsLoggedIn(req), isAuth: req.isAuthenticated(), userid: req.user?.id})
}

/**
 *
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function LoginUser(req, res) {
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
    res.redirect("/api/user/test")
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
        newUsername: {type: "string"}
    })
    if (!queryParams) return

    try {
        let r = await RestauRantDB.UpdateUsername(req.user.id, queryParams.newUsername)
        res.json({sql:r})
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
        newEmail: {type: "string"}
    })
    if (!queryParams) return

    try {
        let r = await RestauRantDB.UpdateEmail(req.user.id, queryParams.newEmail)
        res.json({sql:r})
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
        newPassword: {type: "string"}
    })
    if (!queryParams) return

    try {
        let usr = await RestauRantDB.FindUserById(req.user.id)
        let newHash = await User.HashUserPassword(queryParams.newPassword,FormatTimestamp(usr.date_created))
        let r = await RestauRantDB.UpdatePassword(req.user.id, newHash)
        res.json({sql:r})
    } catch (err) {
        resInternalErr(res, {success: false, sqlErrors: err})
    }

}


module.exports = {
    CreateUser, TestUserLoggedIn, LoginUser, LogoutUser, GetAllReviews, UpdateEmail, UpdateUsername, UpdatePassword
}
