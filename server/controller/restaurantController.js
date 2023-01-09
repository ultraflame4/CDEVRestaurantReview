const {RestauRantDB} = require("../database");
const {resErrInvalidOption, resInternalErr, GetSelectRangeQueryParams, resErrInvalidType, sendErrRes} = require("../errorResponses");
const {GetQueryParams} = require("../validateQuery");


/**
 * Gets list of restaurant from the database.
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getRestaurants(req,res) {
    let queryParams = GetQueryParams(req,res,{
        start:{default:0,type:"int",min:0},
        limit:{default:20,type:"int",min:0},
        order:{default:"asc",type:"string",enumOptions:["asc","desc"]},
        sortBy:{default:"index",type:"string",enumOptions:["index","cost","rating","reviews"]},
    })
    if (!queryParams) return;

    RestauRantDB.GetRestaurants(queryParams.start,queryParams.limit,queryParams.sortBy,queryParams.order==="asc")
        .then(value => {
            res.json({
                data:queryParams,
                start: queryParams.start,
                limit: queryParams.limit,
                total: value.length,
                results:value
            })
        })
        .catch(reason => {
            resInternalErr(res,{sqlError:reason})
        })
}

/**
 * Gets list of restaurant from the database.
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getNearestRestaurants(req,res) {
    let queryParams = GetQueryParams(req,res,{
        start:{default:0,type:"int",min:0},
        limit:{default:20,type:"int",min:0},
        x:{type:"float"},
        y:{type:"float"}
    })
    if (!queryParams) return;

    RestauRantDB.GetRestaurantSortDistance(
        {x:queryParams.x,y:queryParams.y},
        queryParams.start,
        queryParams.limit
    )
}


module.exports = {
    getRestaurants,
    getNearestRestaurants
}
