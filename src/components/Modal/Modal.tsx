import React, { useState } from 'react';
import parse from 'html-react-parser';

interface ModalProps {
  title: string;
  content: string;
  mode: string;
  isOpen: boolean;
  toggleModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, mode, isOpen, toggleModal  }) => {
  return (
    <div>

      {isOpen && (
        <div className={"modal " + mode}>
          <h2>{title}</h2>
          <p className="body">{parse(content)}</p>
          <button onClick={toggleModal}>
            Close
          </button>
        </div>
      )}

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 999 }} onClick={toggleModal} />
      )}
    </div>
  );
};

export default Modal;
