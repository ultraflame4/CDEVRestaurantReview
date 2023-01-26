import PropTypes from "prop-types";
import Modal from "react-modal";
import classes from "./WModal.module.css";

/**
 * A wrapper for react-modal to implement some default settings
 */
export function WModal(props) {
    return <Modal isOpen={props.isOpen}
                  onRequestClose={props.onRequestClose}
                  shouldCloseOnEsc={true}
                  shouldCloseOnOverlayClick={true}
                  overlayClassName={classes.ReactModal__Overlay}
                  className={classes.ReactModal__Content}
    >
        {props.children}</Modal>
}

WModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    children: PropTypes.node,
}
