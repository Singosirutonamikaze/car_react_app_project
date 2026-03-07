import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

function EmojiPickerPopup({ selectedEmoji, onEmojiClick }) {
  const [icon, setIcon] = useState(selectedEmoji || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedEmoji) {
      setIcon(selectedEmoji);
    }
  }, [selectedEmoji]);

  return (
    <div className="flex flex-col md:flex-row items-start gap-5 mb-6 ">
      <button
        type="button"
        className="flex flex-center items-center gap-4 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-purple-600 rounded-lg">
          {icon ? <span className="text-2xl">{icon}</span> : <LuImage />}
        </div>
        <p className="text-sm text-gray-500">
          {icon ? "Changer votre icône" : "Choisir une icône"}
        </p>
      </button>
      {isOpen && (
        <div className="relative">
          <button
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <LuX />
          </button>
          <EmojiPicker
            onEmojiClick={(emojiObject) => {
              const emoji = emojiObject.emoji;
              setIcon(emoji);
              setIsOpen(false);
              onEmojiClick?.(emoji);
            }}
          />
        </div>
      )}
    </div>
  );
}

EmojiPickerPopup.propTypes = {
  selectedEmoji: PropTypes.string,
  onEmojiClick: PropTypes.func,
};

export default EmojiPickerPopup;
