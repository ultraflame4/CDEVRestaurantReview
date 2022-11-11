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
 * @export
 * @typedef UserAccountInfoObject
 * @property {string} username
 * @property {string} email
 */
/**
 * Context for whether the user account information
 * Defaults to null. When null, user is not logged in.
 * @type {React.Context<UserAccountInfoObject|null>}
 */
export const UserInfoContext = React.createContext(null)


export default {
    fetch: fetchApi,
    contexts: {
        UserInfoContext
    }
}
