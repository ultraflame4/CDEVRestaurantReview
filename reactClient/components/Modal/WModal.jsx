import PropTypes from "prop-types";
import Modal from "react-modal";
import classes from "./WModal.module.css";
import {Icon} from "@iconify-icon/react";
import {useState} from "react";
import {useWatchableValue} from "@/tools/hooks";
import {closeModal, GlobalCurrentModal} from "@/components/Modal/modalsManager";


/**
 * @class WModalProps
 * @property {string?} title The title of the modal
 * @property {string?} icon Optional icon beside the title of the modal
 * @property {string?} modalId The id of the modal. Set if you want to use showModal to open the modal [Optional]
 * @property {boolean?} isOpen If true, the modal will be open. [Optional]
 * @property {function?} onClose A function to be called when the modal closes. If not using modalId, this callback must be set to change the isOpen prop to close the modal[Optional]
 * @property {React.ReactNode?} children Children of the modal
 */

/**
 *
 * A wrapper for react-modal to implement some default settings and styles. and other stuff
 * @param props {WModalProps}
 */
export function WModal(props) {
    // Get the current modal that should be shown from the modalsManager
    const currentModal = useWatchableValue(GlobalCurrentModal)

    function onModalClose() {
        // To close the modal, if we are using the modalId, then call the closeModal function from the modalsManager.
        if (props.modalId) {
            closeModal(props.modalId)
        }
        // Call close callback if set
        props.onClose?.()
    }

    return <Modal isOpen={(currentModal === props.modalId || props.isOpen)} // If the current modal is this modal, or the isOpen prop is true, then show the modal
                  onRequestClose={onModalClose}
                  shouldCloseOnEsc={true}
                  shouldCloseOnOverlayClick={true}
                  overlayClassName={classes.ReactModal__Overlay}
                  className={classes.ReactModal__Content}
                  onAfterOpen={props.onAfterOpen}
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
    modalId: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onAfterOpen: PropTypes.func
}
