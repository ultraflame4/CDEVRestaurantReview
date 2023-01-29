import React, {useState} from "react";

import {Icon} from "@iconify-icon/react";
import {InputRangeSlider} from "@/components/InputRangeSlider/InputRangeSlider";
import PropTypes from "prop-types";
import classes from "@/components/Restaurant/SidePanelFilter.module.css";

/**
 * Represents an item for the filter sidepanel.
 * @param {{
 *     title: string,
 *     icon: string,
 *     minIcon?: string,
 *     className?: string,
 *     min?: number,
 *     max?: number,
 *     step?: number,
 *     defaultValue?: number,
 *     callback?: function (value:number, min:number, max :number) : void,
 *     noIcon?: boolean,
 *     minText?: string,
 *     maxText?: string,
 *     showValueIcon?: string,
 *     showValueMaxText?: string
 * }} props
 * @return {*}
 */
const FilterSliderItem = (props) => {
    // The value text is the current value the slider is at and the value that will be displayed if enabled.
    const [valueText, setValueText] = useState(0)

    // Callback for the input range slider.
    function callback(value, min, max) {
        // If the value is not the max value, then we want to display the value.
        // Otherwise, we want to display the max value text if it is set. (else just show the value)
        setValueText(value !== max ? value : (props.showValueMaxText ?? value))
        // Call the callback if it is set.
        props.callback?.(value, min, max)
    }

    return (<li className={props.className}>
        <h5>{props.title}</h5>

        <span className={classes.filterRangeSliderValue} data-hasicon={props.showValueIcon}>
                {valueText}
            {props.showValueIcon ? <Icon icon={props.showValueIcon} className={classes.icon}/> : ""}
        </span>
        {/*The range slider input for the filter*/}
        <InputRangeSlider min={props.min} max={props.max} step={props.step} defaultValue={props.defaultValue}
                          onInput={callback}/>
        {
            props.noIcon ?
                // If noIcon is true, then we don't want to display any icons, but instead text.
                <>
                    <span>{props.minText}</span>
                    <div><span>{props.maxText}</span></div>
                </>
                :
                // Otherwise, we want to display the minIcon and then the max icon 5 times.
                <>
                    <Icon icon={props.minIcon ?? props.icon} className={classes.icon}/>
                    <div>
                        <Icon icon={props.icon} className={classes.icon}/>
                        <Icon icon={props.icon} className={classes.icon}/>
                        <Icon icon={props.icon} className={classes.icon}/>
                        <Icon icon={props.icon} className={classes.icon}/>
                        <Icon icon={props.icon} className={classes.icon}/>
                    </div>
                </>
        }
    </li>)
}


FilterSliderItem.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    minIcon: PropTypes.string,
    className: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    defaultValue: PropTypes.number,
    callback: PropTypes.func,
    noIcon: PropTypes.bool,
    minText: PropTypes.string,
    maxText: PropTypes.string,
    showValueIcon: PropTypes.string,
    showValueMaxText: PropTypes.string
}

/**
 * Represents the filter sidepanel with filters and sorting options.
 *
 * @param props {{
 *         maxCostChange?: function (value:number, min:number, max :number) : void,
 *         minRatingChange?: function (value:number, min:number, max :number) : void,
 *         minReviewsChange?: function (value:number, min:number, max :number) : void,
 *         sortByChange ?: function (sortBy:string) : void,
 * }}
 * @return {React.ReactNode}
 * @constructor
 */
export const FilterSidepanel = (props) => {

    return (
        <aside className={`card ${classes.filterpanel}`}>
            <h4>Filters</h4>
            <ul>
                <FilterSliderItem
                    title={"Max Cost"}
                    icon={"fa:dollar"}
                    min={0}
                    max={5}
                    defaultValue={5}
                    showValueIcon={"fa:dollar"}
                    showValueMaxText={"Any"}
                    callback={props.maxCostChange}
                />
                <FilterSliderItem
                    title={"Min. Ratings"}
                    minIcon={"material-symbols:star-outline"}
                    icon={"material-symbols:star"}
                    showValueIcon={"material-symbols:star"}
                    min={0}
                    max={5}
                    callback={props.minRatingChange}
                />

                <FilterSliderItem
                    title={"Min. Reviews"}
                    minIcon={"material-symbols:star-outline"}
                    icon={"material-symbols:star"}
                    min={0}
                    max={41}
                    noIcon={true}
                    minText={"0"}
                    maxText={"40+"}
                    showValueMaxText={"40+"}
                    showValueIcon={"material-symbols:chat"}
                    callback={props.minReviewsChange}
                />

            </ul>
            <h4>Sort by</h4>
        </aside>
    )
}

FilterSidepanel.propType = {
    maxCostChange: PropTypes.func,
    minRatingChange: PropTypes.func,
    minReviewsChange: PropTypes.func,
    sortByChange: PropTypes.func
}
