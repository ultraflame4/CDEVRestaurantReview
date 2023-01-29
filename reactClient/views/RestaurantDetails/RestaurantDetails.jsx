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
import {DeleteReviewModal, EditReviewModal, WriteReviewModal} from "@/views/RestaurantDetails/ReviewsModals";

/**
 * Represents a single review
 * @param props
 * @return {JSX.Element}
 */
const ReviewItem = (props) => {
    // 0 = delete, 1 = edit
    const [currentModal, setCurrentModal] = useState(null)
    let date = new Date(props.last_edit)

    function deleteReview() {
        // open delete review modal
        setCurrentModal(0)
    }

    function editReview() {
        // Open edit review modal
        setCurrentModal(1)
    }

    function closeModals() {
        // Close all modals
        setCurrentModal(null)
    }

    return <li>

        {
            props.editable && // Only show edit/delete buttons if the review is editable
            <div className={classes.editReviewContainer}>
                <button onClick={editReview}>Edit Review <Icon icon={"ic:baseline-edit"}/></button>
                <button onClick={deleteReview}><Icon icon={"ic:baseline-delete-forever"}/></button>
                <DeleteReviewModal reviewId={props.reviewId} isOpen={currentModal === 0} onClose={closeModals}/>
                <EditReviewModal
                    reviewId={props.reviewId}
                    isOpen={currentModal === 1}
                    onClose={closeModals}
                    initialContents={props.content}
                    initialRating={props.rating}/>
            </div>
        }

        <div className={classes.reviewItemHead}>
            <Icon icon={"ic:baseline-account-circle"} className={classes.icon}/>
            <h4>{props.username}</h4>
            <h5>
                {/*Format the timestamp of the review last edit date*/}
                {date.toLocaleDateString(undefined, {dateStyle: "short"})}
                {" "}
                {date.toLocaleTimeString(undefined, {timeStyle: "short"})}
            </h5>
        </div>
        {/*Show the review rating*/}
        <div className={classes.reviewItemRating}><StarRatings rating={props.rating}/></div>
        {/*Review contents*/}
        <p><LineBreaker text={props.content} sep={"<br>"}/></p>
        {/*Like button*/}
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
    reviewId: PropTypes.number.isRequired,
    editable: PropTypes.bool.isRequired
}

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
    const [reviews, setReviews] = useState([])
    const [allReviewsShown, setAllReviewsShown] = useState(false)
    const usrCtx = useContext(UserAccountContext)

    // Callback function to load more reviews
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
        // Load the first couple of reviews
        loadMoreReviews()
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
                                likes={value.likes ?? 0}
                                reviewId={value.id}
                                editable={value.author_id === usrCtx?.userId}
                            />
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
