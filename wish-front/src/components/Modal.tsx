import { useEffect, useRef } from "react";
import { ModalProps } from "../types/dashboard";
import { handleClickAway } from "../util/dashboard";

const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closePopup = () => {
      setIsOpen(false);
    };

    const handleDocumentClick = (e: MouseEvent) => {
      handleClickAway(e, containerRef, closePopup);
    };

    if (isOpen) {
      document.addEventListener("click", handleDocumentClick, true);
    } else {
      document.removeEventListener("click", handleDocumentClick, true);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="mdl">
      <div>
        <div ref={containerRef} className="mdl-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
