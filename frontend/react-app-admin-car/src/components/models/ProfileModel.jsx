import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { LuTrash, LuUpload, LuUser } from "react-icons/lu";
import { MAX_IMAGE_SIZE_BYTES, resolveImageUrl } from "../../utils/imageUrl";

const ProfileModel = (props) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const externalImage = resolveImageUrl(props.initialImage || "");
    if (!file) {
      setPreviewUrl(externalImage);
    }
  }, [props.initialImage, file]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error("Image trop lourde. Taille maximale autorisee: 1 Mo.");
        event.target.value = null;
        return;
      }

      setFile(file);

      // Générer un aperçu local uniquement pour l'UI.
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      if (props.onChange) {
        props.onChange(file);
      }
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);
    setPreviewUrl("");
    if (inputRef.current) {
      inputRef.current.value = null;
    }

    if (props.onChange) {
      props.onChange(null);
    }
  };

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const showPlaceholder = previewUrl === "";

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {showPlaceholder ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-200 rounded-full cursor-pointer relative">
          <LuUser size={30} className="text-violet-500" />
          <button
            className="w-8 h-8 flex items-center justify-center bg-violet-800 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={onChooseFile}
            type="button"
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            onClick={handleRemoveImage}
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
          >
            <LuTrash size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

ProfileModel.propTypes = {
  onChange: PropTypes.func,
  initialImage: PropTypes.string,
};

export default ProfileModel;
