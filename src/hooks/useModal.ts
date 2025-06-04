import { useState } from "react";
import { ModalType } from "../types/modalType";

export function useModal() {
  const [visible, setVisible] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string>("");
  const [mode, setMode] = useState<ModalType>(ModalType.Info);
  const [primaryText, setPrimaryText] = useState("");
  const [onClose, setOnClose] = useState<(() => void) | undefined>();
  const [secondaryText, setSecondaryText] = useState<string | undefined>();
  const [onSecondary, setOnSecondary] = useState<(() => void) | undefined>();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const setModalContent = (newTitle: string, newText: string, newMode: ModalType) => {
    setTitle(newTitle);
    setContent(newText);
    setMode(newMode);
  };

  const shouldHideHand = (modalType: ModalType | null): boolean => {
    return modalType === ModalType.TurnEnd || modalType === ModalType.GameEnd;
  }

  const setPrimaryAction = (text: string, callback?: () => void) => {
    setPrimaryText(text);
    setOnClose(() => callback);
  };

  const clearPrimaryAction = () => setPrimaryAction("Close");

  const setSecondaryAction = (text?: string, callback?: () => void) => {
    setSecondaryText(text);
    setOnSecondary(() => callback);
  };

  const clearSecondaryAction = () => setSecondaryAction(undefined);

  return {
    modalProps: {
      title,
      content,
      mode,
      isOpen: visible,
      hideModal,
      primaryActionText: primaryText,
      onClose,
      secondaryActionText: secondaryText,
      onSecondaryAction: onSecondary,
    },
    showModal,
    hideModal,
    shouldHideHand,
    setModalContent,
    setPrimaryAction,
    clearPrimaryAction,
    setSecondaryAction,
    clearSecondaryAction
  };
}
