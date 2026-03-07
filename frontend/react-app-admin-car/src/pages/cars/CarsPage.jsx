import { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DeleteAlert from "../../components/alerts/DeleteAlert";
import Model from "../../components/models/Model";
import EditCarsForm from "../../components/Cars/EditCarsForm";
import AddCarsForm from "../../components/Cars/AddCarsForm";
import CarsChartsBar from "../../components/charts/CarsChartsBar";
import CarsList from "../../components/Cars/CarsList";
import { LuPlus, LuCar } from "react-icons/lu";
import { useCars } from "../../hooks/cars/useCars";

const CarsPage = () => {
  const {
    cars,
    loading,
    addCar,
    editCar,
    removeCar,
    fetchCars,
    downloadCarsFile,
  } = useCars();
  const [openCarModel, setOpenCarModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [carToEdit, setCarToEdit] = useState(null);

  const handleAddCar = async (car) => {
    await addCar(car);
    setOpenCarModel(false);
  };

  const handleEditCar = async (updatedCar) => {
    await editCar(updatedCar._id, updatedCar);
    setOpenEditModel(false);
    setCarToEdit(null);
  };

  const deleteCar = async (id) => {
    await removeCar(id);
    setOpenDeleteAlert({ show: false, data: null });
  };

  const handleDownloadCars = async () => {
    await downloadCarsFile();
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Liste des Voitures">
        <div className="w-full h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            <p className="text-slate-400">Chargement des voitures...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Liste des Voitures">
      <div className="page-shell">
        {/* En-tête de page */}
        <div className="page-header-card">
          <div className="page-header-left">
            <div className="page-header-icon">
              <LuCar className="text-white text-xl" />
            </div>
            <div>
              <h1 className="page-title">Liste des Voitures</h1>
              <p className="page-subtitle">Gérez votre flotte automobile</p>
            </div>
          </div>
          <button
            onClick={() => setOpenCarModel(true)}
            className="page-action-btn"
          >
            <LuPlus className="text-xl" />
            Ajouter une Voiture
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-6">
          <CarsChartsBar dataCars={cars} />
          <CarsList
            cars={cars}
            onDeleteCar={(car) => setOpenDeleteAlert({ show: true, data: car })}
            onEditCar={(car) => {
              setCarToEdit(car);
              setOpenEditModel(true);
            }}
            onRefresh={fetchCars}
            onDownload={handleDownloadCars}
          />
        </div>

        {/* Modal Ajouter */}
        <Model
          isOpen={openCarModel}
          onClose={() => setOpenCarModel(false)}
          title="Ajouter une Voiture"
        >
          <AddCarsForm
            onAddCar={async (car, reset) => {
              await handleAddCar(car);
              reset?.();
            }}
          />
        </Model>

        {/* Modal Modifier */}
        <Model
          isOpen={openEditModel}
          onClose={() => {
            setOpenEditModel(false);
            setCarToEdit(null);
          }}
          title="Modifier la voiture"
        >
          <EditCarsForm
            car={carToEdit}
            onSave={handleEditCar}
            onCancel={() => {
              setOpenEditModel(false);
              setCarToEdit(null);
            }}
          />
        </Model>

        {/* Modal Supprimer */}
        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Supprimer la voiture"
        >
          <DeleteAlert
            message={
              openDeleteAlert.data?.marque
                ? `Supprimer la voiture ${openDeleteAlert.data.marque} ${openDeleteAlert.data.modelCar} ?`
                : "Supprimer cette voiture ?"
            }
            onDelete={() =>
              openDeleteAlert.data?._id && deleteCar(openDeleteAlert.data._id)
            }
            onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
          />
        </Model>
      </div>
    </DashboardLayout>
  );
};

export default CarsPage;
