import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import DeleteAlert from '../components/alerts/DeleteAlert';
import Model from '../components/models/Model';
import EditCarsForm from '../components/Cars/EditCarsForm';
import AddCarsForm from '../components/Cars/AddCarsForm';
import CarsChartsBar from '../components/charts/CarsChartsBar';
import CarsList from '../components/Cars/CarsList';
import { LuPlus } from 'react-icons/lu';

class CarsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carData: [],
      openCarModel: false,
      openEditModel: false,
      loading: false,
      openDeleteAlert: {
        show: false,
        data: null
      },
      carToEdit: null
    };
  }

  componentDidMount() {
    this.fetchCarData();
  }

  fetchCarData = async () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.CARS.GET_ALL}`
      );

      if (response.data) {
        console.log("Données de voitures reçues:", response.data);
        this.setState({ carData: response.data });
      }
    } catch (error) {
      console.log('Erreur de récupération des voitures :', error);
      toast.error("Erreur lors de la récupération des voitures.");
    } finally {
      this.setState({ loading: false });
    }
  };

  handleAddCar = async (car) => {
    const { marque, modelCar, year, price, description, couleur, kilometrage, carburant, ville } = car;

    if (!marque.trim()) {
      toast.error("Le champ marque est obligatoire.");
      return;
    }

    if (!modelCar.trim()) {
      toast.error("Le champ modèle est obligatoire.");
      return;
    }

    if (!year || year < 1990 || year > new Date().getFullYear() + 1) {
      toast.error("Veuillez entrer une année valide (1990 - " + (new Date().getFullYear() + 1) + ").");
      return;
    }

    if (!price || price <= 0) {
      toast.error("Le prix doit être supérieur à 0.");
      return;
    }

    if (!description || description.trim().length === 0) {
      toast.error("La description est obligatoire.");
      return;
    }

    if (description.length > 500) {
      toast.error("La description ne peut pas dépasser 500 caractères.");
      return;
    }

    if (!couleur) {
      toast.error("La couleur est obligatoire.");
      return;
    }

    if (kilometrage < 0) {
      toast.error("Le kilométrage ne peut pas être négatif.");
      return;
    }

    if (!carburant) {
      toast.error("Le type de carburant est obligatoire.");
      return;
    }

    if (!ville.trim()) {
      toast.error("La ville est obligatoire.");
      return;
    }

    try {
      await axiosInstance.post(
        `${API_PATHS.CARS.CREATE}`,
        {
          marque,
          modelCar,
          year: parseInt(year),
          price: parseFloat(price),
          description: description.trim(),
          couleur,
          kilometrage: parseInt(kilometrage) || 0,
          carburant,
          ville: ville.trim(),
          image: car.image || null,
          disponible: car.disponible !== undefined ? car.disponible : true
        }
      );

      this.setState({
        openCarModel: false
      });
      toast.success("Voiture ajoutée avec succès.");
      this.fetchCarData();

    } catch (error) {
      console.error('Erreur d\'ajout de la voiture :', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de l'ajout de la voiture.");
      }
    }
  };

  handleEditCar = async (updatedCar) => {
    const { marque, modelCar, year, price, description, couleur, kilometrage, carburant, ville, disponible } = updatedCar;

    console.log('DEBUG - Données reçues du formulaire:', updatedCar);

    // Validation des champs obligatoires
    if (!marque.trim()) {
      toast.error("Le champ marque est obligatoire.");
      return;
    }

    if (!modelCar.trim()) {
      toast.error("Le champ modèle est obligatoire.");
      return;
    }

    if (!year || year < 1990 || year > new Date().getFullYear() + 1) {
      toast.error("Veuillez entrer une année valide (1990 - " + (new Date().getFullYear() + 1) + ").");
      return;
    }

    if (!price || price <= 0) {
      toast.error("Le prix doit être supérieur à 0.");
      return;
    }

    if (!description || description.trim().length === 0) {
      toast.error("La description est obligatoire.");
      return;
    }

    if (description.length > 500) {
      toast.error("La description ne peut pas dépasser 500 caractères.");
      return;
    }

    if (!couleur) {
      toast.error("La couleur est obligatoire.");
      return;
    }

    if (kilometrage < 0) {
      toast.error("Le kilométrage ne peut pas être négatif.");
      return;
    }

    if (!carburant) {
      toast.error("Le type de carburant est obligatoire.");
      return;
    }

    if (!ville.trim()) {
      toast.error("La ville est obligatoire.");
      return;
    }

    try {
      const cleanedData = {
        _id: updatedCar._id,
        marque: marque.trim(),
        modelCar: modelCar.trim(),
        year: parseInt(year),
        price: parseFloat(price),
        description: description.trim(),
        couleur,
        kilometrage: parseInt(kilometrage),
        carburant,
        ville: ville.trim(),
        disponible: disponible !== undefined ? disponible : true
      };

      if (updatedCar.image) {
        cleanedData.image = updatedCar.image;
      }

      console.log('DEBUG - URL:', `${axiosInstance.defaults.baseURL}${API_PATHS.CARS.UPDATE(updatedCar._id)}`);
      console.log('DEBUG - Données nettoyées:', cleanedData);
      console.log('Envoi de la requête PUT...');

      const response = await axiosInstance.put(
        API_PATHS.CARS.UPDATE(updatedCar._id),
        cleanedData
      );

      console.log(' Réponse réussie:', response.data);

      toast.success('Voiture modifiée avec succès.');
      this.fetchCarData();
      this.setState({
        openEditModel: false,
        carToEdit: null
      });

    } catch (error) {
      console.group('ERREUR DÉTAILLÉE');
      console.log('Error object:', error);

      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response statusText:', error.response.statusText);
        console.log('Response data:', error.response.data);
        console.log('Response headers:', error.response.headers);

        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          error.response.statusText;

        toast.error(`Erreur ${error.response.status}: ${errorMessage}`);

      } else if (error.request) {
        console.log('Request made but no response:', error.request);
        toast.error('Pas de réponse du serveur');
      } else {
        console.log('Error setting up request:', error.message);
        toast.error(`Erreur: ${error.message}`);
      }

      console.groupEnd();
    }
  };

  openEditModal = (car) => {
    this.setState({
      openEditModel: true,
      carToEdit: car
    });
  };

  openDeleteAlert = (alertData) => {
    this.setState({ openDeleteAlert: alertData });
  };

  deleteCar = async (id) => {
    try {
      await axiosInstance.delete(`${API_PATHS.CARS.DELETE(id)}`);

      this.setState({ openDeleteAlert: { show: false, data: null } });
      toast.success("Voiture supprimée avec succès.");
      this.fetchCarData();
    } catch (error) {
      console.log('Erreur de suppression de la voiture :', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de la suppression de la voiture.");
      }
    }
  };

  handleDownloadCars = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.CARS.DOWNLOAD}`, {
        responseType: 'blob'
      });

      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('application/json')) {
        const errorData = JSON.parse(await response.data.text());
        console.log('Erreur serveur:', errorData);
        toast.error(errorData.message || "Erreur lors de la génération du PDF");
        return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'voitures.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => window.URL.revokeObjectURL(url), 100);

      toast.success("PDF des voitures téléchargé avec succès.");

    } catch (error) {
      console.error('Erreur de téléchargement des voitures :', error);

      if (error.response && error.response.data instanceof Blob) {

        
        const errorText = await error.response.data.text();
        try {
          const errorData = JSON.parse(errorText);
          toast.error(errorData.message || "Erreur lors du téléchargement");
        } catch (e) {
          toast.error("Erreur inconnue lors de la génération du PDF");
        }
      } else {
        toast.error(error.message || "Erreur lors du téléchargement du PDF");
      }
    }
  };

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <DashboardLayout activeMenu="Liste des Voitures">
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
      <DashboardLayout activeMenu="Liste des Voitures">
        <div className="w-full h-full min-h-screen bg-gradient-to-br from-[#010B18] via-[#010B18]/95 to-[#010B18]/90 p-6">
          <div className="flex items-center justify-between p-3">
            <div>
              <h1 className="text-slate-100 text-2xl font-bold">Liste des Voitures</h1>
              <p className="text-slate-400">Voici la liste de toutes les voitures</p>
            </div>
            <button
              onClick={() => this.setState({ openCarModel: true })}
              className="mt-4 bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              Ajouter une Voiture
              <LuPlus />
            </button>
          </div>

          <div className="mt-4 space-y-6">
            <CarsChartsBar dataCars={this.state.carData} />
            <CarsList
              cars={this.state.carData}
              onDeleteCar={car => this.setState({ openDeleteAlert: { show: true, data: car } })}
              onEditCar={this.openEditModal}
              onRefresh={this.fetchCarData}
              onDownload={this.handleDownloadCars}
            />
          </div>

          <Model
            isOpen={this.state.openCarModel}
            onClose={() => this.setState({ openCarModel: false })}
            title="Ajouter une Voiture"
          >
            <AddCarsForm onAddCar={async (car, resetForm) => {
              await this.handleAddCar(car);
              if (resetForm) {
                resetForm();
              }
            }} />
          </Model>

          <Model
            isOpen={this.state.openEditModel}
            onClose={() => this.setState({
              openEditModel: false,
              carToEdit: null
            })}
            title="Modifier la voiture"
          >
            <EditCarsForm
              car={this.state.carToEdit}
              onSave={this.handleEditCar}
              onCancel={() => this.setState({
                openEditModel: false,
                carToEdit: null
              })}
            />
          </Model>

          <Model
            isOpen={this.state.openDeleteAlert.show}
            onClose={() => this.setState({ openDeleteAlert: { show: false, data: null } })}
            title="Supprimer la voiture"
          >
            <DeleteAlert
              message={
                this.state.openDeleteAlert.data && this.state.openDeleteAlert.data.marque && this.state.openDeleteAlert.data.modelCar
                  ? `Voulez-vous vraiment supprimer la voiture ${this.state.openDeleteAlert.data.marque} ${this.state.openDeleteAlert.data.modelCar} ?`
                  : 'Voulez-vous vraiment supprimer cette voiture ?'
              }
              onDelete={() => {
                if (this.state.openDeleteAlert.data && this.state.openDeleteAlert.data._id) {
                  this.deleteCar(this.state.openDeleteAlert.data._id);
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

export default CarsPage;
