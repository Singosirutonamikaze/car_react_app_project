import React, { useState } from "react";
import PropTypes from "prop-types";
import Input from "../inputs/Input";
import Select from "../inputs/Select";

function getInitialFormState() {
  return {
    voiture: "",
    client: "",
    commande: "",
    prixVente: "",
    statut: "En attente",
    dateVente: new Date().toISOString().split("T")[0],
    numeroTransaction: "",
    notes: "",
  };
}

function AddSalesForm({ cars = [], clients = [], orders = [], onAddSale }) {
  const [formData, setFormData] = useState(getInitialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(getInitialFormState());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddSale) {
      onAddSale(
        {
          voiture: formData.voiture,
          client: formData.client,
          commande: formData.commande,
          prixVente: formData.prixVente,
          statut: formData.statut,
          dateVente: formData.dateVente,
          numeroTransaction: formData.numeroTransaction,
          notes: formData.notes,
        },
        resetForm,
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        name="voiture"
        label="Voiture"
        value={formData.voiture}
        onChange={handleChange}
        required
        options={cars.map((car) => ({
          value: car._id,
          label: `${car.marque} ${car.modelCar} - ${car.price} FCFA`,
        }))}
      />

      <Select
        name="client"
        label="Client"
        value={formData.client}
        onChange={handleChange}
        required
        options={clients.map((client) => ({
          value: client._id,
          label: `${client.name} ${client.surname} - ${client.email}`,
        }))}
      />

      <Select
        name="commande"
        label="Commande (optionnel)"
        value={formData.commande}
        onChange={handleChange}
        options={[
          { value: "", label: "Aucune commande" },
          ...orders.map((order) => ({
            value: order._id,
            label: `Commande #${order._id.slice(-6)} - ${order.montantTotal} FCFA`,
          })),
        ]}
      />

      <Input
        type="number"
        name="prixVente"
        label="Prix de vente"
        placeholder="Prix de vente"
        value={formData.prixVente}
        onChange={handleChange}
        required
        min="0"
      />

      <Select
        name="statut"
        label="Statut"
        value={formData.statut}
        onChange={handleChange}
        required
        options={[
          { value: "En attente", label: "En attente" },
          { value: "Confirmée", label: "Confirmée" },
          { value: "Payée", label: "Payée" },
          { value: "Annulée", label: "Annulée" },
        ]}
      />

      <Input
        type="date"
        name="dateVente"
        label="Date de vente"
        value={formData.dateVente}
        onChange={handleChange}
      />

      <Input
        type="text"
        name="numeroTransaction"
        label="Numéro de transaction (optionnel)"
        placeholder="Numéro de transaction"
        value={formData.numeroTransaction}
        onChange={handleChange}
      />

      <Input
        type="text"
        name="notes"
        label="Notes (optionnel)"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded"
      >
        Ajouter
      </button>
    </form>
  );
}

AddSalesForm.propTypes = {
  cars: PropTypes.arrayOf(PropTypes.object),
  clients: PropTypes.arrayOf(PropTypes.object),
  orders: PropTypes.arrayOf(PropTypes.object),
  onAddSale: PropTypes.func,
};

export default AddSalesForm;
