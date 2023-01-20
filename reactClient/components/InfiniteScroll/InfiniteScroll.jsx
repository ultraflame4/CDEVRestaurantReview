import PropTypes from "prop-types";
import {useInView} from "react-intersection-observer";
import classes from "./InfiniteScroll.module.css";

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
        onChange:(inView)=>{if (inView) props.loadMore?.()}
    });
    if (props.hide){
        return <></>
    }

    return <div className={classes.infiniteScroll+" "+props.className??""} ref={ref} data-inview={inView}>
        <span>Loading</span>
    </div>
}

InfiniteScroll.propTypes = {
    loadMore: PropTypes.func,
    className: PropTypes.string,
    hide:PropTypes.bool

}
