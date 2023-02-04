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
import authManager from "@/core/authManager";
import {PhotosModal, WriteReviewModal} from "@/components/Reviews/ReviewsModals";
import {GetMapEmbedUrl} from "@/tools/utils";
import ReviewsList from "@/components/Reviews/ReviewsList";


/**
 * Represents a single restaurant info item (eg. location, phone number, etc.)
 * @param props
 * @return {JSX.Element}
 */
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

/**
 * Details page for a restaurant
 */
export default defComponent((props) => {
    const params = useParams()
    const restaurantId = parseInt(params.id)
    const [data, setData] = useState(null)
    const [showPhotos, setShowPhotos] = useState(false)
    const usrCtx = useContext(UserAccountContext)

    // Callback function to load more reviews
    async function loadMoreReviews(start) {
        let value = await GetRestaurantReviews(restaurantId, start)
        let allShown = false
        if (value.length === 0) {
            allShown = true
        }
        return {reviews:value, allShown:allShown}

    }

    useEffect(() => {
        // On mount, set the page title to "Loading..."
        document.title = "RestauRants - Loading..."
        // Get restaurant details
        GetRestaurantById(restaurantId)
            .then(value => {
                // set timeout here cuz idk why but it doesn't work without it
                setTimeout(() => {
                    // Set the page title to the restaurant name
                    document.title = `RestauRants - ${value.name}`
                }, 0)
                // Set the data
                setData(value)
            })

    }, [restaurantId])

    if (data === null) { // If data is null, show a loading spinner
        return <div><InfiniteScroll/></div>
    }

    // Callback function to show the Write review modal
    function onWriteReview() {
        if (usrCtx === null) { // if user is not signed in, show the sign in modal
            showModal("signin")
                .then(value => {
                    if (authManager.isLoggedIn.value) {
                        return showModal("write-review") // if user is signed in, show the write review modal
                    }
                    // if user is not signed in, show an error message
                    return Promise.reject("Cannot show write review modal. User is not logged in.")
                })
                .catch(reason => {
                    // log error message
                    console.error(reason)
                })
            return
        }
        // if user is already logged in, show the write review modal
        showModal("write-review")
    }

    return (<div>
        <main className={classes.main}>
            <WriteReviewModal restaurantId={restaurantId}/>
            {
                data.photo_url?.length > 2 && // No show the photos modal if there are less than 2 photos
                <PhotosModal isOpen={showPhotos} pictures={data.photo_url} onClose={()=>setShowPhotos(false)}/>
            }

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
                <ReviewsList loadMore={loadMoreReviews}/>
            </div>
            <div>
                <div className={classes.photos}>
                    {    data.photo_url?.length > 0 &&
                        <img src={data.photo_url[0]} alt={"An image of the restaurant"}/>
                    }
                    {   data.photo_url?.length > 1 &&
                        <img src={data.photo_url[1]} alt={"An image of the restaurant"}/>
                    }
                    {
                        data.photo_url?.length > 2 && // Dont show the button if there are less than 3 photos
                        <button onClick={()=>setShowPhotos(true)}>
                            <img src={data.photo_url[2]} alt={"An image of the restaurant"}/>
                            <p>See all {data.photo_url.length}</p>
                        </button>
                    }
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
                <iframe frameBorder="0" scrolling="no" marginHeight="0"
                        marginWidth="0"
                        className={"card"}
                        src={GetMapEmbedUrl(data.name,data.location)}>

                </iframe>

            </div>
        </main>
    </div>)
})
