import PropTypes from "prop-types";

/**
 * This react component converts line breaks in a string ('\n' unless specified) into actual line breaks in the html document
 */
export function LineBreaker(props){
    let sep = "\n"
    if (props.sep){
        sep=props.sep
    }

    return (<>
        {
            props.text.split(sep).map((value, index) => {
                if (index===0){
                    return <span key={index}>{value}</span>
                }
                return <span key={index}><br/><br/>{value}</span>
            })
        }
    </>)

}

LineBreaker.propTypes={
    text:PropTypes.string.isRequired,
    sep:PropTypes.string
}
