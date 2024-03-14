import { useEffect, useRef } from "react";
import { handleClickAway } from "../util/dashboard";
import { ModalProps } from "../types/dashboard";

const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closePopup = () => {
      setIsOpen((prev) => !prev);
    };
    containerRef.current?.addEventListener(
      "click",
      (e) => {
        handleClickAway(e, containerRef, closePopup);
      },
      true
    );

    return () => {
      containerRef.current?.removeEventListener("click", (e) => {
        handleClickAway(e, containerRef, closePopup);
      });
    };
  }, []);

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
