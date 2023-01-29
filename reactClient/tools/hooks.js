import React, {useEffect, useRef, useState} from "react";
/**
 * Makes any element toggleable
 *
 * When the element is toggled, the attribute "toggled" is added to the element
 *
 * @param {(toggled: boolean)=>void} [callback] Callback function to run when the element is toggled
 * @return {React.MouseEventHandler} Returns a onClick listener for the target element.
 */
export function useToggle(callback) {
    return (/**React.MouseEvent*/e) => {
        e.currentTarget.toggleAttribute("toggled")
        callback?.(e.currentTarget.hasAttribute("toggled"))
    }
}

/**
 * Makes any element toggleable like useToggle, but also un-toggles when the mouse is clicked outside the element (and descendents)
 *
 * @param {MutableRefObject<null> | null} triggerElementRef The element ref to trigger toggle when clicked. Defaults to element ref that is returned. When left to default, the element will toggle itself and cause visibility issues,
 * @param {(toggled: boolean)=>void | null} callback The callback called
 * @return {MutableRefObject<HTMLElement | null>} Returns a ref to set for the target element.
 */

export function useOverlayToggle(triggerElementRef = null, callback = null) {
    /**
     * Create a ref for the target element
     * @type {MutableRefObject<HTMLElement | null>}
     */
    const ref = useRef(null)
    useEffect(() => {

        ref.current.tabIndex = -1


        if (triggerElementRef == null) {
            triggerElementRef = ref
        }

        const clickListener = (e) => {
            e.stopPropagation()
            ref.current?.toggleAttribute("toggled")
            callback?.(true)
        }

        const blurListener = (/**@type {MouseEvent}*/e) => {

            if  (ref.current.contains(e.target))
                return
            ref.current?.toggleAttribute("toggled", false)
            callback?.(false)
        }


        document.addEventListener("click", blurListener)
        triggerElementRef.current?.addEventListener("click", clickListener)

        return () => {

            document.removeEventListener("click", blurListener)
            triggerElementRef.current?.removeEventListener("click", clickListener)
        }

    }, [ref.current])
    return ref;
}

/**
 * @template T
 * This hook allows easy usage of WatchableValues, whenever a value is changed, the component is re-rendered.
 * <br/>
 * Usage is similar useState()
 * <br/>
 * This hook internally uses useState and useEffect.
 * @param {WatchableValue<T>} watchableVal The WatchableValue instance to use
 * @return {T} Returns the WatchableValue's current value
 */
export function useWatchableValue(watchableVal) {
    const [getVal, setVal] = useState(watchableVal.value);

    useEffect(() => {
        const callback = () => {
            setVal(watchableVal.value)
        }
        watchableVal.watch(callback);
        return () => {
            watchableVal.release(callback)
        };
    }, [watchableVal])

    return getVal
}
