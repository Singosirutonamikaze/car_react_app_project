import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { LuPlus } from 'react-icons/lu';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import Model from '../components/models/Model';
import AddSalesForm from '../components/Sales/AddSalesForm';
import EditSalesForm from '../components/Sales/EditSalesForm';
import DeleteAlert from '../components/alerts/DeleteAlert';
import SalesCharts from '../components/charts/SalesCharts';
import SalesList from '../components/Sales/SalesList';


class SalesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salesData: [],
      carsData: [],
      clientsData: [],
      ordersData: [],
      openSaleModel: false,
      openEditModel: false,
      loading: false,
      openDeleteAlert: {
        show: false,
        data: null
      },
      saleToEdit: null
    };
  }

  componentDidMount() {
    this.fetchSalesData();
    this.fetchOptionsData();
  }

  fetchSalesData = async () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.SALES.GET_ALL}`
      );

      if (response.data) {
        console.log("Données de ventes reçues:", response.data);
        this.setState({ salesData: response.data });
      }
    } catch (error) {
      console.log('Erreur de récupération des ventes :', error);
      toast.error("Erreur lors de la récupération des ventes.");
    } finally {
      this.setState({ loading: false });
    }
  };

  fetchOptionsData = async () => {
    try {
      // Récupérer les voitures, clients et commandes pour les formulaires
      const [carsResponse, clientsResponse, ordersResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.CARS.GET_ALL),
        axiosInstance.get(API_PATHS.CLIENTS.GET_ALL),
        axiosInstance.get(API_PATHS.ORDERS.GET_ALL)
      ]);

      this.setState({
        carsData: carsResponse.data?.data || carsResponse.data || [],
        clientsData: clientsResponse.data?.data || clientsResponse.data || [],
        ordersData: ordersResponse.data?.data || ordersResponse.data || []
      });
    } catch (error) {
      console.log('Erreur de récupération des options :', error);
      toast.error("Erreur lors de la récupération des options.");
    }
  };

  handleAddSale = async (sale) => {
    const { voiture, client, commande, prixVente, statut, dateVente, numeroTransaction, notes } = sale;

    // Validation des champs obligatoires
    if (!voiture) {
      toast.error("La sélection d'une voiture est obligatoire.");
      return;
    }

    if (!client) {
      toast.error("La sélection d'un client est obligatoire.");
      return;
    }

    if (!prixVente || prixVente <= 0) {
      toast.error("Le prix de vente doit être supérieur à 0.");
      return;
    }

    if (!statut) {
      toast.error("Le statut est obligatoire.");
      return;
    }

    try {
      await axiosInstance.post(
        `${API_PATHS.SALES.CREATE}`,
        {
          voiture,
          client,
          commande: commande || null,
          prixVente: parseFloat(prixVente),
          statut,
          dateVente: dateVente || new Date(),
          numeroTransaction: numeroTransaction || null,
          notes: notes || null
        }
      );

      this.setState({
        openSaleModel: false
      });
      toast.success("Vente enregistrée avec succès.");
      this.fetchSalesData();

    } catch (error) {
      console.error('Erreur d\'ajout de la vente :', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de l'enregistrement de la vente.");
      }
    }
  };

  handleEditSale = async (updatedSale) => {
    const { _id, voiture, client, commande, prixVente, statut, dateVente, numeroTransaction, notes } = updatedSale;

    // Validation des champs obligatoires
    if (!voiture) {
      toast.error("La sélection d'une voiture est obligatoire.");
      return;
    }

    if (!client) {
      toast.error("La sélection d'un client est obligatoire.");
      return;
    }

    if (!prixVente || prixVente <= 0) {
      toast.error("Le prix de vente doit être supérieur à 0.");
      return;
    }

    if (!statut) {
      toast.error("Le statut est obligatoire.");
      return;
    }

    try {
      const cleanedData = {
        voiture,
        client,
        commande: commande || null,
        prixVente: parseFloat(prixVente),
        statut,
        dateVente: dateVente || new Date(),
        numeroTransaction: numeroTransaction || null,
        notes: notes || null
      };

      const response = await axiosInstance.put(
        API_PATHS.SALES.UPDATE(_id),
        cleanedData
      );

      toast.success('Vente modifiée avec succès.');
      this.fetchSalesData();
      this.setState({
        openEditModel: false,
        saleToEdit: null
      });

    } catch (error) {
      console.error('Erreur de modification de la vente :', error);

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

  openEditModal = (sale) => {
    this.setState({
      openEditModel: true,
      saleToEdit: sale
    });
  };

  openDeleteAlert = (alertData) => {
    this.setState({ openDeleteAlert: alertData });
  };

  deleteSale = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.SALES.DELETE(id));

      this.setState({ openDeleteAlert: { show: false, data: null } });
      toast.success("Vente supprimée avec succès.");
      this.fetchSalesData();
    } catch (error) {
      console.log('Erreur de suppression de la vente :', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de la suppression de la vente.");
      }
    }
  };

  handleDownloadSales = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.SALES.EXPORT}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ventes.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PDF des ventes téléchargé avec succès.");

    } catch (error) {
      console.log('Erreur de téléchargement des ventes :', error);
      toast.error("Erreur lors du téléchargement du PDF des ventes.");
    }
  };

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <DashboardLayout activeMenu="Liste des Ventes">
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
      <DashboardLayout activeMenu="Liste des Ventes">
        <div className="w-full h-full min-h-screen bg-gradient-to-br from-[#010B18] via-[#010B18]/95 to-[#010B18]/90 p-6">
          <div className="flex items-center justify-between p-3">
            <div>
              <h1 className="text-slate-100 text-2xl font-bold">Liste des Ventes</h1>
              <p className="text-slate-400">Voici la liste de toutes les ventes</p>
            </div>
            <button
              onClick={() => this.setState({ openSaleModel: true })}
              className="mt-4 bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              Ajouter une Vente
              <LuPlus />
            </button>
          </div>

          <div className="mt-4 space-y-6">
            <SalesCharts dataSales={this.state.salesData} />
            <SalesList
              sales={this.state.salesData}
              onDeleteSale={sale => this.setState({ openDeleteAlert: { show: true, data: sale } })}
              onEditSale={this.openEditModal}
              onRefresh={this.fetchSalesData}
              onDownload={this.handleDownloadSales}
            />
          </div>

          <Model
            isOpen={this.state.openSaleModel}
            onClose={() => this.setState({ openSaleModel: false })}
            title="Ajouter une Vente"
          >
            <AddSalesForm
              onAddSale={async (sale, resetForm) => {
                await this.handleAddSale(sale);
                if (resetForm) {
                  resetForm();
                }
              }}
              cars={this.state.carsData}
              clients={this.state.clientsData}
              orders={this.state.ordersData}
            />
          </Model>

          <Model
            isOpen={this.state.openEditModel}
            onClose={() => this.setState({
              openEditModel: false,
              saleToEdit: null
            })}
            title="Modifier la vente"
          >
            <EditSalesForm
              sale={this.state.saleToEdit}
              onSave={this.handleEditSale}
              onCancel={() => this.setState({
                openEditModel: false,
                saleToEdit: null
              })}
              cars={this.state.carsData}
              clients={this.state.clientsData}
              orders={this.state.ordersData}
            />
          </Model>

          <Model
            isOpen={this.state.openDeleteAlert.show}
            onClose={() => this.setState({ openDeleteAlert: { show: false, data: null } })}
            title="Supprimer la vente"
          >
            <DeleteAlert
              message={
                this.state.openDeleteAlert.data && this.state.openDeleteAlert.data.voiture
                  ? `Voulez-vous vraiment supprimer la vente de ${this.state.openDeleteAlert.data.voiture.marque} ${this.state.openDeleteAlert.data.voiture.modelCar} ?`
                  : 'Voulez-vous vraiment supprimer cette vente ?'
              }
              onDelete={() => {
                if (this.state.openDeleteAlert.data && this.state.openDeleteAlert.data._id) {
                  this.deleteSale(this.state.openDeleteAlert.data._id);
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

export default SalesPage;