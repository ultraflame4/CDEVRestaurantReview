import PropTypes from "prop-types";

export function PageNumbers (props){


    return (
        <ul>

        </ul>
    )
}

PageNumbers.propTypes={
    total:PropTypes.number.isRequired,
    current:PropTypes.number.isRequired,
}
