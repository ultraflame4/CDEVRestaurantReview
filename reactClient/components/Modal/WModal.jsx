import PropTypes from "prop-types";
import Modal from "react-modal";
import classes from "./WModal.module.css";
import {Icon} from "@iconify-icon/react";

/**
 * A wrapper for react-modal to implement some default settings and styles. and other stuff
 */
export function WModal(props) {
    return <Modal isOpen={props.isOpen}
                  onRequestClose={props.onClose}

                  shouldCloseOnEsc={true}
                  shouldCloseOnOverlayClick={true}
                  overlayClassName={classes.ReactModal__Overlay}
                  className={classes.ReactModal__Content}
    >
        <button className={classes.CloseBtn} onClick={props.onClose}><Icon icon={"mdi:close"}/></button>
        <h1>
            {props.title}
            {props.icon && <Icon icon={props.icon}/>}
        </h1>
        <div>
            {props.children}
        </div>
    </Modal>
}

WModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    title: PropTypes.string,
    icon: PropTypes.string
}
