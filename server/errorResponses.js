
/**
 * @param res {import("express").Response} The express response to use
 * @param parameterName {string} The parameter/query name that the option was passed to.
 */
function resErrMissingQueryParameter(res, parameterName) {
    sendErrRes(
        res,
        400,
        "MissingQueryParameter",
        `Missing Query Parameter '${parameterName}' for this method!`
        )
}

/**
 * @param res {import("express").Response} The express response to use
 * @param badValue {string} The bad value passed in
 * @param badType {string} The bad type
 * @param parameterName {string} The parameter/query name that the option was passed to.
 * @param expectedType {string}
 */
function resErrInvalidType(res, badValue,badType, parameterName, expectedType) {
    sendErrRes(res,
        400,
        "InvalidParameterType",
        `Invalid Parameter Type for ${parameterName}. Expected Type: ${expectedType}. Got Type: ${badType}. Bad value: ${badValue}`,
        {expectedType:expectedType}
        )
}

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
 * @param res {import("express").Response} The express response to use
 * @param badValue {number} The value that is out of range.
 * @param parameterName {string} The parameter/query name that the option was passed to.
 * @param min {number|null} [Optional] The inclusive min value for the range (null if infinitely small, no lower bound)
 * @param max {number|null} [Optional] The inclusive max value for the range (null if infinitely big, no upper bound)
 */
function resErrArgOutOfRange(res, badValue, parameterName, min=null,max=null) {
    sendErrRes(res,
        400,
        "ArgumentOutOfRange",
        `Argument '${badValue}' for parameter ${parameterName} is out of range! Range: ${min??'infinite'} - ${max??'infinite'}`,
        {
            badValue:badValue,
            min:min,
            max:max,
        }
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

module.exports={
    resErrInvalidOption,
    resErrArgOutOfRange,
    resErrInvalidType,resInternalErr,
    resErrMissingQueryParameter,

}
