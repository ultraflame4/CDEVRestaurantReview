import PropTypes from "prop-types";
import {decode} from "html-entities";

/**
 * This react component converts line breaks in a string ('\n' unless specified) into actual line breaks in the html document
 * It also reformats html entities (character codes) into actual characters.
 */
export function LineBreaker(props){
    let sep = "\n"
    if (props.sep){
        sep=props.sep
    }

    return (<>
        {
            // decode html entities first
            decode(props.text)
                //Split into a list and loop through
                .split(sep)
                .map((value, index) => {
                if (index===0){
                    return <span key={index}>{value}</span>
                }
                return <span key={index}><br/>{value}</span>
            })
        }
    </>)

}

LineBreaker.propTypes={
    text:PropTypes.string.isRequired,
    sep:PropTypes.string
}
