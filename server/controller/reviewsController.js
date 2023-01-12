const {resInternalErr, resUnauthorised, resNotFound} = require("../errorResponses");
const {RestauRantDB} = require("../database");
const {GetQueryParams, GetJsonParams} = require("../validateQuery");

/**
 * Get list of reviews for a specific restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function getReviews(req, res) {
    let queryParams = GetQueryParams(req,res,{
        start:{default:0,type:"int",min:0},
        limit:{default:10,type:"int",min:0},
        order:{default:"asc",type:"string",enumOptions:["asc","desc"]},
        sortBy:{default:"likes",type:"string",enumOptions:["likes","edit_date"]},
        restaurant_id:{type:"int",min:1},
    })

    if (!queryParams)return


    RestauRantDB.GetReviewForRestaurant(queryParams.restaurant_id, queryParams.start, queryParams.limit, queryParams.sortBy, queryParams.order)
        .then(value => [
            res.json({
                start: queryParams.start,
                limit: queryParams.limit,
                total: value.length,
                results: value
            })
        ])
        .catch(reason => {
            resInternalErr(res, {sqlError: reason})
        })
}

/**
 * create a review for a restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function createReview(req, res){
    let queryParams = GetJsonParams(req,res,{
        restaurant_id:{type:"int",min:1},
        content:{type:"string"},
        rating:{type:"int",min:1,max:10}
    })
    if (!queryParams)return

    if (req.isAuthenticated()){
        RestauRantDB.CreateReview(req.user.id,queryParams.restaurant_id,queryParams.content,queryParams.rating).then(value => {
            res.json({
                success:true,
                sqlData:value
            })
        }).catch(reason => {
            resInternalErr(res,{sql:reason})
        })
        return;
    }
    resUnauthorised(res)
}
/**
 * create a review for a restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
function updateReview(req, res){
    let queryParams = GetJsonParams(req,res,{
        review_id:{type:"int",min:1},
        content:{type:"string"},
        rating:{type:"int",min:1,max:10}
    })
    if (!queryParams)return


    if (req.isAuthenticated()){
        RestauRantDB.GetReview(queryParams.review_id).then(value => {
            if (value.length<1){
                resNotFound(res,`Error could not find review with id: ${queryParams.review_id}`,{bad:queryParams.review_id})
                return
            }

            let review = value[0]
            if (review.author_id !== req.user.id){
                resUnauthorised(res, {message:"You are not author of this review!"})
                return
            }

            RestauRantDB.UpdateReview(review.id,queryParams.content,queryParams.rating).then(value1 => {
                res.json({
                    success:true,
                    sqlData:value
                })
            }).catch(reason => {
                resInternalErr(res,{sql:reason})
            })
        })
        return
    }
    resUnauthorised(res)

}
function deleteReview(req, res){

}

module.exports = {
    getReviews,
    deleteReview,
    updateReview,
    createReview
}
