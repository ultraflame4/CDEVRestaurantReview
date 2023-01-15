const {
   resInternalErr, resUnauthorised, resNotFound
} = require("../errorResponses");
const {RestauRantDB} = require("../database");
const {
   GetQueryParams, GetJsonParams
} = require("../validateQuery");

/**
 * Get list of reviews for a specific restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function getReviews(req, res) {
   let queryParams = GetQueryParams(req, res, {
      start: {default: 0, type: "int", min: 0},
      limit: {default: 5, type: "int", min: 0, max: 15},
      order: {default: "asc", type: "string", enumOptions: ["asc", "desc"]},
      sortBy: {default: "likes", type: "string", enumOptions: ["likes", "edit_date"]},
      restaurant_id: {type: "int", min: 1},
   })

   if (!queryParams) return
   try {
      let value = await RestauRantDB.GetReviewForRestaurant(queryParams.restaurant_id, queryParams.start, queryParams.limit, queryParams.sortBy, queryParams.order)
      res.json({start: queryParams.start, limit: queryParams.limit, total: value.length, results: value})
   } catch (err) {
      resInternalErr(res, {sqlError: err})
   }

}

/**
 * create a review for a restaurant
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function createReview(req, res) {
   let queryParams = GetJsonParams(req, res, {
      restaurant_id: {
         type: "int", min: 1
      }, content: {type: "string"}, rating: {
         type: "int", min: 1, max: 10
      }
   })
   if (!queryParams) return

   try {
      let value = RestauRantDB.CreateReview(req.user.id, queryParams.restaurant_id, queryParams.content, queryParams.rating)
      res.json({
         success: true, sqlData: value
      })
   } catch (err) {
      resInternalErr(res, {sql: err})
   }

}

/**
 * updates a review
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function updateReview(req, res) {
   let queryParams = GetJsonParams(req, res, {
      review_id: {
         type: "int", min: 1
      }, content: {type: "string"}, rating: {
         type: "int", min: 1, max: 10
      }
   })
   if (!queryParams) return


   try {
      let value = await RestauRantDB.GetReview(queryParams.review_id)

      if (value.length < 1) {
         resNotFound(res, `Error could not find review with id: ${queryParams.review_id}`, {bad: queryParams.review_id})
         return
      }
      let review = value[0]
      if (review.author_id !== req.user.id) {
         resUnauthorised(res, {message: "You are not author of this review!"})
         return
      }


      let val2 = await RestauRantDB.UpdateReview(review.id, queryParams.content, queryParams.rating)
      res.json({
         success: true, sqlData: val2
      })

   } catch (err) {
      resInternalErr(res, {sql: err})
   }

}

/**
 * deletes a review
 * @param req {import("express").Request}
 * @param res {import("express").Response}
 */
async function deleteReview(req, res) {
   let queryParams = GetJsonParams(req, res, {
      review_id: {
         type: "int", min: 1
      }
   })
   if (!queryParams) return

   try{
      let reviews = await RestauRantDB.GetReview(queryParams.review_id)

      if (reviews.length < 1) {
         resNotFound(res, `Error could not find review with id: ${queryParams.review_id}`, {bad: queryParams.review_id})
         return
      }

      let review = reviews[0]
      if (review.author_id !== req.user.id) {
         resUnauthorised(res, {message: "You are not author of this review!"})
         return
      }

      let value = await RestauRantDB.DeleteReview(review.id)
      res.json({
         success: true, sqlData: value
      })
   }
   catch (err) {
      resInternalErr(res, {sql: err})
   }

}


module.exports = {
   getReviews, deleteReview, updateReview, createReview
}
