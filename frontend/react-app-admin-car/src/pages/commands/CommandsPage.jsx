import { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuPlus, LuClipboardList } from "react-icons/lu";
import Model from "../../components/models/Model";
import EditCommandForm from "../../components/Commands/EditCommandsForm";
import AddCommandForm from "../../components/Commands/AddCommandsForm";
import DeleteAlert from "../../components/alerts/DeleteAlert";
import CommandsCharts from "../../components/charts/CommandsCharts";
import CommandsList from "../../components/Commands/CommandsList";
import { useOrders } from "../../hooks/orders/useOrders";
import { useCars } from "../../hooks/cars/useCars";
import { useClients } from "../../hooks/clients/useClients";

const CommandsPage = () => {
  const {
    orders,
    loading: ordersLoading,
    addOrder,
    editOrder,
    removeOrder,
    fetchOrders,
    downloadOrdersFile,
  } = useOrders();
  const { cars, loading: carsLoading } = useCars();
  const { clients, loading: clientsLoading } = useClients();

  const [openCommandModel, setOpenCommandModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [commandToEdit, setCommandToEdit] = useState(null);

  const loading = ordersLoading || carsLoading || clientsLoading;

  const handleAddCommand = async (command) => {
    await addOrder(command);
    setOpenCommandModel(false);
  };

  const handleEditCommand = async (updatedCommand) => {
    await editOrder(updatedCommand._id, updatedCommand);
    setOpenEditModel(false);
    setCommandToEdit(null);
  };

  const deleteCommand = async (id) => {
    await removeOrder(id);
    setOpenDeleteAlert({ show: false, data: null });
  };

  const handleDownloadCommands = async () => {
    await downloadOrdersFile();
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Commandes">
        <div className="w-full h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            <p className="text-slate-400">Chargement des commandes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Commandes">
      <div className="page-shell">
        {/* En-tête */}
        <div className="page-header-card">
          <div className="page-header-left">
            <div className="page-header-icon">
              <LuClipboardList className="text-white text-xl" />
            </div>
            <div>
              <h1 className="page-title">Liste des Commandes</h1>
              <p className="page-subtitle">
                Gérez les commandes de vos clients
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpenCommandModel(true)}
            className="page-action-btn"
          >
            <LuPlus className="text-xl" />
            Ajouter une Commande
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-6">
          <CommandsCharts dataCommands={orders} />
          <CommandsList
            commands={orders}
            onDeleteCommand={(command) =>
              setOpenDeleteAlert({ show: true, data: command })
            }
            onEditCommand={(command) => {
              setCommandToEdit(command);
              setOpenEditModel(true);
            }}
            onRefresh={fetchOrders}
            onDownload={handleDownloadCommands}
          />
        </div>

        {/* Modal Ajouter */}
        <Model
          isOpen={openCommandModel}
          onClose={() => setOpenCommandModel(false)}
          title="Ajouter une Commande"
        >
          <AddCommandForm
            cars={cars}
            clients={clients}
            onAddCommand={async (command, reset) => {
              await handleAddCommand(command);
              reset?.();
            }}
          />
        </Model>

        {/* Modal Modifier */}
        <Model
          isOpen={openEditModel}
          onClose={() => {
            setOpenEditModel(false);
            setCommandToEdit(null);
          }}
          title="Modifier la commande"
        >
          <EditCommandForm
            command={commandToEdit}
            cars={cars}
            clients={clients}
            onSave={handleEditCommand}
            onCancel={() => {
              setOpenEditModel(false);
              setCommandToEdit(null);
            }}
          />
        </Model>

        {/* Modal Supprimer */}
        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Supprimer la commande"
        >
          <DeleteAlert
            message="Supprimer cette commande ?"
            onDelete={() =>
              openDeleteAlert.data?._id &&
              deleteCommand(openDeleteAlert.data._id)
            }
            onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
          />
        </Model>
      </div>
    </DashboardLayout>
  );
};

export default CommandsPage;
