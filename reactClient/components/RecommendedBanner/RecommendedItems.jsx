import React, {useEffect, useState} from "react";
import {GetRestaurantRecentReviews} from "@/core/api";

import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import classes from "./RecommendedItems.module.css";

export function RecommendedNearbyItem(props) {

    const [recentReviews, setRecentReviews] = useState([])

    useEffect(() => {
        GetRestaurantRecentReviews(props.id).then(reviews => {
            setRecentReviews(reviews)
        })
    }, [props.id])

    return (
        <li  className={`${classes.nearbyItem} card`}>
            <Link to={`/restaurant/${props.id}`}>

            </Link>
        </li>
    )

}
RecommendedNearbyItem.propType = {
    id: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    cost: PropTypes.number.isRequired,
    desc: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    reviews_count: PropTypes.number.isRequired,
    hidden: PropTypes.bool.isRequired
}
