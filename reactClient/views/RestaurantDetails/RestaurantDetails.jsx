import {defComponent} from "@/tools/define";
import {useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {GetRestaurantById, GetRestaurantReviews} from "@/core/api";
import "./RestaurantDetails.module.css"
import {InfiniteScroll} from "@/components/InfiniteScroll/InfiniteScroll";
import {StarRatings} from "@/components/Ratings/StarRatings";
import {Icon} from "@iconify-icon/react";
import {CostRatings} from "@/components/Ratings/CostRatings";
import {LineBreaker} from "@/components/LineBreaker";
import PropTypes from "prop-types";
import classes from "./RestaurantDetails.module.css";
import {UserAccountContext} from "@/tools/contexts";
import {showModal} from "@/components/Modal/modalsManager";
import {WModal} from "@/components/Modal/WModal";
import authManager from "@/core/authManager";

const ReviewItem = (props) => {
    let date = new Date(props.last_edit)

    return <li>
        <div className={classes.reviewItemHead}>
            <Icon icon={"ic:baseline-account-circle"} className={classes.icon}/>
            <h4>{props.username}</h4>
            <h5>
                {date.toLocaleDateString(undefined, {dateStyle: "short"})}
                {" "}
                {date.toLocaleTimeString(undefined, {timeStyle: "short"})}
            </h5>
        </div>
        <div className={classes.reviewItemRating}><StarRatings rating={props.rating}/></div>
        <p><LineBreaker text={props.content} sep={"<br>"}/></p>
        <div className={classes.like}>
            <Icon icon={"ic:baseline-thumb-up"}/>
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


const RestaurantInfoItem = (props) => {
    if (props.hide) {
        return <></>
    }
    return <div className={classes.restaurantInfoItem}>
        <Icon icon={props.icon} className={classes.icon}/>
        <h3>
            {props.title}
        </h3>
        <p>{props.children}</p>
    </div>
}

RestaurantInfoItem.propTypes = {
    children: PropTypes.node,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    hide: PropTypes.bool
}


export function WriteReviewModal(props) {
    return <WModal modalId={"write-review"} title={"Write a review "} icon={"ic:baseline-edit"}>

    </WModal>
}
WriteReviewModal.propTypes = {
    restaurantId: PropTypes.number.isRequired
}


export default defComponent((props) => {
    const params = useParams()
    const restaurantId = params.id
    const [data, setData] = useState(null)
    const [reviews, setReviews] = useState([])
    const [allReviewsShown, setAllReviewsShown] = useState(false)
    const usrCtx = useContext(UserAccountContext)


    function loadMoreReviews() {
        GetRestaurantReviews(restaurantId, reviews.length)
            .then(value => {
                if (value.length === 0) {
                    setAllReviewsShown(true)
                }
                setReviews(prevState => {
                    return prevState.concat(value)
                })
            })
    }

    useEffect(() => {
        document.title = "RestauRants - Loading..."
        GetRestaurantById(restaurantId)
            .then(value => {
                setTimeout(() => {
                    document.title = `RestauRants - ${value.name}`
                }, 0)
                setData(value)
            })
        loadMoreReviews()
    }, [restaurantId])

    if (data === null) {
        return <div><InfiniteScroll/></div>
    }


    function onWriteReview() {
        if (usrCtx === null) {
            showModal("signin")
                .then(value => {
                    if (authManager.isLoggedIn.value){
                        return showModal("write-review")
                    }
                    return Promise.reject("Cannot show write review modal. User is not logged in.")
                })
                .catch(reason => {
                    console.error(reason)
                })
                .then(value => {
                    console.log("TSET")
                })

        }
    }

    return (<div>
        <main className={classes.main}>
            <WriteReviewModal restaurantId={restaurantId}/>

            <div>
                <h1>{data.name}</h1>
                <StarRatings rating={parseFloat(data.avg_rating)}/>
                <div className={classes.otherInfo}>
                    <CostRatings rating={data.cost_rating / 2}/>
                    <Icon icon={"ci:dot-03-m"}/>
                    <span>{Math.round(data.distance / 10) / 100}km</span>
                </div>
                <h2>Description</h2>
                <p className={classes.restaurantDesc}>
                    <LineBreaker text={data.description} sep={"<br>"}/>
                </p>
                <div className={classes.reviewsHeader}>
                    <h2>Reviews</h2> <Icon icon={"ic:baseline-chat"} className={classes.icon}/>
                    <button onClick={onWriteReview}>Write a review <Icon icon={"ic:baseline-edit"}
                                                                         className={classes.icon}/></button>
                </div>
                <ul className={classes.reviewsList}>
                    {
                        reviews.map((value, index) =>

                            <ReviewItem
                                key={index}
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
                <div className={classes.photos}>
                    <img src={data.photo_url[0]} alt={"An image of the restaurant"}/>
                    <img src={data.photo_url[1]} alt={"An image of the restaurant"}/>
                    <button>
                        <img src={data.photo_url[2]} alt={"An image of the restaurant"}/>
                        <p>See all {data.photo_url.length}</p>
                    </button>
                </div>
                <aside className={"card"}>
                    <RestaurantInfoItem icon={"mdi:link-variant"} title={"Website"} hide={!data.website}>
                        <a href={data.website} target={"_blank"}>{data.website}</a>
                    </RestaurantInfoItem>
                    <RestaurantInfoItem icon={"ic:baseline-local-phone"} title={"Phone number"} hide={!data.phone_no}>
                        {data.phone_no}
                    </RestaurantInfoItem>
                    <RestaurantInfoItem icon={"ic:directions"} title={"Location"} hide={!data.location}>
                        {data.location}
                    </RestaurantInfoItem>
                </aside>

            </div>
        </main>
    </div>)
})
