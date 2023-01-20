import PropTypes from "prop-types";
import {Icon} from "@iconify-icon/react";
import classes from "./Ratings.module.css";
import React from "react";


/**
 * @class CostRatingsProp
 * @property {number} rating A number from 1-5
 */

/**
 *
 * @param props {CostRatingsProp}
 *
 * @constructor
 */
export const CostRatings = (props) => {
    /**
     * @type {JSX.Element[]}
     */
    let stars = []

    if (props.rating<1){
        return <div className={classes.costRating}>?</div>
    }

    for (let i = 0; i < props.rating; i++) {
        stars.push(<Icon icon={"fa:dollar"} className={classes.costRating}/>)
    }

    return stars
}

CostRatings.propTypes = {
    rating: PropTypes.number
}
