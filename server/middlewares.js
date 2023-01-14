const passport = require("passport");
const {resUnauthorised} = require("./errorResponses");
const hash = require("object-hash")
const LRU = require("lru-cache")



/**
 *
 * @callback ExpressMiddleware
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */


/**
 *
 * @return {ExpressMiddleware}
 */
function authenticated() {

   return (req, res, next) => {
      if (req.isAuthenticated()) {
         next()
         return
      }
      resUnauthorised(res)
   }
}

/**
 * @param duration {number} The duration how long each data is cached in seconds [default: 200s]
 * @param maxItems {number} The maximum number of items in the cache [default: 50s]
 * @return {ExpressMiddleware}
 */
function cached(duration=200,maxItems=50) {
   const lruCache = new LRU({
      max:maxItems,
      ttl:duration*1000,
      allowStale: false,
      updateAgeOnGet: true
   })

   return (req, res, next) => {
      let hashed_ = hash(JSON.stringify([
         req.user,
         req.path,
         req.method,
         req.body,
         req.query,
         req.params
      ]))

      let data = lruCache.get(hashed_)
      if (data !== undefined){

         res.set(data.headers)
         res.append("IsCachedData","TRUE")
         res.send(data.content)
         return
      }
      res.sendResponse = res.send
      res.send = (body)=>{

         lruCache.set(hashed_, {content:body,headers:res.getHeaders()})

         res.sendResponse(body)

      }
      next()
   }
}


module.exports = {
   authenticated, cached
}
