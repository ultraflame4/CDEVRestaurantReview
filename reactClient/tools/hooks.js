import React, {useEffect, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";
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

        // If the trigger element ref is null, set it to the element ref
        if (triggerElementRef == null) {
            triggerElementRef = ref
        }

        // Listen for clicks in the trigger element and toggle on the element
        const clickListener = (e) => {
            e.stopPropagation()
            ref.current?.toggleAttribute("toggled")
            callback?.(true)
        }

        // Listen for clicks and un-toggle if clicked outside the element
        const blurListener = (/**@type {MouseEvent}*/e) => {
            // If the click was inside the element, do nothing
            if  (ref.current.contains(e.target))
                return
            // Else untiggle
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
            // Update the value when tge watchable value is changed
            setVal(watchableVal.value)
        }
        // Add a listener to the watchable value
        watchableVal.watch(callback);
        return () => {
            // Remove the listener when the component is unmounted
            watchableVal.release(callback)
        };

    }, [watchableVal])

    return getVal
}

/**
 * Basically useState and useSearchParams combined
 *
 * @param {string} name The name of the search param
 * @param {any} defaultValue The default value of the search param
 * @return {[string, (val: string)=>void]} Returns the state and a function to set the state
 */
export function useSearchParamsState(name, defaultValue){
    const [searchParams, setSearchParams] = useSearchParams()
    let val = searchParams.get(name)
    if (val == null) {
        searchParams.set(name, defaultValue)
        setSearchParams(searchParams)
        val = defaultValue
    }

    const [state, setState] = useState(val)

    return [state, (val) => {
        searchParams.set(name, val)
        setSearchParams(searchParams)
        setState(val)
    }]
}
