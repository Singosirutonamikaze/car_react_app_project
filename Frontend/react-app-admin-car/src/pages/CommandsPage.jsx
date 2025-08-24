import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { LuPlus } from 'react-icons/lu';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../service/axiosInstance';
import Model from '../components/models/Model';
import EditCommandForm from '../components/Commands/EditCommandsForm';
import AddCommandForm from '../components/Commands/AddCommandsForm';
import DeleteAlert from '../components/alerts/DeleteAlert';
import CommandsCharts from '../components/charts/CommandsCharts';
import CommandsList from '../components/Commands/CommandsList';


class CommandsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commandsData: [],
      carsData: [],
      clientsData: [],
      openCommandModel: false,
      openEditModel: false,
      loading: false,
      openDeleteAlert: {
        show: false,
        data: null
      },
      commandToEdit: null
    };
  }

  componentDidMount() {
    this.fetchCommandsData();
    this.fetchOptionsData();
  }

  fetchCommandsData = async () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.ORDERS.GET_ALL}`
      );

      if (response.data) {
        let commandsData;
        if (Array.isArray(response.data)) {
          commandsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          commandsData = response.data.data;
        } else if (response.data.commands && Array.isArray(response.data.commands)) {
          commandsData = response.data.commands;
        } else {
          commandsData = [];
        }

        this.setState({ commandsData: commandsData });
      }
    } catch (error) {
      console.log('Erreur de récupération des commandes :', error);
      toast.error("Erreur lors de la récupération des commandes.");
    } finally {
      this.setState({ loading: false });
    }
  };

  fetchOptionsData = async () => {
    try {
      const [carsResponse, clientsResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.CARS.GET_ALL),
        axiosInstance.get(API_PATHS.CLIENTS.GET_ALL)
      ]);

      this.setState({
        carsData: carsResponse.data?.data || carsResponse.data || [],
        clientsData: clientsResponse.data?.data || clientsResponse.data || []
      });
    } catch (error) {
      console.log('Erreur de récupération des options :', error);
      toast.error("Erreur lors de la récupération des options.");
    }
  };

  handleAddCommand = async (command) => {
    const {
      voiture,
      client,
      montant,
      fraisLivraison,
      modePaiement,
      adresseLivraison,
      dateLivraisonPrevue,
      notes
    } = command;

    if (!voiture) {
      toast.error("La sélection d'une voiture est obligatoire.");
      return;
    }

    if (!client) {
      toast.error("La sélection d'un client est obligatoire.");
      return;
    }

    if (!montant || montant <= 0) {
      toast.error("Le montant doit être supérieur à 0.");
      return;
    }

    if (!modePaiement) {
      toast.error("Le mode de paiement est obligatoire.");
      return;
    }

    if (!adresseLivraison?.rue || !adresseLivraison?.ville || !adresseLivraison?.codePostal) {
      toast.error("L'adresse de livraison complète est obligatoire.");
      return;
    }

    try {
      await axiosInstance.post(
        `${API_PATHS.ORDERS.CREATE}`,
        {
          voiture,
          client,
          montant: parseFloat(montant),
          fraisLivraison: parseFloat(fraisLivraison) || 0,
          modePaiement,
          adresseLivraison,
          dateLivraisonPrevue: dateLivraisonPrevue || null,
          notes: notes || null
        }
      );

      this.setState({
        openCommandModel: false
      });
      toast.success("Commande enregistrée avec succès.");
      this.fetchCommandsData();

    } catch (error) {
      console.error('Erreur d\'ajout de la commande :', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de l'enregistrement de la commande.");
      }
    }
  };

  handleEditCommand = async (updatedCommand) => {
    const {
      _id,
      voiture,
      client,
      montant,
      fraisLivraison,
      modePaiement,
      statut,
      adresseLivraison,
      dateLivraisonPrevue,
      dateLivraisonReelle,
      notes
    } = updatedCommand;

    if (!voiture) {
      toast.error("La sélection d'une voiture est obligatoire.");
      return;
    }

    if (!client) {
      toast.error("La sélection d'un client est obligatoire.");
      return;
    }

    if (!montant || montant <= 0) {
      toast.error("Le montant doit être supérieur à 0.");
      return;
    }

    if (!modePaiement) {
      toast.error("Le mode de paiement est obligatoire.");
      return;
    }

    try {
      const cleanedData = {
        voiture,
        client,
        montant: parseFloat(montant),
        fraisLivraison: parseFloat(fraisLivraison) || 0,
        modePaiement,
        statut: statut || 'En attente',
        adresseLivraison,
        dateLivraisonPrevue: dateLivraisonPrevue || null,
        dateLivraisonReelle: dateLivraisonReelle || null,
        notes: notes || null
      };

      await axiosInstance.put(
        API_PATHS.ORDERS.UPDATE(_id),
        cleanedData
      );

      toast.success('Commande modifiée avec succès.');
      this.fetchCommandsData();
      this.setState({
        openEditModel: false,
        commandToEdit: null
      });

    } catch (error) {
      console.error('Erreur de modification de la commande :', error);

      if (error.response) {
        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          error.response.statusText;
        toast.error(`Erreur ${error.response.status}: ${errorMessage}`);
      } else if (error.request) {
        toast.error('Pas de réponse du serveur');
      } else {
        toast.error(`Erreur: ${error.message}`);
      }
    }
  };

  openEditModal = (command) => {
    this.setState({
      openEditModel: true,
      commandToEdit: command
    });
  };

  openDeleteAlert = (alertData) => {
    this.setState({ openDeleteAlert: alertData });
  };

  deleteCommand = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.ORDERS.DELETE(id));

      this.setState({ openDeleteAlert: { show: false, data: null } });
      toast.success("Commande supprimée avec succès.");
      this.fetchCommandsData();
    } catch (error) {
      console.log('Erreur de suppression de la commande :', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de la suppression de la commande.");
      }
    }
  };

  handleDownloadCommands = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.ORDERS.DOWNLOAD}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'commandes.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("CSV des commandes téléchargé avec succès.");

    } catch (error) {
      console.log('Erreur de téléchargement des commandes :', error);
      toast.error("Erreur lors du téléchargement du CSV des commandes.");
    }
  };

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <DashboardLayout activeMenu="Liste des Commandes">
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
      <DashboardLayout activeMenu="Liste des Commandes">
        <div className="w-full h-full min-h-screen bg-gradient-to-br from-[#010B18] via-[#010B18]/95 to-[#010B18]/90 p-6">
          <div className="flex items-center justify-between p-3">
            <div>
              <h1 className="text-slate-100 text-2xl font-bold">Liste des Commandes</h1>
              <p className="text-slate-400">Voici la liste de toutes les commandes</p>
            </div>
            <button
              onClick={() => this.setState({ openCommandModel: true })}
              className="mt-4 bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              Ajouter une Commande
              <LuPlus />
            </button>
          </div>

          <div className="mt-4 space-y-6">
            <CommandsCharts dataCommands={this.state.commandsData} />
            <CommandsList
              commands={this.state.commandsData}
              onDeleteCommand={command => this.setState({ openDeleteAlert: { show: true, data: command } })}
              onEditCommand={this.openEditModal}
              onRefresh={this.fetchCommandsData}
              onDownload={this.handleDownloadCommands}
            />
          </div>

          <Model
            isOpen={this.state.openCommandModel}
            onClose={() => this.setState({ openCommandModel: false })}
            title="Ajouter une Commande"
          >
            <AddCommandForm
              onAddCommand={async (command, resetForm) => {
                await this.handleAddCommand(command);
                if (resetForm) {
                  resetForm();
                }
              }}
              cars={this.state.carsData}
              clients={this.state.clientsData}
            />
          </Model>

          <Model
            isOpen={this.state.openEditModel}
            onClose={() => this.setState({
              openEditModel: false,
              commandToEdit: null
            })}
            title="Modifier la commande"
          >
            <EditCommandForm
              command={this.state.commandToEdit}
              onSave={this.handleEditCommand}
              onCancel={() => this.setState({
                openEditModel: false,
                commandToEdit: null
              })}
              cars={this.state.carsData}
              clients={this.state.clientsData}
            />
          </Model>

          <Model
            isOpen={this.state.openDeleteAlert.show}
            onClose={() => this.setState({ openDeleteAlert: { show: false, data: null } })}
            title="Supprimer la commande"
          >
            <DeleteAlert
              message={
                this.state.openDeleteAlert.data && this.state.openDeleteAlert.data.voiture
                  ? `Voulez-vous vraiment supprimer la commande de ${this.state.openDeleteAlert.data.voiture.marque} ${this.state.openDeleteAlert.data.voiture.modelCar} ?`
                  : 'Voulez-vous vraiment supprimer cette commande ?'
              }
              onDelete={() => {
                if (this.state.openDeleteAlert.data && this.state.openDeleteAlert.data._id) {
                  this.deleteCommand(this.state.openDeleteAlert.data._id);
                }
              }}
              onCancel={() => this.setState({ openDeleteAlert: { show: false, data: null } })}
            />
          </Model>
        </div>
      </DashboardLayout>
    );
  }
}

export default CommandsPage;