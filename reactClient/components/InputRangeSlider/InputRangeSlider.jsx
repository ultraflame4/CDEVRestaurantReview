import React from "react";
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
 * @param {{
 *     className: string,
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


    function OnInput(/**@type {React.FormEvent<HTMLInputElement>}*/e) {
        /**
         * @type {HTMLInputElement}
         */
        let inputElement = e.currentTarget
        let min = parseFloat(inputElement.min.length !== 0 ? inputElement.min : "0")
        let max = parseFloat(inputElement.max.length !== 0 ? inputElement.max : "100")
        let current = parseFloat(inputElement.value)

        let fillPercent = ((inputElement.value - min) / (max - min)) * 100
        inputElement.style.background =
            `linear-gradient(to right, var(--fill-track-color) 0%, var(--fill-track-color) ${fillPercent}%, var(--bg-color) ${fillPercent}%, var(--bg-color) 100%)`

        props.onInput?.(current,min,max)
    }

    return (
        <input type={"range"} className={props.className ?? "" + " " + classes.slider} onInput={OnInput}
               min={props.min??0}
               max={props.max??100}
               step={props.step??1}
               defaultValue={props.defaultValue??0}
        />
    )
}
