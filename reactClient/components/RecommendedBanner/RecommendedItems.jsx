import React, {useEffect, useState} from "react";
import {GetRestaurantRecentReviews} from "@/core/api";

import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import classes from "./RecommendedItems.module.css";
import {StarRatings} from "@/components/Ratings/StarRatings";
import {LineBreaker} from "@/components/LineBreaker";
import {Icon} from "@iconify-icon/react";
import {CostRatings} from "@/components/Ratings/CostRatings";

export function RecommendedNearbyItem(props) {

    const [recentReview, setRecentReview] = useState("")

    useEffect(() => {
        GetRestaurantRecentReviews(props.id, 1).then(reviews => {
            console.log(reviews)
            setRecentReview(reviews[0]?.content ?? "No reviews yet")
        })
    }, [props.id])

    return (
        <li className={`${classes.nearbyItem} card`}>
            <Link to={`/restaurant/${props.id}`}>
                <img src={props.imageSrc}/>
                <div className={classes.nearbyItemInfoCtn}>
                    <h3>{props.name}</h3>
                    <div className={classes.nearbyItemRating}><span>{props.reviews_count}</span><StarRatings
                        rating={props.rating}/></div>

                    {/*Tags here*/}
                    <ul className={classes.restaurant_tagslist}>
                        { // For each tag given in the tag list in props, create a li for it
                            props.tags?.map((tagname, tagindex) => {
                                return (<li key={tagindex}>
                                    {tagname}
                                </li>)
                            })
                        }
                    </ul>
                    <p>
                        <LineBreaker text={props.desc} sep={"<br>"}/>
                    </p>
                    <div className={classes.review}>
                        <Icon icon={"ic:chat"} className={classes.reviewIcon}/>
                        <p>
                            <LineBreaker text={recentReview} sep={"<br>"}/>
                        </p>
                        <span/>
                    </div>
                    <span className={classes.nearbyItemCost}><CostRatings rating={props.cost}/></span>
                    <span className={classes.nearbyItemDistance}>{props.distance}km</span>


                </div>
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

export function RecommendedPopularItem(props) {
    return (<li className={`${classes.topRatedItem}`}>
        <Link to={`/restaurant/${props.id}`}>

            <img src={props.imageSrc}/>

            <h3>{props.name}</h3>
            <span><StarRatings rating={props.rating}/> </span>
            {/*Tags here*/}
            <ul className={classes.restaurant_tagslist}>
                { // For each tag given in the tag list in props, create a li for it
                    props.tags?.map((tagname, tagindex) => {
                        return (<li key={tagindex}>
                            {tagname}
                        </li>)
                    })
                }
            </ul>
            <span><CostRatings rating={props.cost}/> </span>
        </Link>
    </li>)
}

RecommendedPopularItem.propType = {
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
