import React from "react";

/**
 * Restaurant Type returned by the database
 * @export
 * @typedef {Object} DBRestaurantType
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {{x:number,y:number}} coordinates
 * @property {string} location
 * @property {string} phone_no
 * @property {string} website
 * @property {number} cost_rating
 * @property {string} avg_rating although returned as a string, this is actually a number (float)
 * @property {number} review_count
 * @property {string} photo_url
 * @property {string[]} tags
 */


/**
 * Review Type returned by the database
 * @export
 * @typedef DBReviewType
 * @property {number} id
 * @property {number} restaurant_id
 * @property {number} author_id
 * @property {string} content
 * @property {number} rating
 * @property {string} date_created
 * @property {string} last_edited
 * @property {number} like_count
 * @property {string} username
 */

// Error class for api errors so we can pass in the html error codes
export class ApiError extends Error {
    constructor(apiPath, jsonData, errCode) {
        super(`ApiError: Error while fetching ${apiPath}\nApi results:\n${JSON.stringify(jsonData, null, 2)}`);
        this.name = "ApiError"
        this.apiError = jsonData?.error
        this.code = errCode
    }
}

/**
 * Wraps the fetch function to add the base URL for the host
 * @param {string} path_
 * @param {RequestInit} init
 * @param queryParams {Object}
 * @returns {Promise<any|null>} Returns null on failure
 */
export async function fetchApi(path_, queryParams = {}, init = {}) {
    // Format the url to include any query parameters
    let url = new URL(path_, `http://${window.location.host}`) + "?" + new URLSearchParams(queryParams)
    let response;


    try {
        // Fetch the api with the init options
        response = await fetch(url, init);
    } catch (err) {
        // if there was an error, log it and throw a generic error
        console.error(`Error while fetching api ${url}:`, err)
        throw new Error("Unable to fetch api")
    }

    // try to decode the response
    let jsonData = undefined;
    try {
        jsonData = await response.json();
    } catch (err) {
        console.error(`Error while decoding response ${path_}:`, response)
    }

    // check if the response is an error
    if (!response.ok) {
        throw new ApiError(url, jsonData ?? response.body, response.status)
    }

    // return the decoded response
    // if response was not able to be decoded, throw an error
    if (jsonData === undefined) {
        throw new Error("Unable to decode response")
    }

    return jsonData
}

/**
 * Fetches the api with the Post method
 * @param path_
 * @param data {Object} json data to send in the body
 * @param queryParams
 * @param init
 * @return {Promise<*|null>}
 */
export function postApi(path_, data, queryParams = {}, init = {}) {
    return fetchApi(path_, queryParams, {
        ...init,
        method: "POST",
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json" // very important, otherwise the server will not know what to do with the data
        },
        body: JSON.stringify(data)
    })
}

/**
 * Fetches the api with the Put method
 * @param path_
 * @param data {Object} json data to send in the body
 * @param queryParams
 * @param init
 * @return {Promise<*|null>}
 */
export function putApi(path_, data, queryParams = {}, init = {}) {
    return fetchApi(path_, queryParams, {
        ...init,
        method: "PUT",
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json" // very important, otherwise the server will not know what to do with the data
        },
        body: JSON.stringify(data)
    })
}

/**
 * Returns the current user's location data
 * @return {Promise<{x:number,y:number,success:boolean}>}
 */
function getCurrentGeoPosition() {
    return new Promise((resolve, reject) => {
        // check if geolocation is supported
        if (!navigator.geolocation) {
            // Else reject the promise with 0,0 for the xy coordinates
            reject({
                x: 0,
                y: 0,
                success: false
            })
            return
        }

        // get the current position and resolve the promise
        navigator.geolocation.getCurrentPosition(position => {
            resolve({
                x: position.coords.longitude,
                y: position.coords.latitude,
                success: true
            })

        }, positionError => {
            // if there was an error, reject the promise and return 0,0 for the xy coordinates
            reject({
                x: 0,
                y: 0,
                success: false
            })
        }, {enableHighAccuracy: true})
    })
}

const sortConvTable = [
    "index",
    "cost",
    "rating",
    "reviews",
    "distance"
]


/**
 *
 * @param start {number}
 * @param sort {number}
 * @param order {number}
 * @return {Promise<DBRestaurantType[]>}
 */
export async function GetRestaurants(start, sort = -1, order = 0) {
    let sort_converted = sortConvTable[parseInt(sort) + 1] // add 1 to sort to account for the index (-1 no sort becomes index sort)
    // get the current position
    let pos = await getCurrentGeoPosition()

    let response;
    try {
        // fetch the restaurants
        response = await fetchApi("/api/restaurants",
            {
                start: start,
                x: pos.x,
                y: pos.y,
                limit: 15,
                sortBy: sort_converted,
                order: order === 0 ? "asc" : "desc"
            })
        // return the results
        return response.results;
    } catch (err) {
        // if there was an error, log it and return an empty array
        console.error(err)
        return []
    }

    // PSEUDO DATA GENERATOR BELOW
    let a = []
    for (let i = 0; i < 15; i++) {
        a.push({
            name: "Restaurant#" + i,
            tags: ["Chinese", "Halal", "Western"],
            avg_rating: "7",
            cost_rating: 4,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac urna porttitor, suscipit enim sit amet, dignissim libero. Sed a leo et massa consectetur tempor sit amet a justo. Donec bibendum nisl eu orci efficitur ultricies. Duis porta mi at ante cursus, sed pellentesque enim lobortis. Curabitur vitae venenatis purus. Aenean efficitur venenatis tempor. In pellentesque interdum mi, ut fringilla nisi interdum a. Praesent feugiat nunc sit amet purus molestie blandit. Sed felis sapien, semper fringilla suscipit eget, pulvinar quis mi. Etiam suscipit vel tellus ac egestas. Vivamus felis ex, aliquam ac interdum nec, eleifend nec massa. Suspendisse fringilla nisl nisl, nec rhoncus lorem gravida sit amet.\n" +
                "\n" +
                "Etiam eu libero eu enim interdum ullamcorper et non libero. Nulla sollicitudin nunc felis, sit amet imperdiet neque cursus quis. Quisque consectetur sapien eu augue ullamcorper, at molestie quam scelerisque. Quisque quis nunc porttitor, sagittis lectus et, sodales diam. Vestibulum orci libero, dignissim a ipsum ut, sodales sodales arcu. Fusce lacinia ligula quis suscipit rutrum. Pellentesque pulvinar justo vel mi molestie, sit amet sollicitudin augue elementum. Suspendisse consectetur id lorem eget feugiat. Pellentesque sollicitudin sodales dui nec molestie. Vestibulum dolor eros, egestas ac metus at, tristique gravida ex. Nam convallis iaculis quam sit amet convallis. Maecenas odio lorem, finibus vel lacus non, faucibus efficitur lacus. Nam ultrices sapien ut sapien dignissim iaculis. Quisque lobortis risus in ligula tempor ornare.",
            photo_url: "https://picsum.photos/200/300",
            distance: 1000
        })
    }
    return a
}

/**
 * Gets a restaurant from the server using its id
 * @param id
 * @return {Promise<null|DBRestaurantType>}
 * @constructor
 */
export async function GetRestaurantById(id) {
    // get the current position
    let currentPos = await getCurrentGeoPosition()
    let data;
    try {
        // call the api
        data = await fetchApi("/api/restaurants/id", {
            restaurantId: id,
            x: currentPos.x,
            y: currentPos.y
        })
    } catch (e) {
        // if there was an error, log it and return null
        console.log(e)
        return null
    }
    // return the first (and only) result
    return data.results[0] ?? null
}

/**
 * Gets the recent reviews for a restaurant from the server using its id
 * @param id {number} id of restaurant
 * @param limit {number}
 * @return {Promise<null|DBReviewType[]>}
 * @constructor
 */
export async function GetRestaurantRecentReviews(id, limit = 3) {
    let data;
    try {
        // Call api
        data = await fetchApi("/api/reviews", {
            restaurant_id: id,
            limit: limit,
            sort: "edit_date"
        })
    } catch (e) {
        // if there was an error, log it and return null
        console.log(e)
        return null
    }
    // return the results. if undefined somehow, return null
    return data.results ?? null
}

/**
 * Gets the reviews for a restaurant from the server using its id
 * @param id {number} id of restaurant
 * @param offset {number} Offset to start from
 * @param limit {number}
 * @return {Promise<null|DBReviewType[]>}
 * @constructor
 */
export async function GetRestaurantReviews(id, offset = 0, limit = 15) {
    let data;
    try {
        // Call api
        data = await fetchApi("/api/reviews", {
            restaurant_id: id,
            start: offset,
            limit: limit
        })
    } catch (e) {
        // if there was an error, log it and return null
        console.log(e)
        return null
    }
    // return the results. if undefined somehow, return null
    return data.results ?? null
}

/**
 * Gets a the reviews for a restaurant from the server using its id
 * @param id {number} id of restaurant
 * @param rating {number} Rating given (1-10)
 * @param content {string} The review contents
 * @return {Promise<any>}
 */
export async function CreateRestaurantReview(id, rating, content) {
    // call the api
    return await fetchApi("/api/reviews/create", undefined, {
        method: "POST", // set it to post
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json" // very important, otherwise the server will not know what to do with the data
        },
        body: JSON.stringify({ // pass in the parameters as a json string
            restaurant_id: id,
            rating: rating,
            content: content
        })
    })
}

/**
 * Updates a review by the user
 * @param id {number} id of review to update
 * @param rating {number} Rating given (1-10)
 * @param content {string} The review contents
 * @return {Promise<any>}
 */
export async function UpdateRestaurantReview(id, rating, content) {
    // call the api
    return await fetchApi("/api/reviews/update", undefined, {
        method: "PUT",
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json" // very important, otherwise the server will not know what to do with the data
        },
        body: JSON.stringify({ // pass in the parameters as a json string
            review_id: id,
            rating: rating,
            content: content
        })
    })
}

/**
 * Deletes a review by the user
 * @param id {number} id of review
 * @return {Promise<any>}
 */
export async function DeleteRestaurantReview(id) {
    // call the api
    return await fetchApi("/api/reviews/delete", undefined, {
        method: "DELETE",
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ // pass in the parameters as a json string
            review_id: id
        })
    })
}

export async function UpdateUsername(newUsername, password) {
    return await putApi("/api/user/username", {
        newUsername: newUsername,
        password: password
    })
}

export async function UpdateEmail(newEmail, password) {
    return await putApi("/api/user/email", {
        newEmail: newEmail,
        password: password
    })
}

export async function UpdatePassword(newPassword, password) {
    return await putApi("/api/user/password", {
        newPassword: newPassword,
        password: password
    })
}

export async function CreateAccount(username, email, password) {
    return await postApi("/api/user/create", {
        username: username,
        email: email,
        password: password
    })
}

export async function DeleteAccount(email, password) {
    return await fetchApi("/api/user/delete", undefined, {
        method: "DELETE",
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ // pass in the parameters as a json string
            email: email,
            password: password
        })
    })
}

export async function GetUserReviews(start=0) {
    return await fetchApi("/api/user/reviews",{
        start:start,
        limit:15
    })
}
