import React, { Component } from 'react';
import ProfileModel from '../models/ProfileModel';
import Input from '../inputs/Input';

class AddCarsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marque: '',
            modelCar: '',
            year: '',
            price: '',
            description: '',
            couleur: '',
            kilometrage: '',
            carburant: '',
            ville: '',
            image: '',
            imageFile: null,
            disponible: true
        };
    }

    resetForm() {
        this.setState({
            marque: '',
            modelCar: '',
            year: '',
            price: '',
            description: '',
            couleur: '',
            kilometrage: '',
            carburant: '',
            ville: '',
            image: '',
            imageFile: null,
            disponible: true
        });
    }

    handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        this.setState({
            [name]: type === 'checkbox' ? checked : value
        });
    };

    handleImageChange = (file) => {
        if (file) {
            this.setState({
                imageFile: file,
                image: typeof file === 'string' ? file : URL.createObjectURL(file)
            });
        } else {
            this.setState({ imageFile: null, image: '' });
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.props.onAddCar) {
            this.props.onAddCar({
                marque: this.state.marque,
                modelCar: this.state.modelCar,
                year: this.state.year,
                price: this.state.price,
                description: this.state.description,
                couleur: this.state.couleur,
                kilometrage: this.state.kilometrage,
                carburant: this.state.carburant,
                ville: this.state.ville,
                image: this.state.image || null,
                imageFile: this.state.imageFile || null,
                disponible: this.state.disponible
            }, () => this.resetForm());
        }
    };

    render() {
        const couleurs = ['Noir', 'Blanc', 'Gris', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Autre'];
        const carburants = ['Essence', 'Diesel', 'Hybride', 'Électrique'];

        return (
            <form onSubmit={this.handleSubmit} className="flex flex-col gap-4">
                <ProfileModel onChange={this.handleImageChange} />

                <Input
                    type="text"
                    name="marque"
                    label="Marque"
                    placeholder="Marque"
                    value={this.state.marque}
                    onChange={this.handleChange}
                    required
                />

                <Input
                    type="text"
                    name="modelCar"
                    label="Modèle"
                    placeholder="Modèle"
                    value={this.state.modelCar}
                    onChange={this.handleChange}
                    required
                />

                <Input
                    type="number"
                    name="year"
                    label="Année"
                    placeholder="Année"
                    value={this.state.year}
                    onChange={this.handleChange}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    required
                />

                <Input
                    type="number"
                    name="price"
                    label="Prix (FCFA)"
                    placeholder="Prix"
                    value={this.state.price}
                    onChange={this.handleChange}
                    min="0"
                    required
                />

                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Couleur</label>
                    <select
                        name="couleur"
                        value={this.state.couleur}
                        onChange={this.handleChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-violet-400"
                        required
                    >
                        <option value="">Sélectionnez une couleur</option>
                        {couleurs.map(couleur => (
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
                    value={this.state.kilometrage}
                    onChange={this.handleChange}
                    min="0"
                    required
                />

                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Carburant</label>
                    <select
                        name="carburant"
                        value={this.state.carburant}
                        onChange={this.handleChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-violet-400"
                        required
                    >
                        <option value="">Sélectionnez un carburant</option>
                        {carburants.map(carburant => (
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
                    value={this.state.ville}
                    onChange={this.handleChange}
                    required
                />

                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        placeholder="Description de la voiture (max 500 caractères)"
                        value={this.state.description}
                        onChange={this.handleChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-violet-400"
                        rows="3"
                        maxLength="500"
                        required
                    />
                    <small className="text-white/60 text-xs">
                        {this.state.description.length}/500 caractères
                    </small>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="disponible"
                        checked={this.state.disponible}
                        onChange={this.handleChange}
                        className="w-4 h-4 text-violet-500 focus:ring-violet-400"
                    />
                    <label className="text-white text-sm">Disponible</label>
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
}

export default AddCarsForm;