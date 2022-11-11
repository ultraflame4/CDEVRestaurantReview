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
 * Context for whether the user is logged in or not.
 * Defaults to false.
 * @type {React.Context<boolean>}
 */
export const UserLoggedInContext = React.createContext(false);


export default {
    fetch: fetchApi,
    contexts: {
        UserLoggedInContext
    }
}
