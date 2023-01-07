const {RestauRantDB} = require("../database");
const {resErrInvalidOption, resInternalErr} = require("../tools");


/**
 * Gets list of restaurant from the database.
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getRestaurants(req,res) {
    let limit = parseInt(req.query.limit ?? "20")
    let startOffset = parseInt(req.query.start ?? "0")
    let sortBy = req.query.sortBy ?? "index"
    let order = (req.query.order ?? "ASC").toUpperCase()

    let sortByMappings = {
        "index":"id",
        "cost":"cost_rating",
        "rating":"avg_rating",
        "reviews":"reviews_count"
    }

    sortBy = sortByMappings[sortBy]
    if (!sortBy){

        resErrInvalidOption(res,req.query.sortBy,"sortBy",Object.keys(sortByMappings))
        return
    }
    if (!(order==="ASC"||order==="DESC")){
        resErrInvalidOption(res,req.query.order,"order",["asc","desc"])
        return
    }

    RestauRantDB.GetRestaurants(startOffset,limit,sortBy,order)
        .then(value => {
            res.json({
                start: startOffset,
                limit: limit,
                total: value.length,
                results:value
            })
        })
        .catch(reason => {
            resInternalErr(res,{sqlError:reason})
        })
}




module.exports = {
    getRestaurants
}
