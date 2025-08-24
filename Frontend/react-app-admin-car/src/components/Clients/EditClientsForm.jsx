import React, { Component } from 'react';
import Input from '../inputs/Input';
import ProfileModel from '../models/ProfileModel';

class EditClientsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.client?.name || '',
      surname: props.client?.surname || '',
      email: props.client?.email || '',
      password: '',
      profileImageUrl: props.client?.profileImageUrl || '',
      profileImageFile: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.client !== this.props.client && this.props.client) {
      this.setState({
        name: this.props.client.name || '',
        surname: this.props.client.surname || '',
        email: this.props.client.email || '',
        password: '',
        profileImageUrl: this.props.client.profileImageUrl || '',
        profileImageFile: null
      });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleProfileImageChange = (file) => {
    if (file) {
      this.setState({
        profileImageFile: file,
        profileImageUrl: typeof file === 'string' ? file : URL.createObjectURL(file)
      });
    } else {
      this.setState({ profileImageFile: null, profileImageUrl: '' });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    
    if (this.props.onSave) {
      const updatedClient = {
        _id: this.props.client._id,
        name: this.state.name,
        surname: this.state.surname,
        email: this.state.email,
        profileImageUrl: this.state.profileImageUrl || null,
        profileImageFile: this.state.profileImageFile || null
      };

      // N'inclure le mot de passe que s'il a été modifié
      if (this.state.password.trim()) {
        updatedClient.password = this.state.password;
      }

      this.props.onSave(updatedClient);
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="flex flex-col gap-4">
        <ProfileModel 
          onChange={this.handleProfileImageChange}
          initialImage={this.state.profileImageUrl}
        />
        
        <Input
          type="text"
          name="name"
          label="Nom"
          placeholder="Nom"
          value={this.state.name}
          onChange={this.handleChange}
          required
        />
        
        <Input
          type="text"
          name="surname"
          label="Prénom"
          placeholder="Prénom"
          value={this.state.surname}
          onChange={this.handleChange}
          required
        />
        
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          value={this.state.email}
          onChange={this.handleChange}
          required
        />
        
        <Input
          type="password"
          name="password"
          label="Nouveau mot de passe (optionnel)"
          placeholder="Laissez vide pour conserver l'ancien"
          value={this.state.password}
          onChange={this.handleChange}
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
            onClick={this.props.onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded flex-1"
          >
            Annuler
          </button>
        </div>
      </form>
    );
  }
}

export default EditClientsForm;