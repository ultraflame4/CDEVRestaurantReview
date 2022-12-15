import PropTypes, {func, number} from "prop-types";
import classes from "./Restaurant.module.css"
import {InputRangeSlider} from "@/components/InputRangeSlider/InputRangeSlider";
import {Icon} from "@iconify-icon/react";
import React, {useRef, useState} from "react";
import {GetRestaurants} from "@/api";
import {StarRatings} from "@/components/StarRatings/StarRatings";

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

    function callback(value, min, max) {
        setValueText(value !== max ? value : (props.showValueMaxText ?? value))
        props.callback?.(value, min, max)
    }

    return (
        <li className={props.className}>
            <h5>{props.title}</h5>
            {
                !props.showValue ? "" :
                    <span className={classes.filterRangeSliderValue}>
                        {valueText}
                        {
                            props.showValueIcon ?
                                <Icon icon={props.showValueIcon} className={classes.icon}/> :
                                ""
                        }
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


const RestaurantListItem = (props) => {

    return (
        <li className={classes.restaurantListContentItem + " card"}>
            <div className={classes.restaurantListContentItem_Head}>
                <h3 className={classes.restaurantListContentItem_Name}>
                    {props.name}
                </h3>

                {/*Tags here*/}
                <ul className={classes.restaurant_tagslist}>
                    {
                        props.tags.map((tagname, tagindex) => {
                            return (
                                <li key={tagindex}>
                                    {tagname}
                                </li>
                            )
                        })
                    }
                </ul>
                <StarRatings rating={props.rating}/>
            </div>
            <p className={classes.restaurant_desc}>
                {props.desc}
            </p>
            <img className={classes.restaurant_banner_img} title={"Image of the restaurant"} src={props.imageSrc}/>

        </li>
    )
}

RestaurantListItem.propType = {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    desc: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
}

const RestaurantListContents = (props) => {
    return (<ul className={classes.restaurantListContent}>
        {
            GetRestaurants(10).map((value, index) =>
                <RestaurantListItem key={index}
                                    tags={value.tags}
                                    rating={value.rating}
                                    name={value.name}
                                    desc={value.desc}
                                    imageSrc={value.bannerSrc}
                />
            )
        }
    </ul>)
}

export const RestaurantList = (props) => {
    return <div className={classes.RestaurantList}>
        <h1 className={classes.title}>
            {props.title}
        </h1>
        <aside className={`card ${classes.filterpanel}`}>
            <h4>Filters</h4>
            <ul>
                <FilterSliderItem
                    className={classes.costSection}
                    title={"Cost"}
                    icon={"fa:dollar"}
                    min={1}
                    max={5}
                />
                <FilterSliderItem
                    className={classes.starsSection}
                    title={"Min. Ratings"}
                    minIcon={"material-symbols:star-outline"}
                    icon={"material-symbols:star"}
                    showValueIcon={"material-symbols:star"}
                    min={0}
                    max={5}
                    showValue={true}

                />

                <FilterSliderItem
                    className={classes.reviewsSection}
                    title={"Min. Reviews"}
                    minIcon={"material-symbols:star-outline"}
                    icon={"material-symbols:star"}
                    min={0}
                    max={41}
                    noIcon={true}
                    minText={"0"}
                    maxText={"40+"}
                    showValueMaxText={"40+"}
                    showValue={true}
                    showValueIcon={"material-symbols:chat"}
                />

            </ul>
            <h4>Sort by</h4>
        </aside>
        <RestaurantListContents/>
    </div>;
}

RestaurantList.propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string
}
