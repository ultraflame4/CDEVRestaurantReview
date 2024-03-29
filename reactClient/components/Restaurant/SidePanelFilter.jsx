import React, {useEffect, useRef, useState} from "react";

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


    // Callback to update the value text when the value is changed.
    function numberUpdate(value, min, max) {
        // If the value is not the max value, then we want to display the value.
        // Otherwise, we want to display the max value text if it is set. (else just show the value)
        setValueText(value !== max ? value : (props.showValueMaxText ?? value))
    }


    // Callback for the input range slider. that actually updates other things
    function callback(value, min, max) {
        // Call the callback if it is set.
        props.callback?.(value, min, max)
    }

    return (<li>
        <h5>{props.title}</h5>

        <span className={classes.filterRangeSliderValue} data-hasicon={props.showValueIcon}>
                {valueText}
            {props.showValueIcon ? <Icon icon={props.showValueIcon} className={classes.icon}/> : ""}
        </span>
        {/*The range slider input for the filter*/}
        <InputRangeSlider min={props.min} max={props.max} step={props.step} defaultValue={props.defaultValue}
                          onValUpdate={callback} onInput={numberUpdate}/>
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

const SortByItem = (props) => {

    return (
        <li className={classes.sortBy_item}>
            <button onClick={props.onClick} data-isselected={props.isSelected}><Icon icon={"ic:check-circle"}/></button>
            <h5>{props.title}</h5>
        </li>
    )
}

SortByItem.propTypes = {
    title: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
}


/**
 * Represents the filter sidepanel with filters and sorting options.
 *
 * Sort by options:
 * - No Sort: -1
 * - Cost: 0
 * - Ratings: 1
 * - Reviews: 2
 * - Distance: 3
 *
 * @param props {{
 *         maxCostChange?: function (value:number, min:number, max :number) : void,
 *         minRatingChange?: function (value:number, min:number, max :number) : void,
 *         minReviewsChange?: function (value:number, min:number, max :number) : void,
 *         maxCostInitialValue?: number,
 *         minRatingInitialValue?: number,
 *         minReviewsInitialValue?: number,
 *         sortByChange ?: function (sortBy:string) : void,
 *         sortOrderChange?: function (sortOrder:string) : void,
 *         initialSortBy?: number,
 *         initialSortOrder?:number
 * }}
 * @return {React.ReactNode}
 * @constructor
 */
export const FilterSidepanel = (props) => {
    const [sortBy, setSortBy] = useState(props.initialSortBy ?? -1) // -1 = no sort, 0 = cost, 1 = ratings, 2 = reviews, 3 = distance
    const [sortOrder, setSortOrder] = useState(props.initialSortOrder ?? 0) // 0 = ascending, 1 = descending
    const orderBtnRef = useRef(null)
    function changeSortBy(newSortBy) {
        setSortBy(prevState => {
            if (newSortBy === prevState) {

                return -1
            }

            return newSortBy
        })
    }

    function toggleOrder() {
        setSortOrder(prevState => {
            return prevState === 0 ? 1 : 0
        })
    }

    useEffect(() => {
        orderBtnRef.current.textContent = sortOrder === 0 ? "Ascending" : "Descending"
        props.sortOrderChange?.(sortOrder)
    },[sortOrder])

    useEffect(() => {
        props.sortByChange?.(sortBy)
    },[sortBy])

    return (
        <aside className={`card ${classes.filterpanel}`}>
            <h4>Filters</h4>
            <ul>
                <FilterSliderItem
                    title={"Max Cost"}
                    icon={"fa:dollar"}
                    min={0}
                    max={5}
                    defaultValue={props.maxCostInitialValue ?? 5}
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
                    step={0.5}
                    defaultValue={props.minRatingInitialValue ?? 0}
                    callback={props.minRatingChange}
                />

                <FilterSliderItem
                    title={"Min. Reviews"}
                    minIcon={"material-symbols:star-outline"}
                    icon={"material-symbols:star"}
                    min={0}
                    max={41}
                    defaultValue={props.minReviewsInitialValue ?? 0}
                    noIcon={true}
                    minText={"0"}
                    maxText={"40+"}
                    showValueMaxText={"40+"}
                    showValueIcon={"material-symbols:chat"}
                    callback={props.minReviewsChange}
                />

            </ul>
            <h4>Sort by <button onClick={toggleOrder} ref={orderBtnRef}></button></h4>
            <ul>
                <SortByItem title={"Cost"} isSelected={sortBy === 0} onClick={() => {
                    changeSortBy(0)
                }}/>
                <SortByItem title={"Rating"} isSelected={sortBy === 1} onClick={() => {
                    changeSortBy(1)
                }}/>
                <SortByItem title={"Reviews"} isSelected={sortBy === 2} onClick={() => {
                    changeSortBy(2)
                }}/>
                <SortByItem title={"Distance"} isSelected={sortBy === 3} onClick={() => {
                    changeSortBy(3)
                }}/>
            </ul>
        </aside>
    )
}

FilterSidepanel.propType = {
    maxCostChange: PropTypes.func,
    minRatingChange: PropTypes.func,
    minReviewsChange: PropTypes.func,
    maxCostInitialValue: PropTypes.number,
    minRatingInitialValue: PropTypes.number,
    minReviewsInitialValue: PropTypes.number,
    sortByChange: PropTypes.func,
    sortOrderChange: PropTypes.func,
    initialSortBy: PropTypes.number,
    initialSortOrder: PropTypes.number
}
