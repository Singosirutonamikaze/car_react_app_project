import { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuPlus, LuTrendingUp } from "react-icons/lu";
import Model from "../../components/models/Model";
import AddSalesForm from "../../components/Sales/AddSalesForm";
import EditSalesForm from "../../components/Sales/EditSalesForm";
import DeleteAlert from "../../components/alerts/DeleteAlert";
import SalesCharts from "../../components/charts/SalesCharts";
import SalesList from "../../components/Sales/SalesList";
import { useSales } from "../../hooks/sales/useSales";
import { useCars } from "../../hooks/cars/useCars";
import { useClients } from "../../hooks/clients/useClients";
import { useOrders } from "../../hooks/orders/useOrders";

const SalesPage = () => {
  const {
    sales,
    loading: salesLoading,
    addSale,
    editSale,
    removeSale,
    fetchSales,
    exportSalesFile,
  } = useSales();
  const { cars, loading: carsLoading } = useCars();
  const { clients, loading: clientsLoading } = useClients();
  const { orders, loading: ordersLoading } = useOrders();

  const [openSaleModel, setOpenSaleModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [saleToEdit, setSaleToEdit] = useState(null);

  const loading =
    salesLoading || carsLoading || clientsLoading || ordersLoading;

  const handleAddSale = async (sale) => {
    await addSale(sale);
    setOpenSaleModel(false);
  };

  const handleEditSale = async (updatedSale) => {
    await editSale(updatedSale._id, updatedSale);
    setOpenEditModel(false);
    setSaleToEdit(null);
  };

  const deleteSale = async (id) => {
    await removeSale(id);
    setOpenDeleteAlert({ show: false, data: null });
  };

  const handleDownloadSales = async () => {
    await exportSalesFile();
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Ventes">
        <div className="w-full h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            <p className="text-slate-400">Chargement des ventes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Ventes">
      <div className="page-shell">
        {/* En-tête */}
        <div className="page-header-card">
          <div className="page-header-left">
            <div className="page-header-icon">
              <LuTrendingUp className="text-white text-xl" />
            </div>
            <div>
              <h1 className="page-title">Tableau des Ventes</h1>
              <p className="page-subtitle">Suivez et gérez vos transactions</p>
            </div>
          </div>
          <button
            onClick={() => setOpenSaleModel(true)}
            className="page-action-btn"
          >
            <LuPlus className="text-xl" />
            Ajouter une Vente
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-6">
          <SalesCharts dataSales={sales} />
          <SalesList
            sales={sales}
            onDeleteSale={(sale) =>
              setOpenDeleteAlert({ show: true, data: sale })
            }
            onEditSale={(sale) => {
              setSaleToEdit(sale);
              setOpenEditModel(true);
            }}
            onRefresh={fetchSales}
            onDownload={handleDownloadSales}
          />
        </div>

        {/* Modal Ajouter */}
        <Model
          isOpen={openSaleModel}
          onClose={() => setOpenSaleModel(false)}
          title="Ajouter une Vente"
        >
          <AddSalesForm
            cars={cars}
            clients={clients}
            orders={orders}
            onAddSale={async (sale, reset) => {
              await handleAddSale(sale);
              reset?.();
            }}
          />
        </Model>

        {/* Modal Modifier */}
        <Model
          isOpen={openEditModel}
          onClose={() => {
            setOpenEditModel(false);
            setSaleToEdit(null);
          }}
          title="Modifier la vente"
        >
          <EditSalesForm
            sale={saleToEdit}
            cars={cars}
            clients={clients}
            orders={orders}
            onSave={handleEditSale}
            onCancel={() => {
              setOpenEditModel(false);
              setSaleToEdit(null);
            }}
          />
        </Model>

        {/* Modal Supprimer */}
        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Supprimer la vente"
        >
          <DeleteAlert
            message="Supprimer cette vente ?"
            onDelete={() =>
              openDeleteAlert.data?._id && deleteSale(openDeleteAlert.data._id)
            }
            onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
          />
        </Model>
      </div>
    </DashboardLayout>
  );
};

export default SalesPage;
