import React, {ReactElement, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../types/util.types";
import { toggleModalAction, addModalAction } from "../../actions/ui.actions";

type ConfirmationModalProps = {
    modalId: string;
    modalName: string;
    modalTitle: string;
    modalQuestion: string;
    modalConfirmText?: string;
    modalCancelText?: string;
    onConfirm: ()=> void
    onCancel?: ()=> void
}

export default function ConfirmationModal(props: ConfirmationModalProps): ReactElement {
    const modals = useSelector((state: AppState) => state.ui.modals) || [];
    const show = modals.length ? modals.filter((modal)=>modal.name===props.modalName)[0].show : false;
    const dispatch = useDispatch();

    const closeModal = () => {
        dispatch(toggleModalAction(props.modalName,false));
    };

    useEffect(()=>{
        // $("#" + props.modalId).modal("toggle");
        dispatch(addModalAction(props.modalName));
    },[]);

    useEffect(()=>{
        if (show) {
            $("#" + props.modalId).modal("toggle");
        }
    },[show]);

    return <React.Fragment>
        <div className="modal fade in" id={props.modalId} role="dialog" aria-labelledby={props.modalName} 
            aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">
                            {props.modalTitle}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <span>{props.modalQuestion}</span>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn buy-button" data-dismiss="modal" 
                            onClick={()=>{closeModal(); if(props.onCancel) {props.onCancel();}}}>
                            {props.modalCancelText ? props.modalCancelText : "Cancel"}
                        </button>
                        <button type="button" className="btn sell-button" data-dismiss="modal" 
                            onClick={()=>{closeModal(); props.onConfirm();}}>
                            {props.modalConfirmText ? props.modalConfirmText : "Yes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>;
}