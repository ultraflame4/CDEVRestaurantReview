import {WModal} from "@/components/Modal/WModal";
import PropTypes from "prop-types";
import React, {useEffect, useRef} from "react";
import {StarRatings} from "@/components/Ratings/StarRatings";
import classes from "./ReviewsModals.module.css";
import {CreateRestaurantReview, DeleteRestaurantReview, UpdateRestaurantReview} from "@/core/api";
import authManager from "@/core/authManager";

export function EditReviewModal(props) {
    const [rating, setRating] = React.useState(props.initialRating)
    const inpRef = useRef(null)

    function onModalLoad() {
        if (inpRef.current === null) return
        inpRef.current.value = props.initialContents.replace("<br>","\n") // Change br tp actual line breaks
    }

    /**
     * @param e {React.MouseEvent}
     */
    function onSelectRating(e) {
        let rect = e.currentTarget.getBoundingClientRect()
        let x = e.clientX - rect.x
        let percent = Math.ceil(x / rect.width * 10)
        setRating(percent)
    }

    /**
     * @param e {React.MouseEvent}
     */
    function onMove(e) {
        if (e.buttons === 1) {
            onSelectRating(e)
        }
    }

    function submitReview() {
        let reviewContents = inpRef.current.value
        reviewContents = reviewContents.replace("\n","<br>")// preserve line breaks
        UpdateRestaurantReview(props.reviewId, rating, reviewContents).then((val) => {
            alert("Updated Review!")
            window.location.reload()
        }).catch((err) => {
            if (err.code === 401) {
                alert("Error! Please log in again!")
                window.location.reload()
                return
            }
            alert("Error while updating review!")
        })
    }

    return <WModal title={"Edit Review "} icon={"ic:baseline-edit"} isOpen={props.isOpen} onClose={props.onClose}
                   onAfterOpen={onModalLoad}>
        <h2 className={classes.rating}>Rating: <span onClick={onSelectRating} onMouseMove={onMove}><StarRatings
            rating={rating}/></span></h2>
        <textarea className={classes.reviewsInput} ref={inpRef}></textarea>
        <button onClick={submitReview}>Save</button>

    </WModal>
}

EditReviewModal.propTypes = {
    reviewId: PropTypes.number.isRequired,
    initialContents: PropTypes.string.isRequired,
    initialRating: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export function DeleteReviewModal(props) {
    function deleteReview() {

        DeleteRestaurantReview(props.reviewId).then((val) => {
            alert("Deleted Review!")
            window.location.reload()
        }).catch((err) => {
            if (err.code === 401) {
                alert("Error! Please log in again!")
                window.location.reload()
                return
            }
            alert("Error submitting review")
            console.error(err)
        })
    }

    return <WModal title={"Delete Review"} isOpen={props.isOpen} onClose={props.onClose}>
        <p className={"itemsCenter textRed"} style={{fontSize: "1.25rem"}}>Are you sure you want<br/>to delete this
            review?</p>
        <br/>
        <br/>

        <button onClick={deleteReview} className={"btn-danger"}>Delete</button>
    </WModal>
}

DeleteReviewModal.propTypes = {
    reviewId: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export function WriteReviewModal(props) {
    const [rating, setRating] = React.useState(0)
    const inpRef = useRef(null)

    /**
     * @param e {React.MouseEvent}
     */
    function onSelectRating(e) {
        let rect = e.currentTarget.getBoundingClientRect()
        let x = e.clientX - rect.x
        let percent = Math.ceil(x / rect.width * 10)
        setRating(percent)
    }

    /**
     * @param e {React.MouseEvent}
     */
    function onMove(e) {
        if (e.buttons === 1) {
            onSelectRating(e)
        }
    }


    function submitReview() {
        let reviewContent = inpRef.current.value
        if (reviewContent.length < 20) {
            alert("Review must be at least 20 characters long")
            return
        }
        reviewContent = reviewContent.replace("\n", "<br>") // preserve line breaks

        if (rating === 0) {
            alert("Please select a rating!")
            return
        }

        CreateRestaurantReview(props.restaurantId, rating, reviewContent).then((val) => {
            alert("Review submitted!")
            window.location.reload()
        }).catch((err) => {
            if (err.code === 401) {
                alert("Error! Please log in again!")
                window.location.reload()
            }

            alert("Error submitting review")

        })

    }

    return <WModal modalId={"write-review"} title={"Write a review "} icon={"ic:baseline-edit"}>
        <h2 className={classes.rating}>Rating: <span onClick={onSelectRating} onMouseMove={onMove}><StarRatings
            rating={rating}/></span></h2>
        <textarea className={classes.reviewsInput} ref={inpRef}></textarea>
        <button onClick={submitReview}>Submit</button>
    </WModal>
}

WriteReviewModal.propTypes = {
    restaurantId: PropTypes.number.isRequired
}
