import React from "react";

const host = import.meta.env.DEV ? `localhost:${import.meta.env.VITE_DEV_PORT}/app` : location.host

/**
 * Restaurant Type returned by the database
 * @export
 * @typedef DBRestaurantType
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


export class ApiError extends Error {
    constructor(apiPath, jsonData,errCode) {
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
    let url = new URL(path_, `http://${window.location.host}`) + "?" + new URLSearchParams(queryParams)
    let response;


    try {
        response = await fetch(url, init);
    } catch (err) {
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
        throw new ApiError(url, jsonData??response.body,response.status)
    }
    // return the decoded response
    // if response was not able to be decoded, throw an error
    if (jsonData === undefined) {
        throw new Error("Unable to decode response")
    }


    return jsonData


}


/**
 * Returns the current user's location data
 * @return {Promise<{x:number,y:number,success:boolean}>}
 */
function getCurrentGeoPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation){
            reject({
                x: 0,
                y: 0,
                success: false
            })
            return
        }

        navigator.geolocation.getCurrentPosition(position => {
            resolve({
                x: position.coords.longitude,
                y: position.coords.latitude,
                success: true
            })

        }, positionError => {
            reject({
                x: 0,
                y: 0,
                success: false
            })
        }, {enableHighAccuracy: true})
    })
}

/**
 *
 * @param start {number}
 * @return {Promise<DBRestaurantType[]>}
 */
export async function GetRestaurants(start) {


    let pos = await getCurrentGeoPosition()


    let response;
    try {
        response = await fetchApi("/api/restaurants",
            {
                start: start,
                x: pos.x,
                y: pos.y,
                limit: 15
            })

        return response.results;
    } catch (err) {
        console.error(err)
        return []
    }


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
    let currentPos = await getCurrentGeoPosition()
    let data;
    try{
        data = await fetchApi("/api/restaurants/id", {
            restaurantId: id,
            x: currentPos.x,
            y: currentPos.y
        })
    }
    catch (e) {
        console.log(e)
        return null
    }
    return data.results[0] ?? null
}


/**
 * Gets a the reviews for a restaurant from the server using its id
 * @param id {number} id of restaurant
 * @param offset {number} Offset to start from
 * @return {Promise<null|DBReviewType[]>}
 * @constructor
 */
export async function GetRestaurantReviews(id,offset=0){
    let data;
    try{
        data = await fetchApi("/api/reviews",{
            restaurant_id:id,
            start:offset
        })
    }
    catch (e) {
        console.log(e)
        return null
    }
    return data.results ?? null
}
