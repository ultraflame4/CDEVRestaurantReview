import PropTypes from "prop-types";
import {useInView} from "react-intersection-observer";

/**
 * An infinite scroll element. Place this at the bottom of the page. Will call a callback when it appears to load more data
 * @param props {{
 *     loadMore:()=>void
 * }}
 * @return {JSX.Element}
 * @constructor
 */
export function InfiniteScroll(props){
    const {ref} = useInView({
        threshold:0,
        onChange:(inView)=>{if (inView) props.loadMore?.()}
    });
    return <div ref={ref}>test</div>
}

InfiniteScroll.propTypes = {
    loadMore: PropTypes.func
}
