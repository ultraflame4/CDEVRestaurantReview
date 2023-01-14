const {RestauRantDB} = require("../database");
const {
    resErrInvalidOption,
    resInternalErr,
    GetSelectRangeQueryParams,
    resErrInvalidType,
    sendErrRes
} = require("../errorResponses");
const {GetQueryParams} = require("../validateQuery");


/**
 * Gets list of restaurant from the database.
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getRestaurants(req, res) {
    let queryParams = GetQueryParams(req, res, {
        start: {default: 0, type: "int", min: 0},
        limit: {default: 20, type: "int", min: 0},
        order: {default: "asc", type: "string", enumOptions: ["asc", "desc"]},
        sortBy: {default: "index", type: "string", enumOptions: ["index", "cost", "rating", "reviews"]},
    })
    if (!queryParams) return;

    RestauRantDB.GetRestaurants(queryParams.start, queryParams.limit, queryParams.sortBy, queryParams.order === "asc")
        .then(value => {
            res.json({
                start: queryParams.start,
                limit: queryParams.limit,
                total: value.length,
                results: value
            })
        })
        .catch(reason => {
            resInternalErr(res, {sqlError: reason})
        })
}

/**
 * Gets list of restaurant from the database.
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getNearestRestaurants(req, res) {
    let queryParams = GetQueryParams(req, res, {
        start: {default: 0, type: "int", min: 0},
        limit: {default: 20, type: "int", min: 0},
        x: {type: "float"},
        y: {type: "float"}
    })
    if (!queryParams) return;
    //todo
    RestauRantDB.GetRestaurantSortDistance(
        {x: queryParams.x, y: queryParams.y},
        queryParams.start,
        queryParams.limit
    ).then(value => {
        res.json({
            start: queryParams.start,
            limit: queryParams.limit,
            refCoords: {x: queryParams.x, y: queryParams.y},
            total: value.length,
            results: value
        })
    }).catch(reason => {
        resInternalErr(res, {sqlError: reason})
    })
}

/**
 * Gets list of tag for the restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getRestaurantsTags(req, res) {
    let queryParams = GetQueryParams(req, res, {
        restaurantId: {type: "int", min: 1},
    })
    if (!queryParams) return;

    RestauRantDB.GetTagsForRestaurant(
        queryParams.restaurantId
    ).then(value => {
        res.json({
            restaurantId:queryParams.restaurantId,
            total: value.length,
            results: value
        })
    }).catch(reason => {
        resInternalErr(res, {sqlError: reason})
    })
}

/**
 * Gets list of photos for the restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getRestaurantsPhotos(req, res) {
    let queryParams = GetQueryParams(req, res, {
        restaurantId: {type: "int", min: 1},
    })
    if (!queryParams) return;

    RestauRantDB.GetPhotosForRestaurant(
        queryParams.restaurantId
    ).then(value => {
        res.json({
            restaurantId:queryParams.restaurantId,
            total: value.length,
            results: value
        })
    }).catch(reason => {
        resInternalErr(res, {sqlError: reason})
    })
}


module.exports = {
    getRestaurants,
    getNearestRestaurants,
    getRestaurantsTags,
    getRestaurantsPhotos
}
