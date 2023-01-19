import React from "react";
import {WatchableValue} from "@/tools/utils";

const host = import.meta.env.DEV ? `localhost:${import.meta.env.VITE_EXPRESS_PORT}` : location.host

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
 * @property {number} avg_rating
 * @property {number} review_count
 * @property {string} photo_url
 * @property {string[]} tags
 */


class ApiError extends Error {
    constructor(apiPath, jsonData) {
        super(`ApiError: Error while fetching ${apiPath}\nApi results:\n${JSON.stringify(jsonData, null, 2)}`);
        this.name = "ApiError"

    }

}

/**
 * Wraps the fetch function to add the base URL for the host
 * @param {string} path_
 * @param {RequestInit} init
 * @param queryParams {Object}
 * @returns {Promise<any|null>} Returns null on failure
 */
async function fetchApi(path_, init = {}, queryParams = {}) {
    let url = new URL(path_, `http://${host}`) + "?" + new URLSearchParams(queryParams)
    let response;
    try {
        response = await fetch(url, init);
    } catch (err) {
        console.error(`Error while fetching api ${url}:`, err)
        throw new Error("Unable to fetch api")
    }
    let jsonData;
    try {
        jsonData = await response.json();
    } catch (err) {
        console.error(`Error while decoding response ${path_}:`, response)
        throw new Error("Unable to decode response")
    }

    if (jsonData.error) {
        throw new ApiError(url, jsonData)
    }

    return jsonData


}


/**
 * Contains basic information about the user
 *
 * @export
 * @typedef UserAccountInfoObject
 * @property {WatchableValue<string|null>} username WatchableValue, value is null when not logged in
 * @property {WatchableValue<string|null>} email WatchableValue, value is null when not logged in
 */
/**
 *
 * @type {UserAccountInfoObject}
 */
export const UserAccountInfo = {
    username: new WatchableValue(null),
    email: new WatchableValue(null),
}

/**
 * A Promisefied version of navigator.geolocation.getCurrentPosition
 * @return {Promise<GeolocationPosition>}
 */
function getCurrentGeoPosition(){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve(position)
        },positionError => {
            reject(positionError)
        },{enableHighAccuracy:true})
    })
}

/**
 *
 * @param start {number}
 * @return {Promise<DBRestaurantType[]>}
 */
export async function GetRestaurants(start) {

    let pos = {x:0,y:0}

    if (navigator.geolocation){
        let geoPosition = await getCurrentGeoPosition()
        pos.x=geoPosition.coords.longitude
        pos.y=geoPosition.coords.latitude
    }


    let response;
    try {
        response = await fetchApi("/api/restaurants", {},
            {
                start: start,
                x:pos.x,
                y:pos.y,
                limit:15
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
            avg_rating: 7,
            cost_rating: 4,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac urna porttitor, suscipit enim sit amet, dignissim libero. Sed a leo et massa consectetur tempor sit amet a justo. Donec bibendum nisl eu orci efficitur ultricies. Duis porta mi at ante cursus, sed pellentesque enim lobortis. Curabitur vitae venenatis purus. Aenean efficitur venenatis tempor. In pellentesque interdum mi, ut fringilla nisi interdum a. Praesent feugiat nunc sit amet purus molestie blandit. Sed felis sapien, semper fringilla suscipit eget, pulvinar quis mi. Etiam suscipit vel tellus ac egestas. Vivamus felis ex, aliquam ac interdum nec, eleifend nec massa. Suspendisse fringilla nisl nisl, nec rhoncus lorem gravida sit amet.\n" +
                "\n" +
                "Etiam eu libero eu enim interdum ullamcorper et non libero. Nulla sollicitudin nunc felis, sit amet imperdiet neque cursus quis. Quisque consectetur sapien eu augue ullamcorper, at molestie quam scelerisque. Quisque quis nunc porttitor, sagittis lectus et, sodales diam. Vestibulum orci libero, dignissim a ipsum ut, sodales sodales arcu. Fusce lacinia ligula quis suscipit rutrum. Pellentesque pulvinar justo vel mi molestie, sit amet sollicitudin augue elementum. Suspendisse consectetur id lorem eget feugiat. Pellentesque sollicitudin sodales dui nec molestie. Vestibulum dolor eros, egestas ac metus at, tristique gravida ex. Nam convallis iaculis quam sit amet convallis. Maecenas odio lorem, finibus vel lacus non, faucibus efficitur lacus. Nam ultrices sapien ut sapien dignissim iaculis. Quisque lobortis risus in ligula tempor ornare.",
            photo_url: "https://picsum.photos/200/300",
            distance:1000
        })
    }
    return a
}
