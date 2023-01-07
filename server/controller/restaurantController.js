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

    const sortByValidValues = [
        "index",
        "cost",
        "rating",
        "reviews"
    ]


    if (!sortByValidValues.includes(sortBy)){

        resErrInvalidOption(res,sortBy,"sortBy",sortByValidValues)
        return
    }
    if (!(order==="ASC"||order==="DESC")){
        resErrInvalidOption(res,req.query.order,"order",["asc","desc"])
        return
    }

    RestauRantDB.GetRestaurants(startOffset,limit,sortBy,order==="ASC")
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
