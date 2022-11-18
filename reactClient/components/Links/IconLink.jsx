import React from "react";
import {Link} from "react-router-dom";
import {Icon} from "@iconify-icon/react";
import PropTypes from "prop-types";
import classes from "./Links.module.css";

export const IconLink = function (props){
    return (
        <Link to={props.to} className={`${classes.IconLinks} IconLink`}>
            <Icon icon={props.icon} className={classes.IconLinks_Icon} viewBox={"0 0 24 24"}/>
            <span>{props.text}</span>
        </Link>
    )
}

IconLink.propTypes={
    icon: PropTypes.string,
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
}
