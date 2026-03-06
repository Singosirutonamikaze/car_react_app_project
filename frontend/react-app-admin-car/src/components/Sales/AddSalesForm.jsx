import React, { Component } from 'react';
import Input from '../inputs/Input';
import Select from '../inputs/Select';


class AddSalesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voiture: '',
      client: '',
      commande: '',
      prixVente: '',
      statut: 'En attente',
      dateVente: new Date().toISOString().split('T')[0],
      numeroTransaction: '',
      notes: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.props.onAddSale) {
      this.props.onAddSale({
        voiture: this.state.voiture,
        client: this.state.client,
        commande: this.state.commande,
        prixVente: this.state.prixVente,
        statut: this.state.statut,
        dateVente: this.state.dateVente,
        numeroTransaction: this.state.numeroTransaction,
        notes: this.state.notes
      }, () => this.resetForm());
    }
  };

  resetForm() {
    this.setState({
      voiture: '',
      client: '',
      commande: '',
      prixVente: '',
      statut: 'En attente',
      dateVente: new Date().toISOString().split('T')[0],
      numeroTransaction: '',
      notes: ''
    });
  }

  render() {
    const { cars, clients, orders } = this.props;

    return (
      <form onSubmit={this.handleSubmit} className="flex flex-col gap-4">
        <Select
          name="voiture"
          label="Voiture"
          value={this.state.voiture}
          onChange={this.handleChange}
          required
          options={cars.map(car => ({
            value: car._id,
            label: `${car.marque} ${car.modelCar} - ${car.price} FCFA`
          }))}
        />
        
        <Select
          name="client"
          label="Client"
          value={this.state.client}
          onChange={this.handleChange}
          required
          options={clients.map(client => ({
            value: client._id,
            label: `${client.name} ${client.surname} - ${client.email}`
          }))}
        />
        
        <Select
          name="commande"
          label="Commande (optionnel)"
          value={this.state.commande}
          onChange={this.handleChange}
          options={[
            { value: '', label: 'Aucune commande' },
            ...orders.map(order => ({
              value: order._id,
              label: `Commande #${order._id.slice(-6)} - ${order.montantTotal} FCFA`
            }))
          ]}
        />
        
        <Input
          type="number"
          name="prixVente"
          label="Prix de vente"
          placeholder="Prix de vente"
          value={this.state.prixVente}
          onChange={this.handleChange}
          required
          min="0"
        />
        
        <Select
          name="statut"
          label="Statut"
          value={this.state.statut}
          onChange={this.handleChange}
          required
          options={[
            { value: 'En attente', label: 'En attente' },
            { value: 'Confirmée', label: 'Confirmée' },
            { value: 'Payée', label: 'Payée' },
            { value: 'Annulée', label: 'Annulée' }
          ]}
        />
        
        <Input
          type="date"
          name="dateVente"
          label="Date de vente"
          value={this.state.dateVente}
          onChange={this.handleChange}
        />
        
        <Input
          type="text"
          name="numeroTransaction"
          label="Numéro de transaction (optionnel)"
          placeholder="Numéro de transaction"
          value={this.state.numeroTransaction}
          onChange={this.handleChange}
        />
        
        <Input
          type="text"
          name="notes"
          label="Notes (optionnel)"
          placeholder="Notes"
          value={this.state.notes}
          onChange={this.handleChange}
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
}

export default AddSalesForm;