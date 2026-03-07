import React, { useState } from "react";
import PropTypes from "prop-types";
import Input from "../inputs/Input";
import ProfileModel from "../models/ProfileModel";
import { fileToDataUrl } from "../../utils/imageUrl";

const initialState = {
  name: "",
  surname: "",
  email: "",
  password: "",
  profileImageUrl: "",
  profileImageFile: null,
};

function AddClientsForm({ onAddClient }) {
  const [formData, setFormData] = useState(initialState);

  const resetForm = () => {
    setFormData(initialState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = async (file) => {
    if (file) {
      const imageDataUrl =
        typeof file === "string" ? file : await fileToDataUrl(file);

      setFormData((prev) => ({
        ...prev,
        profileImageFile: file,
        profileImageUrl: imageDataUrl,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        profileImageFile: null,
        profileImageUrl: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddClient) {
      onAddClient(
        {
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          profileImageUrl: formData.profileImageUrl || null,
          profileImageFile: formData.profileImageFile || null,
        },
        resetForm,
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ProfileModel
        onChange={handleProfileImageChange}
        initialImage={formData.profileImageUrl}
      />

      <Input
        type="text"
        name="name"
        label="Nom"
        placeholder="Nom"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Input
        type="text"
        name="surname"
        label="Prénom"
        placeholder="Prénom"
        value={formData.surname}
        onChange={handleChange}
        required
      />

      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        type="password"
        name="password"
        label="Mot de passe"
        placeholder="Mot de passe"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit" className="py-2 px-4 rounded font-medium">
        Ajouter
      </button>
    </form>
  );
}

AddClientsForm.propTypes = {
  onAddClient: PropTypes.func,
};

export default AddClientsForm;
