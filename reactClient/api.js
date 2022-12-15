import React from "react";
import {WatchableValue} from "@/tools/utils";

const host = import.meta.env.DEV? `localhost:${import.meta.env.VITE_EXPRESS_PORT}` : location.host


/**
 * Wraps the fetch function to add the base URL for the host
 * @param {string} path_
 * @param {RequestInit} init
 * @returns {Promise<Response>}
 */
function fetchApi(path_,init={}) {
    let url = new URL(path_,`http://${host}`)
    return fetch(url, init)
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
 * @param n
 * @return {{
 *      name:string,
 *      tags:string[],
 *      rating:number,
 *      cost: number,
 *      desc: string,
 *      bannerSrc: string,
 *      }[]}
 * @constructor
 */
export function GetRestaurants(n){
    // todo, change this to actual api call
    let a = []
    for (let i = 0; i < n; i++) {
        a.push({
            name: "Restaurant#"+i,
            tags: ["Chinese","Halal","Western"],
            rating: 7,
            cost:4,
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
