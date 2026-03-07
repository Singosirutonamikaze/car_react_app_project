import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Input from "../inputs/Input";
import ProfileModel from "../models/ProfileModel";
import { fileToDataUrl, resolveImageUrl } from "../../utils/imageUrl";

function mapClientToForm(client) {
  return {
    name: client?.name || "",
    surname: client?.surname || "",
    email: client?.email || "",
    password: "",
    profileImageUrl: resolveImageUrl(client?.profileImageUrl) || "",
    profileImageFile: null,
  };
}

function EditClientsForm({ client, onSave, onCancel }) {
  const [formData, setFormData] = useState(() => mapClientToForm(client));

  useEffect(() => {
    if (client) {
      setFormData(mapClientToForm(client));
    }
  }, [client]);

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
    const clientId = client?._id;

    if (onSave && clientId) {
      const updatedClient = {
        _id: clientId,
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        profileImageUrl: formData.profileImageUrl || null,
        profileImageFile: formData.profileImageFile || null,
      };

      if (formData.password.trim()) {
        updatedClient.password = formData.password;
      }

      onSave(updatedClient);
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
        label="Nouveau mot de passe (optionnel)"
        placeholder="Laissez vide pour conserver l'ancien"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="flex gap-2 mt-4">
        <button type="submit" className="py-2 px-4 rounded flex-1 font-medium">
          Sauvegarder
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 rounded flex-1 font-medium"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

EditClientsForm.propTypes = {
  client: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    surname: PropTypes.string,
    email: PropTypes.string,
    profileImageUrl: PropTypes.string,
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default EditClientsForm;
