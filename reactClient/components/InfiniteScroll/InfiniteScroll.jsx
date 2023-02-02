import PropTypes from "prop-types";
import {useInView} from "react-intersection-observer";
import classes from "./InfiniteScroll.module.css";
import {useEffect} from "react";

/**
 * An infinite scroll element. Place this at the bottom of the page. Will call a callback when it appears to load more data
 * @param props {{
 *     loadMore:()=>void
 * }}
 * @return {JSX.Element}
 * @constructor
 */
export function InfiniteScroll(props){
    const {ref,inView} = useInView({
        threshold:0,
        // When the element is scrolled into view, call the loadMore callback to tell the parent component to load more things
        onChange:(inView)=>{if (inView) props.loadMore?.()}
    });
    // If the parent component wants to hide the infinite scroll eg. cuz all things have loaded, return an empty element
    if (props.hide){
        return <></>
    }

    // Else give a loading text
    return <div className={classes.infiniteScroll+" "+props.className??""} ref={ref} data-inview={inView}>
        <span>Loading</span>
    </div>
}

InfiniteScroll.propTypes = {
    loadMore: PropTypes.func,
    className: PropTypes.string,
    hide:PropTypes.bool

}
