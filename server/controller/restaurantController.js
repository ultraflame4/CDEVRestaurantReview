const {RestauRantDB} = require("../database");


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
        res.status(400).send(`Invalid option '${req.query.sortBy}' for parameter sortBy. Valid options: [${Object.keys(sortByMappings)}]`)
        return
    }
    if (!(order==="ASC"||order==="DESC")){
        res.status(400).send(`Invalid option '${req.query.order}' for parameter sortBy. Valid options: 'ASC','DESC'`)
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
            res.status(200).json({
                code: 500,
                error: reason
            })
        })
}




module.exports = {
    getRestaurants
}
