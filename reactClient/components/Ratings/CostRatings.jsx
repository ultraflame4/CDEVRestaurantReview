import PropTypes from "prop-types";
import {Icon} from "@iconify-icon/react";
import classes from "./Ratings.module.css";
import React from "react";


/**
 * @class CostRatingsProp
 * @property {number} rating A number from 1-5
 */

/**
 * This component displays a rating of 1-5 dollar signs
 * So if there is a rating of 3, it will display 3 dollar signs
 * @param props {CostRatingsProp}
 * @returns {React.ReactNode}
 */
export const CostRatings = (props) => {
    /**
     * @type {JSX.Element[]}
     */
    let stars = []

    // If the rating is less than 1, then we don't know the cost
    if (props.rating<1){
        return <div className={classes.costRating}>?</div>
    }

    // basically, we just add a dollar sign every loop
    for (let i = 0; i < props.rating; i++) {
        stars.push(<Icon icon={"fa:dollar"} className={classes.costRating} key={i}/>)
    }

    return stars
}

CostRatings.propTypes = {
    rating: PropTypes.number
}
