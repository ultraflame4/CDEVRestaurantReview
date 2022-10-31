
const host = import.meta.env.DEV? `localhost:${import.meta.env.VITE_EXPRESS_PORT}` : location.host


/**
 * Wraps the fetch function to add the base URL for the host
 * @param {string} path_
 * @param {RequestInit} init
 * @returns {Promise<Response>}
 */
export function fetchApi(path_,init) {
    let url = new URL(path_,`http://${host}`)
    return fetch(url, init)
}

