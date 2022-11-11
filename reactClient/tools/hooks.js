import React from "react";

/**
 * Makes any element toggleable
 *
 * When the element is toggled, the attribute "toggled" is added to the element
 *
 * @param {(toggled: boolean)=>void} [callback] Callback function to run when the element is toggled
 * @return {React.MouseEventHandler} Returns a onClick listener for the target element.
 */
export function useToggle(callback){
    return (/**React.MouseEvent*/e)=>{
        e.currentTarget.toggleAttribute("toggled")
        callback?.(e.currentTarget.hasAttribute("toggled"))
    }
}
