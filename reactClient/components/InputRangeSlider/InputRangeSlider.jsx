import React, {useEffect, useRef} from "react";
import classes from "./InputRangeSlider.module.css"
import PropTypes from "prop-types";

/**
 * Wrapper around the html input element so that I can easily customise it. <br/>
 * Acts as drop in replacement for input. Style it with input element selector. Or use a class <br/>
 * Accepts className for classes <br/>
 * -<br/>
 * CSS Properties: <br/>
 * --fill-track-color : Color to fill the track with as u drag it. <br/>
 * --bg-color : Initial color of the tracked when not filled <br/>
 * -<br/>
 * Colors are set with css
 *
 * @param {{
 *     className?: string,
 *     min?: number,
 *     max?: number,
 *     step?: number,
 *     defaultValue?: number,
 *     onInput?: function (value:number, min:number, max :number) : void
 * }} props
 * @return {*}
 * @constructor
 */
export const InputRangeSlider = function (props) {
    // Reference to the input element
    const inputElementRef = useRef(null)

    // Called when the input element is dragged
    function OnInput(e) {
        /**
         * @type {HTMLInputElement}
         */
        let inputElement = inputElementRef.current // get the input element from the reference
        // If the min max values are not set, (the props are undefined) then take them as min = 0 and max = 100
        let min = parseFloat(inputElement.min.length !== 0 ? inputElement.min : "0")
        let max = parseFloat(inputElement.max.length !== 0 ? inputElement.max : "100")
        // Get the current slider value of the input element
        let current = parseFloat(inputElement.value)
        // Calculate the percentage of the slider should be filled
        let fillPercent = ((inputElement.value - min) / (max - min)) * 100
        // Set the css variable to the percentage, and css will fill the track
        inputElement.style.setProperty("--filledPercentage",`${fillPercent}%`)
        // Call the props.onInput callback  if it is set
        props.onInput?.(current,min,max)
    }

    useEffect(()=>{
        // Update the input element on initial load, so it doesn't look weird when defaultValue is not 0
        OnInput(null)
    },[props.defaultValue])

    return (
        <input type={"range"} className={props.className ?? "" + " " + classes.slider} onInput={OnInput}
               min={props.min??0}
               max={props.max??100}
               step={props.step??1}
               defaultValue={props.defaultValue??0}
               ref={inputElementRef}
        />
    )
}

InputRangeSlider.propType = {
    min:PropTypes.number,
    max:PropTypes.number,
    step:PropTypes.number,
    defaultValue:PropTypes.number,
    onInput:PropTypes.object,
}
