import {WatchableValue} from "@/tools/utils";
import {SignInModal, SignUpModal} from "@/components/HeaderNav/AccountModals";
import {useEffect, useState} from "react";

export const GlobalCurrentModal = new WatchableValue(null)

const modalCloseCallbacks = {}

/**
 *
 * @param modalId {string} Modal id of the modal to show
 * @param callback {()=>void} Callback to call when the modal is closed
 */
export function showModal_c(modalId,callback) {
    GlobalCurrentModal.value = modalId
    if (!(modalCloseCallbacks[modalId] instanceof Array)){
        modalCloseCallbacks[modalId] = []
    }
    modalCloseCallbacks[modalId].push(callback)
}

/**
 * The promised-fied version of showModal_c
 * @param modalId {string} Modal id of the modal to show
 * @return {Promise<null>} A promise that resolves when the modal is closed
 */
export function showModal(modalId) {
    return new Promise((resolve, reject) => {
        showModal_c(modalId, ()=>resolve(null))
    })

}

export function closeModal(modalId) {
    if (GlobalCurrentModal.value === modalId){
        GlobalCurrentModal.value = null
        modalCloseCallbacks[modalId]?.forEach(callback => callback())
    }
}

