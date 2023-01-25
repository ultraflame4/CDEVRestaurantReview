import PropTypes, {func, number} from "prop-types";
import classes from "./Restaurant.module.css"

import {Icon} from "@iconify-icon/react";
import React, {useEffect, useRef, useState} from "react";
import {StarRatings} from "@/components/Ratings/StarRatings";
import {CostRatings} from "@/components/Ratings/CostRatings";
import {LineBreaker} from "@/components/LineBreaker";
import {FilterSidepanel} from "@/components/Restaurant/SidePanelFilter";
import {GetRestaurants} from "@/api";
import {InfiniteScroll} from "@/components/InfiniteScroll/InfiniteScroll";
import {useNavigate} from "react-router-dom";

const RestaurantListItem = (props) => {
    const navigate = useNavigate();

    return (<li className={classes.restaurantListContentItem + " card"} onClick={()=>navigate(`/restaurant/${props.id}`)}>
        <div className={classes.restaurantListContentItem_Head}>
            <h3 className={classes.restaurantListContentItem_Name}>
                {props.name}
            </h3>

            {/*Tags here*/}
            <ul className={classes.restaurant_tagslist}>
                {props.tags?.map((tagname, tagindex) => {
                    return (<li key={tagindex}>
                        {tagname}
                    </li>)
                })}
            </ul>
            <div className={classes.restaurant_subInfoBar}>
                <StarRatings rating={props.rating}/>
                <Icon icon={"ci:dot-03-m"}/>
                <CostRatings rating={props.cost}/>
                <Icon icon={"ci:dot-03-m"}/>
                <span>{props.distance}km</span>
            </div>

        </div>
        <p className={classes.restaurant_desc}>
            <LineBreaker text={props.desc} sep={"<br>"}/>
        </p>
        <img className={classes.restaurant_banner_img}
             alt={`Image of restaurant ${props.name}`}
             src={props.imageSrc}/>
        <div className={classes.restaurant_recentReviews}>
            <div className={classes.restaurant_recentReviews_header}>
                <Icon icon={"ic:baseline-chat"} className={classes.icon}/>
                <h4>Recent Reviews</h4>
            </div>
        </div>
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
    distance: PropTypes.number.isRequired
}

const RestaurantListContents = (props) => {

    return (<ul className={classes.restaurantListContent}>
        {
            props.restaurants.map((value, index) =>
                <RestaurantListItem key={index}
                                    id={value.id}
                                    tags={value.tags}
                                    rating={parseFloat(value.avg_rating)}
                                    cost={value.cost_rating / 2}
                                    name={value.name}
                                    desc={value.description}
                                    imageSrc={value.photo_url}
                                    distance={Math.round(value.distance / 10) / 100} // round distance to 2 d.p.
                />)
        }
    </ul>)
}

RestaurantListContents.propTypes = {
    restaurants: PropTypes.array.isRequired
}

export const RestaurantList = (props) => {
    const [isAllLoaded,setIsAllLoaded] = useState(false)
    const [restaurants, setRestaurants] = useState([])

    function loadData() {
        setRestaurants(prevState => {
            GetRestaurants(prevState.length).then(value => {
                setRestaurants(prevState.concat(value))
                if (value.length == 0){
                    setIsAllLoaded(true)
                }
            })
            return prevState
        })
    }



    useEffect(() => {
        loadData()
    }, [props.start])


    return <div className={classes.RestaurantList}>
        <h1 className={classes.title}>
            {props.title}
        </h1>
        <FilterSidepanel/>
        <RestaurantListContents restaurants={restaurants}/>
        <InfiniteScroll loadMore={loadData} className={classes.infiniteScrollStyle} hide={isAllLoaded} />
    </div>;
}
RestaurantList.propTypes = {
    title: PropTypes.string.isRequired, className: PropTypes.string
}
