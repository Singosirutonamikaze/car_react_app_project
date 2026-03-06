import React, { Component } from 'react';
import { LuSave, LuX } from 'react-icons/lu';

class EditCommandForm extends Component {
    constructor(props) {
        super(props);

        const command = props.command || {};
        this.state = {
            _id: command._id || '',
            voiture: command.voiture?._id || command.voiture || '',
            client: command.client?._id || command.client || '',
            montant: command.montant || '',
            fraisLivraison: command.fraisLivraison || '',
            modePaiement: command.modePaiement || '',
            statut: command.statut || 'En attente',
            adresseLivraison: {
                rue: command.adresseLivraison?.rue || '',
                ville: command.adresseLivraison?.ville || '',
                codePostal: command.adresseLivraison?.codePostal || '',
                pays: command.adresseLivraison?.pays || 'TOGO'
            },
            dateLivraisonPrevue: command.dateLivraisonPrevue ?
                new Date(command.dateLivraisonPrevue).toISOString().split('T')[0] : '',
            dateLivraisonReelle: command.dateLivraisonReelle ?
                new Date(command.dateLivraisonReelle).toISOString().split('T')[0] : '',
            notes: command.notes || ''
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.command !== this.props.command && this.props.command) {
            const command = this.props.command;
            this.setState({
                _id: command._id || '',
                voiture: command.voiture?._id || command.voiture || '',
                client: command.client?._id || command.client || '',
                montant: command.montant || '',
                fraisLivraison: command.fraisLivraison || '',
                modePaiement: command.modePaiement || '',
                statut: command.statut || 'En attente',
                adresseLivraison: {
                    rue: command.adresseLivraison?.rue || '',
                    ville: command.adresseLivraison?.ville || '',
                    codePostal: command.adresseLivraison?.codePostal || '',
                    pays: command.adresseLivraison?.pays || 'TOGO'
                },
                dateLivraisonPrevue: command.dateLivraisonPrevue ?
                    new Date(command.dateLivraisonPrevue).toISOString().split('T')[0] : '',
                dateLivraisonReelle: command.dateLivraisonReelle ?
                    new Date(command.dateLivraisonReelle).toISOString().split('T')[0] : '',
                notes: command.notes || ''
            });
        }
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleAddressChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            adresseLivraison: {
                ...prevState.adresseLivraison,
                [name]: value
            }
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.props.onSave) {
            this.props.onSave(this.state);
        }
    };

    render() {
        const { cars = [], clients = [], onCancel } = this.props;

        return (
            <form onSubmit={this.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="voiture" className="block text-sm font-medium text-slate-100 mb-2">
                            Voiture *
                        </label>
                        <select
                            id="voiture"
                            name="voiture"
                            value={this.state.voiture}
                            onChange={this.handleInputChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                            required
                        >
                            <option value="">Sélectionner une voiture</option>
                            {cars.map(car => (
                                <option key={car._id} value={car._id}>
                                    {car.marque} {car.modelCar} - {car.annee}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="client" className="block text-sm font-medium text-slate-100 mb-2">
                            Client *
                        </label>
                        <select
                            id="client"
                            name="client"
                            value={this.state.client}
                            onChange={this.handleInputChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                            required
                        >
                            <option value="">Sélectionner un client</option>
                            {clients.map(client => (
                                <option key={client._id} value={client._id}>
                                    {client.name} {client.surname}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="statut" className="block text-sm font-medium text-slate-100 mb-2">
                            Statut *
                        </label>
                        <select
                            id="statut"
                            name="statut"
                            value={this.state.statut}
                            onChange={this.handleInputChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                            required
                        >
                            <option value="En attente">En attente</option>
                            <option value="Confirmée">Confirmée</option>
                            <option value="En cours">En cours</option>
                            <option value="Livrée">Livrée</option>
                            <option value="Annulée">Annulée</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="modePaiement" className="block text-sm font-medium text-slate-100 mb-2">
                            Mode de paiement *
                        </label>
                        <select
                            id="modePaiement"
                            name="modePaiement"
                            value={this.state.modePaiement}
                            onChange={this.handleInputChange}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="montant" className="block text-sm font-medium text-slate-100 mb-2">
                            Montant (FCFA) *
                        </label>
                        <input
                            type="number"
                            id="montant"
                            name="montant"
                            value={this.state.montant}
                            onChange={this.handleInputChange}
                            min="0"
                            step="1000"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                            placeholder="0"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fraisLivraison" className="block text-sm font-medium text-slate-100 mb-2">
                            Frais de livraison (FCFA)
                        </label>
                        <input
                            type="number"
                            id="fraisLivraison"
                            name="fraisLivraison"
                            value={this.state.fraisLivraison}
                            onChange={this.handleInputChange}
                            min="0"
                            step="1000"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                    <h4 className="text-slate-100 font-medium mb-4">Adresse de livraison *</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="rue" className="block text-sm font-medium text-slate-300 mb-2">
                                Rue et numéro *
                            </label>
                            <input
                                type="text"
                                id="rue"
                                name="rue"
                                value={this.state.adresseLivraison.rue}
                                onChange={this.handleAddressChange}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                                placeholder="123 Rue de la République"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="ville" className="block text-sm font-medium text-slate-300 mb-2">
                                Ville *
                            </label>
                            <input
                                type="text"
                                id="ville"
                                name="ville"
                                value={this.state.adresseLivraison.ville}
                                onChange={this.handleAddressChange}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                                placeholder="Paris"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="codePostal" className="block text-sm font-medium text-slate-300 mb-2">
                                Code postal *
                            </label>
                            <input
                                type="text"
                                id="codePostal"
                                name="codePostal"
                                value={this.state.adresseLivraison.codePostal}
                                onChange={this.handleAddressChange}
                                pattern="[0-9]{5}"
                                maxLength="5"
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                                placeholder="75001"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="pays" className="block text-sm font-medium text-slate-300 mb-2">
                                Pays
                            </label>
                            <input
                                type="text"
                                id="pays"
                                name="pays"
                                value={this.state.adresseLivraison.pays}
                                onChange={this.handleAddressChange}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                                placeholder="France"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="dateLivraisonPrevue" className="block text-sm font-medium text-slate-100 mb-2">
                            Date de livraison prévue
                        </label>
                        <input
                            type="date"
                            id="dateLivraisonPrevue"
                            name="dateLivraisonPrevue"
                            value={this.state.dateLivraisonPrevue}
                            onChange={this.handleInputChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                        />
                    </div>

                    <div>
                        <label htmlFor="dateLivraisonReelle" className="block text-sm font-medium text-slate-100 mb-2">
                            Date de livraison réelle
                        </label>
                        <input
                            type="date"
                            id="dateLivraisonReelle"
                            name="dateLivraisonReelle"
                            value={this.state.dateLivraisonReelle}
                            onChange={this.handleInputChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                        />
                        <p className="text-slate-400 text-xs mt-1">
                            Remplir uniquement si la commande a été livrée
                        </p>
                    </div>
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-100 mb-2">
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={this.state.notes}
                        onChange={this.handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none"
                        placeholder="Notes additionnelles sur la commande..."
                        maxLength="1000"
                    />
                    <p className="text-slate-400 text-xs mt-1">
                        {this.state.notes.length}/1000 caractères
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-600/30">
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium"
                    >
                        <LuSave className="text-lg" />
                        Sauvegarder les modifications
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
                    >
                        <LuX className="text-lg" />
                        Annuler
                    </button>
                </div>
            </form>
        );
    }
}

export default EditCommandForm;