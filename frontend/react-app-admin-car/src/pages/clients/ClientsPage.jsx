import { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuPlus, LuUsers } from "react-icons/lu";
import ClientsChartsLine from "../../components/Clients/ClientsOverview";
import ClientsList from "../../components/Clients/ClientsList";
import AddClientsForm from "../../components/Clients/AddClientsForm";
import EditClientsForm from "../../components/Clients/EditClientsForm";
import Model from "../../components/models/Model";
import DeleteAlert from "../../components/alerts/DeleteAlert";
import { useClients } from "../../hooks/clients/useClients";

const ClientsPage = () => {
  const {
    clients,
    loading,
    addClient,
    editClient,
    removeClient,
    fetchClients,
    downloadClientsFile,
  } = useClients();
  const [openClientModel, setOpenClientModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [clientToEdit, setClientToEdit] = useState(null);

  const handleAddClient = async (client) => {
    await addClient(client);
    setOpenClientModel(false);
  };

  const handleEditClient = async (updatedClient) => {
    await editClient(updatedClient._id, updatedClient);
    setOpenEditModel(false);
    setClientToEdit(null);
  };

  const deleteClient = async (id) => {
    await removeClient(id);
    setOpenDeleteAlert({ show: false, data: null });
  };

  const handleDownloadClients = async () => {
    await downloadClientsFile();
  };

  const handleBulkDeleteClients = async (ids = []) => {
    if (!Array.isArray(ids) || ids.length === 0) {
      return;
    }

    const shouldDelete = globalThis.confirm(
      `Supprimer ${ids.length} client(s) sélectionné(s) ?`,
    );

    if (!shouldDelete) {
      return;
    }

    await Promise.all(ids.map((id) => removeClient(id)));
    await fetchClients();
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Liste des Clients">
        <div className="w-full h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            <p className="text-slate-400">Chargement des clients...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Liste des Clients">
      <div className="page-shell">
        {/* En-tête */}
        <div className="page-header-card">
          <div className="page-header-left">
            <div className="page-header-icon">
              <LuUsers className="text-white text-xl" />
            </div>
            <div>
              <h1 className="page-title">Liste des Clients</h1>
              <p className="page-subtitle">Gérez votre base clientèle</p>
            </div>
          </div>
          <button
            onClick={() => setOpenClientModel(true)}
            className="page-action-btn"
          >
            <LuPlus className="text-xl" />
            Ajouter un Client
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-6">
          <ClientsChartsLine dataClients={clients} />
          <ClientsList
            clients={clients}
            onDeleteClient={(client) =>
              setOpenDeleteAlert({ show: true, data: client })
            }
            onEditClient={(client) => {
              setClientToEdit(client);
              setOpenEditModel(true);
            }}
            onRefresh={fetchClients}
            onDownload={handleDownloadClients}
            onBulkDeleteSelected={handleBulkDeleteClients}
          />
        </div>

        {/* Modal Ajouter */}
        <Model
          isOpen={openClientModel}
          onClose={() => setOpenClientModel(false)}
          title="Ajouter un Client"
        >
          <AddClientsForm
            onAddClient={async (client, reset) => {
              await handleAddClient(client);
              reset?.();
            }}
          />
        </Model>

        {/* Modal Modifier */}
        <Model
          isOpen={openEditModel}
          onClose={() => {
            setOpenEditModel(false);
            setClientToEdit(null);
          }}
          title="Modifier le client"
        >
          <EditClientsForm
            client={clientToEdit}
            onSave={handleEditClient}
            onCancel={() => {
              setOpenEditModel(false);
              setClientToEdit(null);
            }}
          />
        </Model>

        {/* Modal Supprimer */}
        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Supprimer le client"
        >
          <DeleteAlert
            message={
              openDeleteAlert.data
                ? `Supprimer ${openDeleteAlert.data.name || openDeleteAlert.data.nom || ""} ${openDeleteAlert.data.surname || openDeleteAlert.data.prenom || ""} ?`
                : "Supprimer ce client ?"
            }
            onDelete={() =>
              openDeleteAlert.data?._id &&
              deleteClient(openDeleteAlert.data._id)
            }
            onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
          />
        </Model>
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage;
