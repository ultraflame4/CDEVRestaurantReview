import PropTypes from "prop-types";
import {Icon} from "@iconify-icon/react";
import classes from "./Ratings.module.css";
import React from "react";


/**
 * @class StarRatingsProp
 * @property {number} rating A number from 1-10
 */

/**
 * Similar to CostRatings, but uses stars instead of dollar signs and the number is from 1-10 instead of 1-4
 * @param props {StarRatingsProp}
 * @returns {React.ReactNode}
 */
export const StarRatings = (props) => {
    /**
     * @type {JSX.Element[]}
     */
    let stars = []

    // number of stars left to display
    let stars_count = props.rating / 2

    // Loop 5 times to display 5 stars
    for (let i = 0; i < 5; i++) {
        // If the no of stars less than 1, then we need to display a half star
        console.log(stars_count)
        if (stars_count < 1) {
            stars.push(<Icon key={i} icon={"material-symbols:star-half"} className={classes.starRating}/>)
        }
        // If the no of stars left is greater than 0, then we need to display a full star
        else if (stars_count > 0) {
            stars.push(<Icon key={i} icon={"material-symbols:star"} className={classes.starRating}/>)
        }
        // If no more stars left, then we need to display an empty star
        else{
            stars.push(<Icon key={i} icon={"material-symbols:star-outline"} className={classes.starRating}/>)
        }
        stars_count--;
    }

    return stars
}

StarRatings.propTypes = {
    rating: PropTypes.number
}
