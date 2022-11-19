import PropTypes from "prop-types";
import classes from "./Restaurant.module.css"

export const RestaurantList = (props )=>{
    return <div className={props.className??""}>
        <h1 className={classes.title}>
            {props.title}
        </h1>
    </div>
}

RestaurantList.propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string
}
