import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { LuPlus } from 'react-icons/lu';
import ClientsChartsLine from '../components/Clients/ClientsOverview';
import ClientsList from '../components/Clients/ClientsList';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import AddClientsForm from '../components/Clients/AddClientsForm';
import Model from '../components/models/Model';
import DeleteAlert from '../components/alerts/DeleteAlert';


class ClientsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientData: [],
      openClientModel: false,
      loading: false,
      openDeleteAlert: {
        show: false,
        data: null
      }
    };
  }

  componentDidMount() {
    this.fetchClientData();
  }

  fetchClientData = async () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.CLIENTS.GET_ALL}`
      );

      if (response.data) {
        console.log("Données de clients reçues:", response.data);
        this.setState({ clientData: response.data });
      }
    } catch (error) {
      console.error('Erreur de récupération des clients :', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleAddClient = async (client) => {
    const { name, surname, email, password } = client;

    if (!name.trim()) {
      toast.error("Le champ nom est obligatoire.")
      return;
    }

    if (!surname.trim()) {
      toast.error("Le champ prénom est obligatoire.")
      return;
    }

    if (!email.trim()) {
      toast.error("Le champ email est obligatoire.")
      return;
    }

    if (!password.trim()) {
      toast.error("Le champ mot de passe est obligatoire.")
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Veuillez entrer un email valide.");
      return;
    }

    // Validation mot de passe (minimum 6 caractères)
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      await axiosInstance.post(
        `${API_PATHS.CLIENTS.CREATE}`,
        {
          name,
          surname,
          email,
          password,
          profileImageUrl: client.profileImageUrl || null
        }
      );

      this.setState({
        openClientModel: false
      });
      toast.success("Client ajouté avec succès.");
      this.fetchClientData();

    } catch (error) {
      console.error('Erreur d\'ajout du client :', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de l'ajout du client.");
      }
    }
  };

  openDeleteAlert = (alertData) => {
    this.setState({ openDeleteAlert: alertData });
  };

  deleteClient = async (id) => {
    try {
      await axiosInstance.delete(`${API_PATHS.CLIENTS.DELETE(id)}`);

      this.setState({ openDeleteAlert: { show: false, data: null } });
      toast.success("Client supprimé avec succès.");
      this.fetchClientData();
    } catch (error) {
      console.error('Erreur de suppression du client :', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de la suppression du client.");
      }
    }
  };

  handleDownloadClients = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.CLIENTS.DOWNLOAD}`, {
        responseType: 'blob'
      });

      // Créer un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', 'clients.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error('Erreur de téléchargement des clients :', error);
      toast.error("Erreur lors du téléchargement des clients.");
    }
  };

  render() {
    const { loading } = this.props;

    if (loading) {
      return (
        <DashboardLayout activeMenu="Liste des Clients">
          <div className="w-full h-full flex items-center justify-center bg-[#010B18]/70 backdrop-blur-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
              <p className="text-slate-100/80 text-lg">Chargement des données...</p>
            </div>
          </div>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout activeMenu="Liste des Clients">
        <div className="w-full h-full min-h-screen bg-gradient-to-br from-[#010B18] via-[#010B18]/95 to-[#010B18]/90 p-6">
          <div className="flex items-center justify-between p-3">
            <div>
              <h1 className="text-slate-100 text-2xl font-bold">Liste des Clients</h1>
              <p className="text-slate-400">Voici la liste de tous les clients</p>
            </div>
            <button
              onClick={() => this.setState({ openClientModel: true })}
              className="mt-4 bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              Ajouter un Client
              <LuPlus />
            </button>
          </div>

          <div className="mt-4 space-y-6">
            <ClientsChartsLine dataClients={this.state.clientData} />
            <ClientsList
              clients={this.state.clientData}
              onDeleteClient={client => this.setState({ openDeleteAlert: { show: true, data: client } })}
            />
          </div>

          <Model
            isOpen={this.state.openClientModel}
            onClose={() => this.setState({ openClientModel: false })}
            title="Ajouter un Client"
          >
            <AddClientsForm onAddClient={async (client, resetForm) => {
              await this.handleAddClient(client);
              if (resetForm) {
                resetForm()
              };
            }} />
          </Model>

          <Model
            isOpen={this.state.openDeleteAlert.show}
            onClose={() => this.setState({ openDeleteAlert: { show: false, data: null } })}
            title="Supprimer le client"
          >
            <DeleteAlert
              message={
                this.state.openDeleteAlert.data
                  ? `Voulez-vous vraiment supprimer le client ${this.state.openDeleteAlert.data.name} ?`
                  : 'Voulez-vous vraiment supprimer ce client ?'
              }
              onDelete={() => {
                if (this.state.openDeleteAlert.data) {
                  this.deleteClient(this.state.openDeleteAlert.data._id);
                }
                this.setState({ openDeleteAlert: { show: false, data: null } });
              }}
              onCancel={() => this.setState({ openDeleteAlert: { show: false, data: null } })}
            />
          </Model>

        </div>
      </DashboardLayout>
    );
  }
}

export default ClientsPage;