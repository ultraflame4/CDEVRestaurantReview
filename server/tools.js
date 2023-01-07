/**
 * Formats and sends back a response for an error
 * @param res {import("express").Response}
 * @param errCode {number}
 * @param errName {string}
 * @param message {string}
 * @param addData {Object}
 */
function sendErrRes(res, errCode, errName, message = "", addData = null) {
    res.status(errCode).json(Object.assign(
        {
            code: errCode,
            error: errName,
            message: message
        },
        addData
    ))
}

/**
 * @param res {import("express").Response} The express response to use
 * @param badOption {string} The bad option (value) that caused the error
 * @param parameterName {string} The parameter/query name that the option was passed to.
 * @param validOptions {string[]} The valid options for the parameter/query
 */
function resErrInvalidOption(res, badOption, parameterName, validOptions) {
    sendErrRes(res,
        400,
        "InvalidOption",
        `Invalid option for parameter ${parameterName}. Valid options: ${validOptions}`,
        {validOptions: validOptions}
    )
}

/**
 * Send this error whenever you get an error caused by a query or request but is the fault of the server.
 * This error, should never be sent out when everything is working as intended
 * @param res {import("express").Response} The express response to use
 * @param addData {Object} additional data to send/log to the sender
 */
function resInternalErr(res,addData=null) {
    sendErrRes(res,500,"Internal Server Error","An Unknown error has occurred in the server. This should not be happening in production.",addData)
}


module.exports = {
    resErrInvalidOption,
    resInternalErr
}
