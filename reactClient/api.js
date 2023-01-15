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
        console.error(`Error while fetching api ${path_}:`, err)
        throw new Error("Unable to fetch api")
    }

    try {
        let jsonData = await response.json();
        return jsonData
    } catch (err) {
        console.error(`Error while decoding response ${path_}:`, response)
        throw new Error("Unable to decode response")
    }


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
 *
 * @param start {number}
 * @return {Promise<DBRestaurantType>}
 */
export async function GetRestaurants(start) {

    let response;
    try {
        response = await fetchApi("/api/restaurants", {}, {start: start})
        return response.results
    } catch (err) {
        console.error(err)
        return []
    }


    let a = []
    for (let i = 0; i < n; i++) {
        a.push({
            name: "Restaurant#" + i,
            tags: ["Chinese", "Halal", "Western"],
            rating: 7,
            cost: 4,
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac urna porttitor, suscipit enim sit amet, dignissim libero. Sed a leo et massa consectetur tempor sit amet a justo. Donec bibendum nisl eu orci efficitur ultricies. Duis porta mi at ante cursus, sed pellentesque enim lobortis. Curabitur vitae venenatis purus. Aenean efficitur venenatis tempor. In pellentesque interdum mi, ut fringilla nisi interdum a. Praesent feugiat nunc sit amet purus molestie blandit. Sed felis sapien, semper fringilla suscipit eget, pulvinar quis mi. Etiam suscipit vel tellus ac egestas. Vivamus felis ex, aliquam ac interdum nec, eleifend nec massa. Suspendisse fringilla nisl nisl, nec rhoncus lorem gravida sit amet.\n" +
                "\n" +
                "Etiam eu libero eu enim interdum ullamcorper et non libero. Nulla sollicitudin nunc felis, sit amet imperdiet neque cursus quis. Quisque consectetur sapien eu augue ullamcorper, at molestie quam scelerisque. Quisque quis nunc porttitor, sagittis lectus et, sodales diam. Vestibulum orci libero, dignissim a ipsum ut, sodales sodales arcu. Fusce lacinia ligula quis suscipit rutrum. Pellentesque pulvinar justo vel mi molestie, sit amet sollicitudin augue elementum. Suspendisse consectetur id lorem eget feugiat. Pellentesque sollicitudin sodales dui nec molestie. Vestibulum dolor eros, egestas ac metus at, tristique gravida ex. Nam convallis iaculis quam sit amet convallis. Maecenas odio lorem, finibus vel lacus non, faucibus efficitur lacus. Nam ultrices sapien ut sapien dignissim iaculis. Quisque lobortis risus in ligula tempor ornare.",
            bannerSrc: "https://picsum.photos/200/300"
        })
    }
    return a
}

export default {
    fetch: fetchApi,
    GetRestaurants
}
