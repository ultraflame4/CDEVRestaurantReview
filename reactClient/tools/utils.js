/**
 * @template T
 */
export class WatchableValue {
    /**
     * @type {T}
     */
    #value
    /**
     * Listener callbacks
     * @type {Array<()=>void>}
     */
    #listeners;

    constructor(value) {
        this.#value = value
        this.#listeners = []
    }

    get value() {
        return this.#value
    }

    set value(value) {
        // If the value is the same, do nothing
        if (this.#value === value) return
        // Else set the value and call the listeners
        this.#value = value
        this.#listeners.forEach(listener => listener())
    }

    /**
     * Adds a callback to the watchable value.
     * It is called every time the value is changed
     * @param {()=>void} callback
     */
    watch(callback) {
        this.#listeners.push(callback)
    }

    /**
     * Removes the specified callback
     * @param {Array<()=>void>} callback
     */
    release(callback) {
        // Remove the callback from the listeners array
        this.#listeners = this.#listeners.filter(l => l !== callback)
    }
}

/**
 * A helper function to get the map embed url for Google Maps
 * @param {string} name
 * @param {string} location
 * @return {string}
 * @constructor
 */
export function GetMapEmbedUrl(name,location) {
    return `https://maps.google.com/maps?width=100%&hl=en&q=${encodeURIComponent(location)}+(${encodeURIComponent(name)})&z=18&output=embed`
}
