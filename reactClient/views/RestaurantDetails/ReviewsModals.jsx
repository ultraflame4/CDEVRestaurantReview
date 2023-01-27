import {WModal} from "@/components/Modal/WModal";
import PropTypes from "prop-types";
import React from "react";
import {StarRatings} from "@/components/Ratings/StarRatings";
import classes from "./ReviewsModals.module.css";

export function WriteReviewModal(props) {
    const [rating, setRating] = React.useState(0)
    /**
     * @param e {React.MouseEvent}
     */
    function onSelectRating(e) {
        let rect = e.currentTarget.getBoundingClientRect()
        let x = e.clientX - rect.x
        let percent = Math.ceil(x / rect.width*10)
        setRating(percent)
    }

    /**
     * @param e {React.MouseEvent}
     */
    function onMove(e){
        if (e.buttons === 1) {
            onSelectRating(e)
        }
    }


    return <WModal modalId={"write-review"} title={"Write a review "} icon={"ic:baseline-edit"}>
        <h2 className={classes.rating}>Rating: <span onClick={onSelectRating} onMouseMove={onMove}><StarRatings rating={rating}/></span></h2>
    </WModal>
}

WriteReviewModal.propTypes = {
    restaurantId: PropTypes.number.isRequired
}
