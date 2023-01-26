/**
 * @template T
 */
export class WatchableValue {
    /**
     * @type {T}
     */
    #value
    /**
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
        this.#listeners = this.#listeners.filter(l => l !== callback)
    }
}
