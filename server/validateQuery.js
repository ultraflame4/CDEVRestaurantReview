/**
 * Query Param Type to used to validate queries parameters
 * @export
 * @typedef QueryParameterOption
 * @property {string,undefined} default Default to use value if isRequired is False. If undefined or null, param is required!
 * @property {"int","float","string"} type
 * @property {number,undefined} min Only used when type is int or float. Specifies the range for the number value
 * @property {number,undefined} max Only used when type is int or float. Specifies the range for the number value
 * @property {string[],undefined} enumOptions Specifies set of valid options for the query parameter value.
 */

const {sendErrRes, resErrArgOutOfRange, isNumeric, isInteger, IsWithinRange} = require("./tools");
const {resErrMissingQueryParameter, resErrInvalidType, resErrInvalidOption} = require("./errorResponses");

/**
 * Checks the type of the value of the string (eg. "1")
 * @param value {string}
 * @return {"int","float","string"}
 */
function GetStringValueType(value) {
    if (isInteger(value))
        return "int"
    if (isNumeric(value))
        return "float"

    return "string"
}


/**
 * An easy way to validate types and get query. Note that this will also attempt to parse and convert to the different types
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 * @param queryParams {Record<string,QueryParameterOption>}
 * @return {Record<string,string>,null} A dictionary / record / object with the keys as names and values as values. Returns null on failure
 */
function GetQueryParams(req, res, queryParams) {
    let validated = {}
    for (let paramName in queryParams) {
        let paramValidateOption = queryParams[paramName]

        let queryVal = req.query[paramName] ?? paramValidateOption.default
        console.log(queryVal,paramName)
        // Check param is in query
        if (queryVal === undefined) {
            resErrMissingQueryParameter(res, paramName)
            return null
        }
        // Force convert string here because the code below was designed for checking strings.
        queryVal=queryVal+""

        let queryValType = GetStringValueType(queryVal);

        if (queryValType!==paramValidateOption.type){
            resErrInvalidType(res,queryVal,queryValType,paramName,paramValidateOption.type)
            return null
        }

        // Check range
        if ((queryValType==="int"||queryValType==="float")) {
            if (!IsWithinRange(queryVal,paramValidateOption.min,paramValidateOption.max)){
                resErrArgOutOfRange(res,queryVal,paramName,paramValidateOption.min,paramValidateOption.max)
                return null
            }
        }

        //Check if within valid options
        if (paramValidateOption.enumOptions){
            if (!paramValidateOption.enumOptions.includes(queryVal)){
                resErrInvalidOption(res,queryVal,paramName,paramValidateOption.enumOptions)
                return null
            }
        }



        switch (queryValType){
            case "int":
            case "float":
                validated[paramName] = (+queryVal)
                break;
            case "string":
                validated[paramName] = queryVal
                break;
        }


    }
    return validated
}




module.exports = {
    GetQueryParams
}
