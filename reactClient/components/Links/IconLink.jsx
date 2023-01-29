import React from "react";
import {Link} from "react-router-dom";
import {Icon} from "@iconify-icon/react";
import PropTypes from "prop-types";
import classes from "./Links.module.css";

/**
 * A simple component that is a link with an icon and text
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const IconLink = function (props){
    return (
        <Link to={props.to} className={`${classes.IconLinks} IconLink`}>
            <Icon icon={props.icon} className={classes.IconLinks_Icon} viewBox={"0 0 24 24"}/>
            <span>{props.text}</span>
        </Link>
    )
}

IconLink.propTypes={
    icon: PropTypes.string, // Icon to use
    to: PropTypes.string.isRequired, // Where to go when clicked
    text: PropTypes.string.isRequired // Text to display
}
