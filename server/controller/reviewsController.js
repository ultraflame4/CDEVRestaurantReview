const {resErrArgOutOfRange, resErrInvalidOption, resInternalErr} = require("../tools");
const {RestauRantDB} = require("../database");

/**
 * Get list of reviews for a specific restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getReviews(req, res) {
    let limit = parseInt(req.query.limit ?? "20")
    let startOffset = parseInt(req.query.start ?? "0")
    let sortBy = req.query.sortBy ?? "like"
    let order = (req.query.order ?? "ASC").toUpperCase()
    let restaurantId = parseInt(req.query.id ?? "-1")

    if (restaurantId < 1) {
        resErrArgOutOfRange(res, restaurantId, "id", 1)
        return;
    }

    const sortByValidValues = [
        "like",
        "edit_date"
    ]


    if (!sortByValidValues.includes(sortBy)) {
        resErrInvalidOption(res, sortBy, "sortBy", sortByValidValues)
        return
    }
    if (!(order === "ASC" || order === "DESC")) {
        resErrInvalidOption(res, req.query.order, "order", ["asc", "desc"])
        return
    }


    RestauRantDB.GetReviewForRestaurant(restaurantId, startOffset, limit, sortBy, order)
        .then(value => [
            res.json({
                start: startOffset,
                limit: limit,
                total: value.length,
                results: value
            })
        ])
        .catch(reason => {
            resInternalErr(res, {sqlError: reason})
        })
}


module.exports = {
    getReviews
}
