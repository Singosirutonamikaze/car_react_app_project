import React, { Component } from 'react';
import Input from '../inputs/Input';
import ProfileModel from '../models/ProfileModel';

class AddClientsForm extends Component {
  resetForm() {
    this.setState({
      name: '',
      surname: '',
      email: '',
      password: '',
      profileImageUrl: '',
      profileImageFile: null
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      email: '',
      password: '',
      profileImageUrl: '',
      profileImageFile: null
    };
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
    if (this.props.onAddClient) {
      this.props.onAddClient({
        name: this.state.name,
        surname: this.state.surname,
        email: this.state.email,
        password: this.state.password,
        profileImageUrl: this.state.profileImageUrl || null,
        profileImageFile: this.state.profileImageFile || null
      }, () => this.resetForm());
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="flex flex-col gap-4">
        <ProfileModel onChange={this.handleProfileImageChange} />
        
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
          label="Mot de passe"
          placeholder="Mot de passe"
          value={this.state.password}
          onChange={this.handleChange}
          required
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

export default AddClientsForm;