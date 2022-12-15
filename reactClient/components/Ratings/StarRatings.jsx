import PropTypes from "prop-types";
import {Icon} from "@iconify-icon/react";
import classes from "./Ratings.module.css";
import React from "react";


/**
 * @class StarRatingsProp
 * @property {number} rating A number from 1-10
 */

/**
 *
 * @param props {StarRatingsProp}
 *
 * @constructor
 */
export const StarRatings = (props) => {
    /**
     * @type {JSX.Element[]}
     */
    let stars = []
    let stars_count = props.rating / 2
    for (let i = 0; i < 5; i++) {
        if (stars_count === 0.5) {
            stars.push(<Icon icon={"material-symbols:star-half"} className={classes.starRating}/>)
        }
        else if (stars_count > 0) {
            stars.push(<Icon icon={"material-symbols:star"} className={classes.starRating}/>)
        }
        else{
            stars.push(<Icon icon={"material-symbols:star-outline"} className={classes.starRating}/>)
        }
        stars_count--;
    }

    return stars
}

StarRatings.propTypes = {
    rating: PropTypes.number
}
