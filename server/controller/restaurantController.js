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
async function getRestaurants(req, res) {

    let queryParams = GetQueryParams(req, res, {
        start: {default: 0, type: "int", min: 0},
        limit: {default: 10, type: "int", min: 0, max: 20},
        order: {default: "asc", type: "string", enumOptions: ["asc", "desc"]},
        sortBy: {default: "index", type: "string", enumOptions: ["index", "cost", "rating", "reviews", "distance"]},
        x: {type: "float"},
        y: {type: "float"}
    })
    if (!queryParams) return;

    try {
        let value = await RestauRantDB.GetRestaurants(
            {x: queryParams.x, y: queryParams.y},
            queryParams.start,
            queryParams.limit,
            queryParams.sortBy,
            queryParams.order === "asc")
        res.json({
            start: queryParams.start,
            limit: queryParams.limit,
            total: value.length,
            results: value
        })
    } catch (err) {
        resInternalErr(res, {sqlError: err})
    }

}

/**
 * Gets a restaurant by a specific id from the database
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function getRestaurantsById(req, res) {

    let queryParams = GetQueryParams(req, res, {
        restaurantId: {type: "int", min: 1},
        x: {type: "float"},
        y: {type: "float"}
    })
    if (!queryParams) return;

    try {
        let value = await RestauRantDB.GetRestaurantById({x: queryParams.x, y: queryParams.y}, queryParams.restaurantId)
        res.json({
            total: value.length,
            results: value
        })
    } catch (err) {
        resInternalErr(res, {sqlError: err})
    }

}


/**
 * Gets list of tag for the restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function getRestaurantsTags(req, res) {
    let queryParams = GetQueryParams(req, res, {
        restaurantId: {
            type: "int",
            min: 1
        },
    })
    if (!queryParams) return;

    try {
        let value = await RestauRantDB.GetTagsForRestaurant(queryParams.restaurantId)
        res.json({
            restaurantId: queryParams.restaurantId,
            total: value.length,
            results: value
        })
    } catch (err) {
        resInternalErr(res, {sqlError: err})
    }
}

/**
 * Gets list of photos for the restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function getRestaurantsPhotos(req, res) {
    let queryParams = GetQueryParams(req, res, {
        restaurantId: {
            type: "int",
            min: 1
        },
    })
    if (!queryParams) return;

    try {
        let value = await RestauRantDB.GetPhotosForRestaurant(queryParams.restaurantId)
        res.json({
            restaurantId: queryParams.restaurantId,
            total: value.length,
            results: value
        })
    } catch (err) {
        resInternalErr(res, {sqlError: err})
    }
}


module.exports = {
    getRestaurants,
    getRestaurantsTags,
    getRestaurantsPhotos,
    getRestaurantsById
}
