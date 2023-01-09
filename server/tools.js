const {resErrArgOutOfRange} = require("./errorResponses");


/**
 * Extracts the start and limit offset parameters (query) from a get request needed for use in database query
 *
 * **Warning: This will send a response if the request query parameters are invalid!**
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 * @param defaultLimit {number}
 * @param defaultOffset {number}
 * @return {{startOffset:number,limit:number}| null} Returns the query parameters extracted. If invalid, returns null.
 */
function GetSelectRangeQueryParams(req, res, defaultLimit=20, defaultOffset=0){
    let limit = parseInt(req.query.limit ?? `${20}`)
    let startOffset = parseInt(req.query.start ?? `${0}`)
    if (limit < 1){
        resErrArgOutOfRange(res,limit,"limit",1)
        return null
    }
    if (startOffset < 0){
        resErrArgOutOfRange(res,startOffset,"startOffset",0)
        return null
    }
    return {startOffset,limit}
}

/**
 * Checks if the value is within a set range
 * @param value {number}
 * @param min {number,null} The lowest inclusive number for the range. Leave null for infinite / no lower bound
 * @param max {number,null} The upper inclusive number for the range. Leave null for infinite / no upper bound
 */
function IsWithinRange(value,min=null,max=null){
    if (min){
        if (value<min){
            return false
        }
    }
    if (max){
        if (value>max){
            return false
        }
    }
    return true
}

/**
 *
 * @param value {string}
 * @return {boolean}
 */
function isNumeric(value){
    return !isNaN(+value)
}
/**
 *
 * @param value {string}
 * @return {boolean}
 */
function isInteger(value){
    return Number.isInteger(+value)
}

module.exports = {
    resErrArgOutOfRange,
    GetSelectRangeQueryParams,


    IsWithinRange,
    isNumeric,
    isInteger


}