import {WatchableValue} from "@/tools/utils";

// This is a watchable value that holds the current modal that should be shown
// When the value is changed, components can react and update to it.
export const GlobalCurrentModal = new WatchableValue(null)

const modalCloseCallbacks = {}

/**
 *
 * @param modalId {string} Modal id of the modal to show
 * @param callback {()=>void} Callback to call when the modal is closed
 */
export function showModal_c(modalId,callback) {
    // To show the modal, set the current modal to the modalId
    GlobalCurrentModal.value = modalId

    // If there are no current callbacks stored for this modalId, create an empty array for it in the dictionary
    if (!(modalCloseCallbacks[modalId] instanceof Array)){
        modalCloseCallbacks[modalId] = []
    }

    // Add the callback to the callbacks array
    modalCloseCallbacks[modalId].push(callback)
}

/**
 * The promised-fied version of showModal_c
 * @param modalId {string} Modal id of the modal to show
 * @return {Promise<null>} A promise that resolves when the modal is closed
 */
export function showModal(modalId) {
    return new Promise((resolve, reject) => {
        // Call the showModal_c function with a callback that resolves the promise
        showModal_c(modalId, ()=>resolve(null))
    })

}

/**
 * Close the modal with the given modalId
 * @param modalId {string} modalId of the modal to close
 */
export function closeModal(modalId) {
    // check if the modalId is the current modal, aka if the modalId of the modal is actually opened
    if (GlobalCurrentModal.value === modalId){
        // We simply close the modal by setting the current modal to null
        GlobalCurrentModal.value = null
        // And then we call all the close modal callbacks that were set when the modal was opened
        modalCloseCallbacks[modalId]?.forEach(callback => callback())
    }
}

