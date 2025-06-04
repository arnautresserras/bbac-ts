import React, { useState } from "react";
import parse from "html-react-parser";

interface ModalProps {
  title: string;
  content: string;
  mode: string;
  isOpen: boolean;
  hideModal: () => void;
  primaryActionText: string;
  onClose?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  mode,
  isOpen,
  hideModal,
  primaryActionText,
  onClose,
  secondaryActionText,
  onSecondaryAction,
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    hideModal();
  };

  const handleSecondaryAction = () => {
    if(onSecondaryAction) {
      onSecondaryAction();
    }
    hideModal();
  }

  return (
    <div>
      {isOpen && (
        <div className={"modal " + mode}>
          <h2>{title}</h2>
          <p className="body">{parse(content)}</p>
          <div className="modal-buttons">
            <button onClick={handleClose}>{primaryActionText}</button>
            {secondaryActionText && (
              <button onClick={handleSecondaryAction}>
                {secondaryActionText}
              </button>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 999,
          }}
          onClick={handleClose}
        />
      )}
    </div>
  );
};

export default Modal;
