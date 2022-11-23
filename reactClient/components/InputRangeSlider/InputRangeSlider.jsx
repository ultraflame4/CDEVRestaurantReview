import React, {useRef} from "react";
import PropTypes from "prop-types";
import classes from "./InputRangeSlider.module.css"

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
 * @param props
 * @return {*}
 * @constructor
 */
export const InputRangeSlider = function (props) {

    function OnInput(/**@type {React.FormEvent<HTMLInputElement>}*/e) {
        /**
         * @type {HTMLInputElement}
         */
        let inputElement = e.currentTarget
        let min = inputElement.min.length!==0?inputElement.min:"1"
        let max =  inputElement.max.length!==0?inputElement.max:"100"
        let current = inputElement.value
        console.log(min,max,current)
        let fillPercent = ((inputElement.value - min) / (max - min) )*100
        inputElement.style.background =
            `linear-gradient(to right, var(--fill-track-color) 0%, var(--fill-track-color) ${fillPercent}%, var(--bg-color) ${fillPercent}%, var(--bg-color) 100%)`
    }

    return (
        <input type={"range"} className={props.className ?? "" + " " + classes.slider} onInput={OnInput}/>
    )
}

InputRangeSlider.propTypes = {
    className: PropTypes.string
}
