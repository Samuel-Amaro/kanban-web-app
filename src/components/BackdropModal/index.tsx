import React, { useRef } from "react";
import "./BackdropModal.css";

type PropsBackdropModal = {
  children: React.ReactNode;
  onHandleOpenModal: () => void;
};

export default function BackdropModal({
  children,
  onHandleOpenModal,
}: PropsBackdropModal) {
  const refBackdropModal = useRef<HTMLDivElement | null>(null);

  function handlePointerDownBackdropModal(
    e: React.PointerEvent<HTMLDivElement>
  ) {
    if (
      refBackdropModal.current?.contains(e.target as Node) &&
      (refBackdropModal.current as HTMLDivElement) !== e.target
    ) {
      return;
    }
    onHandleOpenModal();
  }

  return (
    <div
      id="backdrop-board-modal"
      className="backdrop-modal"
      ref={refBackdropModal}
      onPointerDown={handlePointerDownBackdropModal}
    >
      {children}
    </div>
  );
}
