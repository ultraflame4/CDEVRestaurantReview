import PropTypes, {func, number} from "prop-types";
import classes from "./Restaurant.module.css"
import {InputRangeSlider} from "@/components/InputRangeSlider/InputRangeSlider";
import {Icon} from "@iconify-icon/react";
import React, {useRef, useState} from "react";

/**
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
 *     showValue?: boolean,
 *     showValueIcon?: string,
 *     showValueMaxText?: string
 * }} props
 * @return {*}
 * @constructor
 */
const FilterSliderItem = (props) => {
    const [valueText, setValueText] = useState(0)

    function callback(value, min, max){
        setValueText(value!==max?value:(props.showValueMaxText??value))
        props.callback?.(value,min,max)
    }

    return (
        <li className={props.className}>
            <h5>{props.title}</h5>
            {
                props.showValue?"":
                    <span className={classes.filterRangeSlider}>
                        {valueText}
                    </span>
            }
            <InputRangeSlider min={props.min} max={props.max} step={props.step} defaultValue={props.defaultValue}
                              onInput={callback}/>
            {
                props.noIcon ?
                    <>
                        <span>
                            {props.minText}
                        </span>
                        <div>
                            <span>
                                {props.maxText}
                            </span>
                        </div>
                    </> :
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
        </li>
    )
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
    callback: PropTypes.object,
    noIcon: PropTypes.bool,
    minText: PropTypes.string,
    maxText: PropTypes.string,
    showValue: PropTypes.bool,
    showValueIcon: PropTypes.string,
    showValueMaxText: PropTypes.string
}


const MemoizedFilterSliderItem = React.memo(FilterSliderItem)

export const RestaurantList = (props) => {
    return <>
        <h1 className={classes.title}>
            {props.title}
        </h1>
        <aside className={`card ${classes.filterpanel}`}>
            <h4>Filters</h4>
            <ul>
                <MemoizedFilterSliderItem
                    className={classes.costSection}
                    title={"Cost"}
                    icon={"fa:dollar"}
                    min={1}
                    max={5}
                />
                <MemoizedFilterSliderItem
                    className={classes.starsSection}
                    title={"Min. Ratings"}
                    minIcon={"material-symbols:star-outline"}
                    icon={"material-symbols:star"}
                    min={0}
                    max={5}
                />

                <MemoizedFilterSliderItem
                    className={classes.starsSection}
                    title={"Min. Reviews"}
                    minIcon={"material-symbols:star-outline"}
                    icon={"material-symbols:star"}
                    min={0}
                    max={41}
                    noIcon={true}
                    minText={"0"}
                    maxText={"40+"}
                    showValueMaxText={"40+"}
                />

            </ul>
            <h4>Sort by</h4>
            <ul>

            </ul>
        </aside>
    </>;
}

RestaurantList.propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string
}
