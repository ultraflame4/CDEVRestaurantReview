import React from "react";

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


export default {
    fetch: fetchApi
}
