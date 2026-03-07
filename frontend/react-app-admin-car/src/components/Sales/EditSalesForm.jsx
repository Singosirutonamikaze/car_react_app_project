import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Input from "../inputs/Input";
import Select from "../inputs/Select";

function mapSaleToForm(sale) {
  return {
    voiture: sale?.voiture?._id || "",
    client: sale?.client?._id || "",
    commande: sale?.commande?._id || "",
    prixVente: sale?.prixVente || "",
    statut: sale?.statut || "En attente",
    dateVente: sale?.dateVente
      ? new Date(sale.dateVente).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    numeroTransaction: sale?.numeroTransaction || "",
    notes: sale?.notes || "",
  };
}

function EditSalesForm({
  sale,
  cars = [],
  clients = [],
  orders = [],
  onSave,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => mapSaleToForm(sale));

  useEffect(() => {
    if (sale) {
      setFormData(mapSaleToForm(sale));
    }
  }, [sale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const saleId = sale?._id;

    if (onSave && saleId) {
      const updatedSale = {
        _id: saleId,
        voiture: formData.voiture,
        client: formData.client,
        commande: formData.commande,
        prixVente: formData.prixVente,
        statut: formData.statut,
        dateVente: formData.dateVente,
        numeroTransaction: formData.numeroTransaction,
        notes: formData.notes,
      };

      onSave(updatedSale);
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

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded flex-1"
        >
          Sauvegarder
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded flex-1"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

EditSalesForm.propTypes = {
  sale: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    voiture: PropTypes.shape({ _id: PropTypes.string }),
    client: PropTypes.shape({ _id: PropTypes.string }),
    commande: PropTypes.shape({ _id: PropTypes.string }),
    prixVente: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    statut: PropTypes.string,
    dateVente: PropTypes.string,
    numeroTransaction: PropTypes.string,
    notes: PropTypes.string,
  }),
  cars: PropTypes.arrayOf(PropTypes.object),
  clients: PropTypes.arrayOf(PropTypes.object),
  orders: PropTypes.arrayOf(PropTypes.object),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default EditSalesForm;
