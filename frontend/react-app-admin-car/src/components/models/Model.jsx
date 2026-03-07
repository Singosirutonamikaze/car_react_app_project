import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { VscChromeClose } from "react-icons/vsc";

function Model({ isOpen, onClose, title, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      open
      className="fixed inset-0 z-70 m-0 flex h-screen w-screen max-h-none max-w-none items-end justify-center border-none bg-[#010B18]/68 p-3 backdrop-blur-sm sm:items-center sm:p-4"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        aria-label="Fermer le modal"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-cyan-300/30 bg-[#031B2E]/90 shadow-2xl shadow-black/45 outline-none"
      >
        <div className="flex items-center justify-between border-b border-cyan-300/20 px-4 py-3 sm:px-5 sm:py-4">
          <h3 className="pr-4 text-base font-semibold text-slate-100 sm:text-lg">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/25 bg-[#0A2A42]/65 text-cyan-100 transition-colors duration-200 hover:border-cyan-300/60 hover:bg-cyan-500/20"
            aria-label="Fermer le modal"
          >
            <VscChromeClose className="text-lg" />
          </button>
        </div>

        <div className="max-h-[calc(100dvh-8.5rem)] overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </dialog>
  );
}

Model.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Model;
