const {RestauRantDB} = require("../database");
const {resErrInvalidOption, resInternalErr, GetSelectRangeQueryParams, resErrInvalidType, sendErrRes} = require("../tools");
const {GetQueryParams} = require("../validateQuery");


/**
 * Gets list of restaurant from the database.
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getRestaurants(req,res) {
    let queryParams = GetQueryParams(req,res,{
        start:{default:0,type:"int"},
        limit:{default:20,type:"int"},
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
    let queryRange = GetSelectRangeQueryParams(req,res)
    if (!queryRange) return

    let x_longtitude;
    let y_latititude;
    try {
        x_longtitude = parseFloat(req.query.x)
        y_latititude = parseFloat(req.query.y)
    }
    catch (e){
        sendErrRes(res,400,"InvalidParameterTypeError","Invalid Parameter Type for x or y. Expected: float")
        return
    }

    RestauRantDB.GetRestaurantSortDistance(
        {x:x_longtitude,y:y_latititude},
        queryRange.startOffset,
        queryRange.limit
    )
}


module.exports = {
    getRestaurants,
    getNearestRestaurants
}
