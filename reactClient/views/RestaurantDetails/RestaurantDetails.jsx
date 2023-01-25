import {defComponent} from "@/tools/define";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {GetRestaurantById, GetRestaurantReviews} from "@/api";
import "./RestaurantDetails.css"
import {InfiniteScroll} from "@/components/InfiniteScroll/InfiniteScroll";
import {StarRatings} from "@/components/Ratings/StarRatings";
import {Icon} from "@iconify-icon/react";
import {CostRatings} from "@/components/Ratings/CostRatings";
import {LineBreaker} from "@/components/LineBreaker";
import PropTypes from "prop-types";

const ReviewItem = (props) => {
    let date = new Date(props.last_edit)

    return <li>
        <div className={"review-item-head"}>
            <Icon icon={"ic:baseline-account-circle"} className={"icon"}/>
            <h4>{props.username}</h4>
            <h5>
                {date.toLocaleDateString(undefined, {dateStyle: "short"})}
                {" "}
                {date.toLocaleTimeString(undefined, {timeStyle: "short"})}
            </h5>
        </div>
        <div className={"review-item-rating"}><StarRatings rating={props.rating}/></div>
        <p><LineBreaker text={props.content} sep={"<br>"}/></p>
        <div className={"like"}>
            <Icon icon={"ic:baseline-thumb-up"} />
            <span>{props.likes}</span>
        </div>
    </li>
}

ReviewItem.propTypes = {
    username: PropTypes.string.isRequired,
    last_edit: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
}


export default defComponent((props) => {
    const params = useParams()
    const restaurantId = params.id
    const [data, setData] = useState(null)
    const [reviews, setReviews] = useState([])
    const [allReviewsShown, setAllReviewsShown] = useState(false)


    function loadMoreReviews(){
        GetRestaurantReviews(restaurantId,reviews.length)
            .then(value => {
                if (value.length===0) {
                    setAllReviewsShown(true)
                }
                setReviews(prevState => {
                    return prevState.concat(value)
                })
            })
    }

    useEffect(() => {
        GetRestaurantById(restaurantId)
            .then(value => {
                setData(value)
            })
        loadMoreReviews()
    }, [restaurantId])

    if (data === null) {
        return <div><InfiniteScroll/></div>
    }


    return (<div>
        <main>
            <div>
                <h1>{data.name}</h1>
                <StarRatings rating={parseFloat(data.avg_rating)}/>
                <div id={"other-info"}>
                    <CostRatings rating={data.cost_rating / 2}/>
                    <Icon icon={"ci:dot-03-m"}/>
                    <span>{Math.round(data.distance / 10) / 100}km</span>
                </div>
                <h2>Description</h2>
                <p id={"restaurant-desc"}>
                    <LineBreaker text={data.description} sep={"<br>"}/>
                </p>
                <div id={"reviews-header"}>
                    <h2>Reviews</h2> <Icon icon={"ic:baseline-chat"} className={"icon"}/>
                    <button>Write a review <Icon icon={"ic:baseline-edit"} className={"icon"}/></button>
                </div>
                <ul id={"reviews-list"}>
                    {
                        reviews.map((value, index) =>
                            <ReviewItem
                                username={value.username}
                                last_edit={value.last_edit}
                                rating={value.rating}
                                content={value.content}
                                likes={value.likes ?? 0}/>
                        )
                    }
                    <InfiniteScroll loadMore={loadMoreReviews} hide={allReviewsShown}/>
                </ul>
            </div>
            <div>
                <div className={"restaurant-photos"}>
                    <img src={data.photo_url[0]} alt={"An image of the restaurant"}/>
                    <img src={data.photo_url[1]} alt={"An image of the restaurant"}/>
                    <button>
                        <img src={data.photo_url[2]} alt={"An image of the restaurant"}/>
                        <p>{data.photo_url.length-3}+</p>
                    </button>
                </div>


            </div>
        </main>
    </div>)
})
