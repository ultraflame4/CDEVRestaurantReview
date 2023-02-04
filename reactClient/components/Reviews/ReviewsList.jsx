import React, {useContext, useState} from "react";
import classes from "./ReviewsList.module.css";
import {Icon} from "@iconify-icon/react";
import {DeleteReviewModal, EditReviewModal} from "@/components/Reviews/ReviewsModals";
import {StarRatings} from "@/components/Ratings/StarRatings";
import {LineBreaker} from "@/components/LineBreaker";
import PropTypes from "prop-types";
import {UserAccountContext} from "@/tools/contexts";
import {InfiniteScroll} from "@/components/InfiniteScroll/InfiniteScroll";

/**
 * Represents a single review
 * @param props
 * @return {JSX.Element}
 */
export const ReviewItem = (props) => {
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
 * @class ReviewsListProps
 * @property {(start) => Promise<{reviews:DBReviewType[],allShown:boolean}>} loadMore // Callback function to load more reviews
 */
/**
 * This component displays a list of reviews
 * @param props {ReviewsListProps}
 * @constructor
 */
export default function ReviewsList(props) {
    const [reviews, setReviews] = useState([])
    const [allReviewsShown, setAllReviewsShown] = useState(false)
    const usrCtx = useContext(UserAccountContext)

    // Callback function to load more reviews
    function loadMoreReviews() {
        props.loadMore(reviews.length).then(({reviews, allShown}) => {
            setReviews(prevState => prevState.concat(reviews))
            setAllReviewsShown(allShown)
        })
    }



    return <ul className={classes.reviewsList}>
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
};

ReviewsList.propTypes = {
    loadMore: PropTypes.func.isRequired, // Callback function to load more reviews
}
