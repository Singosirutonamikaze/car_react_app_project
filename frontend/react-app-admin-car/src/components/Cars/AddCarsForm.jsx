import React, { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import ProfileModel from "../models/ProfileModel";
import Input from "../inputs/Input";
import { fileToDataUrl } from "../../utils/imageUrl";

function getInitialState() {
  return {
    marque: "",
    modelCar: "",
    year: "",
    price: "",
    description: "",
    couleur: "",
    kilometrage: "",
    carburant: "",
    ville: "",
    image: "",
    imageFile: null,
    disponible: true,
  };
}

function AddCarsForm({ onAddCar }) {
  const [formData, setFormData] = useState(getInitialState);

  const resetForm = () => {
    setFormData(getInitialState());
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (file) => {
    try {
      if (file) {
        const imageDataUrl =
          typeof file === "string" ? file : await fileToDataUrl(file);

        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          image: imageDataUrl,
        }));
      } else {
        setFormData((prev) => ({ ...prev, imageFile: null, image: "" }));
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Impossible de charger l'image.";
      toast.error(message);
      setFormData((prev) => ({ ...prev, imageFile: null, image: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddCar) {
      onAddCar(
        {
          marque: formData.marque,
          modelCar: formData.modelCar,
          year: formData.year,
          price: formData.price,
          description: formData.description,
          couleur: formData.couleur,
          kilometrage: formData.kilometrage,
          carburant: formData.carburant,
          ville: formData.ville,
          image: formData.image || null,
          imageFile: formData.imageFile || null,
          disponible: formData.disponible,
        },
        resetForm,
      );
    }
  };

  const couleurs = [
    "Noir",
    "Blanc",
    "Gris",
    "Rouge",
    "Bleu",
    "Vert",
    "Jaune",
    "Autre",
  ];
  const carburants = ["Essence", "Diesel", "Hybride", "Électrique"];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ProfileModel
        onChange={handleImageChange}
        initialImage={formData.image}
      />

      <Input
        type="text"
        name="marque"
        label="Marque"
        placeholder="Marque"
        value={formData.marque}
        onChange={handleChange}
        required
      />

      <Input
        type="text"
        name="modelCar"
        label="Modèle"
        placeholder="Modèle"
        value={formData.modelCar}
        onChange={handleChange}
        required
      />

      <Input
        type="number"
        name="year"
        label="Année"
        placeholder="Année"
        value={formData.year}
        onChange={handleChange}
        min="1990"
        max={new Date().getFullYear() + 1}
        required
      />

      <Input
        type="number"
        name="price"
        label="Prix (FCFA)"
        placeholder="Prix"
        value={formData.price}
        onChange={handleChange}
        min="0"
        required
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="couleur" className="text-white text-sm font-medium">
          Couleur
        </label>
        <select
          id="couleur"
          name="couleur"
          value={formData.couleur}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-violet-400"
          required
        >
          <option value="">Sélectionnez une couleur</option>
          {couleurs.map((couleur) => (
            <option key={couleur} value={couleur} className="text-gray-800">
              {couleur}
            </option>
          ))}
        </select>
      </div>

      <Input
        type="number"
        name="kilometrage"
        label="Kilométrage (km)"
        placeholder="Kilométrage"
        value={formData.kilometrage}
        onChange={handleChange}
        min="0"
        required
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="carburant" className="text-white text-sm font-medium">
          Carburant
        </label>
        <select
          id="carburant"
          name="carburant"
          value={formData.carburant}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-violet-400"
          required
        >
          <option value="">Sélectionnez un carburant</option>
          {carburants.map((carburant) => (
            <option key={carburant} value={carburant} className="text-gray-800">
              {carburant}
            </option>
          ))}
        </select>
      </div>

      <Input
        type="text"
        name="ville"
        label="Ville"
        placeholder="Ville"
        value={formData.ville}
        onChange={handleChange}
        required
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-white text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Description de la voiture (max 500 caractères)"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-violet-400"
          rows="3"
          maxLength="500"
          required
        />
        <small className="text-white/60 text-xs">
          {formData.description.length}/500 caractères
        </small>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="disponible"
          type="checkbox"
          name="disponible"
          checked={formData.disponible}
          onChange={handleChange}
          className="w-4 h-4 text-violet-500 focus:ring-violet-400"
        />
        <label htmlFor="disponible" className="text-white text-sm">
          Disponible
        </label>
      </div>

      <button
        type="submit"
        className="bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded"
      >
        Ajouter
      </button>
    </form>
  );
}

AddCarsForm.propTypes = {
  onAddCar: PropTypes.func,
};

export default AddCarsForm;
