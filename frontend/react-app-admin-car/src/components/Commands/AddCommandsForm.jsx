import React, { useState } from "react";
import PropTypes from "prop-types";
import { LuSave, LuX } from "react-icons/lu";

function getInitialState() {
  return {
    voiture: "",
    client: "",
    montant: "",
    fraisLivraison: "",
    modePaiement: "",
    adresseLivraison: {
      rue: "",
      ville: "",
      codePostal: "",
      pays: "TOGO",
    },
    dateLivraisonPrevue: "",
    notes: "",
  };
}

function AddCommandForm({ cars = [], clients = [], onAddCommand }) {
  const [formData, setFormData] = useState(getInitialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      adresseLivraison: {
        ...prev.adresseLivraison,
        [name]: value,
      },
    }));
  };

  const resetForm = () => {
    setFormData(getInitialState());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddCommand) {
      onAddCommand(formData, resetForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="voiture"
            className="block text-sm font-medium text-slate-100 mb-2"
          >
            Voiture *
          </label>
          <select
            id="voiture"
            name="voiture"
            value={formData.voiture}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
            required
          >
            <option value="">Sélectionner une voiture</option>
            {cars.map((car) => (
              <option key={car._id} value={car._id}>
                {car.marque} {car.modelCar} - {car.annee}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="client"
            className="block text-sm font-medium text-slate-100 mb-2"
          >
            Client *
          </label>
          <select
            id="client"
            name="client"
            value={formData.client}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
            required
          >
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} {client.surname}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="montant"
            className="block text-sm font-medium text-slate-100 mb-2"
          >
            Montant (FCFA) *
          </label>
          <input
            type="number"
            id="montant"
            name="montant"
            value={formData.montant}
            onChange={handleInputChange}
            min="0"
            step="1000"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
            placeholder="0"
            required
          />
        </div>

        <div>
          <label
            htmlFor="fraisLivraison"
            className="block text-sm font-medium text-slate-100 mb-2"
          >
            Frais de livraison (FCFA)
          </label>
          <input
            type="number"
            id="fraisLivraison"
            name="fraisLivraison"
            value={formData.fraisLivraison}
            onChange={handleInputChange}
            min="0"
            step="1000"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
            placeholder="0"
          />
        </div>

        <div>
          <label
            htmlFor="modePaiement"
            className="block text-sm font-medium text-slate-100 mb-2"
          >
            Mode de paiement *
          </label>
          <select
            id="modePaiement"
            name="modePaiement"
            value={formData.modePaiement}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
            required
          >
            <option value="">Sélectionner un mode</option>
            <option value="Espèces">Espèces</option>
            <option value="Virement">Virement</option>
            <option value="Chèque">Chèque</option>
            <option value="Financement">Financement</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
        <h4 className="text-slate-100 font-medium mb-4">
          Adresse de livraison *
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="rue"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Rue et numéro *
            </label>
            <input
              type="text"
              id="rue"
              name="rue"
              value={formData.adresseLivraison.rue}
              onChange={handleAddressChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
              placeholder="123 Rue de la République"
              required
            />
          </div>

          <div>
            <label
              htmlFor="ville"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Ville *
            </label>
            <input
              type="text"
              id="ville"
              name="ville"
              value={formData.adresseLivraison.ville}
              onChange={handleAddressChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
              placeholder="Lome"
              required
            />
          </div>

          <div>
            <label
              htmlFor="codePostal"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Code postal *
            </label>
            <input
              type="text"
              id="codePostal"
              name="codePostal"
              value={formData.adresseLivraison.codePostal}
              onChange={handleAddressChange}
              pattern="[0-9]{5}"
              maxLength="5"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
              placeholder="00000"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="pays"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Pays
            </label>
            <input
              type="text"
              id="pays"
              name="pays"
              value={formData.adresseLivraison.pays}
              onChange={handleAddressChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
              placeholder="TOGO"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="dateLivraisonPrevue"
          className="block text-sm font-medium text-slate-100 mb-2"
        >
          Date de livraison prévue
        </label>
        <input
          type="date"
          id="dateLivraisonPrevue"
          name="dateLivraisonPrevue"
          value={formData.dateLivraisonPrevue}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-slate-100 mb-2"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none"
          placeholder="Notes additionnelles sur la commande..."
          maxLength="1000"
        />
        <p className="text-slate-400 text-xs mt-1">
          {formData.notes.length}/1000 caractères
        </p>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-slate-600/30">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium"
        >
          <LuSave className="text-lg" />
          Enregistrer la commande
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
        >
          <LuX className="text-lg" />
          Réinitialiser
        </button>
      </div>
    </form>
  );
}

AddCommandForm.propTypes = {
  cars: PropTypes.arrayOf(PropTypes.object),
  clients: PropTypes.arrayOf(PropTypes.object),
  onAddCommand: PropTypes.func,
};

export default AddCommandForm;
