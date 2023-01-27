import PropTypes from "prop-types";
import Modal from "react-modal";
import classes from "./WModal.module.css";
import {Icon} from "@iconify-icon/react";
import {useState} from "react";
import {useWatchableValue} from "@/tools/hooks";
import {closeModal, GlobalCurrentModal} from "@/components/Modal/modalsManager";

/**
 * A wrapper for react-modal to implement some default settings and styles. and other stuff
 */
export function WModal(props) {
    const currentModal = useWatchableValue(GlobalCurrentModal)

    function onModalClose() {
        closeModal(props.modalId)
    }


    return <Modal isOpen={currentModal===props.modalId}
                  onRequestClose={onModalClose}
                  shouldCloseOnEsc={true}
                  shouldCloseOnOverlayClick={true}
                  overlayClassName={classes.ReactModal__Overlay}
                  className={classes.ReactModal__Content}
    >
        <button className={classes.CloseBtn} onClick={onModalClose}><Icon icon={"mdi:close"}/></button>
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
    children: PropTypes.node,
    title: PropTypes.string,
    icon: PropTypes.string,
    modalId: PropTypes.string.isRequired
}
