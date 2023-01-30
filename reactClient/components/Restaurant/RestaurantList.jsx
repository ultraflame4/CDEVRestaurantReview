import PropTypes from "prop-types";
import classes from "./Restaurant.module.css"

import {Icon} from "@iconify-icon/react";
import React, {useEffect, useState} from "react";
import {StarRatings} from "@/components/Ratings/StarRatings";
import {CostRatings} from "@/components/Ratings/CostRatings";
import {LineBreaker} from "@/components/LineBreaker";
import {FilterSidepanel} from "@/components/Restaurant/SidePanelFilter";
import {GetRestaurants} from "@/core/api";
import {InfiniteScroll} from "@/components/InfiniteScroll/InfiniteScroll";
import {Link} from "react-router-dom";

/**
 * This component represents a single restaurant in the list
 * @param props
 * @return {React.ReactNode}
 */
const RestaurantListItem = (props) => {

    return (<li className={classes.restaurantListContentItem + " card"} data-hidden={props.hidden}>
        <Link to={`restaurant/${props.id}`}> {/*Link to restaurant page*/}

            <div className={classes.restaurantListContentItem_Head}>
                <h3 className={classes.restaurantListContentItem_Name}>
                    {props.name}
                </h3>

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
                {/*Sub info bar, the stars and cost ratings, and also the distance */}
                <div className={classes.restaurant_subInfoBar}>
                    <StarRatings rating={props.rating}/>
                    <Icon icon={"ci:dot-03-m"}/>
                    <CostRatings rating={props.cost}/>
                    <Icon icon={"ci:dot-03-m"}/>
                    <span>{props.distance}km</span>
                </div>

            </div>
            <p className={classes.restaurant_desc}>
                {/*The restaurant description. Use <br> as the line breaks, because thats how i stored them in the database*/}
                <LineBreaker text={props.desc} sep={"<br>"}/>
            </p>
            {/*The restaurant banner image*/}
            <img className={classes.restaurant_banner_img}
                 alt={`Image of restaurant ${props.name}`}
                 src={props.imageSrc}/>
            {/*Recent reveiws of the restaurants (WIP) */}
            <div className={classes.restaurant_recentReviews}>
                <div className={classes.restaurant_recentReviews_header}>
                    <Icon icon={"ic:baseline-chat"} className={classes.icon}/>
                    <h4>Recent Reviews</h4>
                </div>
            </div>

        </Link>
    </li>)
}

RestaurantListItem.propType = {
    id: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    cost: PropTypes.number.isRequired,
    desc: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    hidden: PropTypes.bool.isRequired
}

/**
 * This component represents the list of restaurants
 * @param props
 * @return {React.ReactNode}
 */
const RestaurantListContents = (props) => {

    return (<ul className={classes.restaurantListContent}>
        {
            props.restaurants.map((value, index) =>
                <RestaurantListItem
                    key={index}
                    id={value.id}
                    tags={value.tags}
                    rating={parseFloat(value.avg_rating)}
                    cost={value.cost_rating / 2}
                    name={value.name}
                    desc={value.description}
                    imageSrc={value.photo_url}
                    distance={Math.round(value.distance / 10) / 100} // round distance to 2 d.p.
                    hidden={value.cost_rating > props.maxCost*2 || value.avg_rating < props.minRating*2 || value.reviews_count < props.minReviews}
                />)
        }
    </ul>)
}

RestaurantListContents.propTypes = {
    restaurants: PropTypes.array.isRequired,
    maxCost: PropTypes.number.isRequired,
    minRating: PropTypes.number.isRequired,
    minReviews: PropTypes.number.isRequired
}
/**
 * This component represents the entire restaurant list page
 * @param props
 * @return {JSX.Element}
 */
export const RestaurantList = (props) => {
    const [isAllLoaded, setIsAllLoaded] = useState(false)
    const [restaurants, setRestaurants] = useState([])
    const [maxCost, setMaxCost] = useState(5)
    const [minRating, setMinRating] = useState(0)
    const [minReviews, setMinReviews] = useState(0)

    // Function to load more restaurants
    function loadData() {
        setRestaurants(prevState => {
            // Get more restaurants from the api using the current length of the restaurant list as the offset
            GetRestaurants(prevState.length).then(value => {
                // Concat the new restaurants to the existing list
                setRestaurants(prevState.concat(value))
                // If the api returns an empty array, then we have loaded all the restaurants
                if (value.length == 0) {
                    // Set the isAllLoaded state to true, so that the infinite scroll component is hidden
                    setIsAllLoaded(true)
                }
            })

            return prevState
        })

    }


    useEffect(() => {
        // Initially load some restaurants
        loadData()
    }, [props.start])


    return <div className={classes.RestaurantList}>
        <h1 className={classes.title}>
            {props.title}
        </h1>
        <FilterSidepanel
            maxCostChange={value => setMaxCost(value)}
            minRatingChange={value => setMinRating(value)}
            minReviewsChange={value => setMinReviews(value)}
        />
        <RestaurantListContents
            restaurants={restaurants}
            maxCost={maxCost}
            minReviews={minReviews}
            minRating={minRating}/>
        {/*on load more load more data lah*/}
        <InfiniteScroll loadMore={loadData} className={classes.infiniteScrollStyle} hide={isAllLoaded}/>
    </div>;
}
RestaurantList.propTypes = {
    title: PropTypes.string.isRequired, className: PropTypes.string
}
