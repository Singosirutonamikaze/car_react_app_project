import { useEffect, useState } from "react";
import { FaGauge } from "react-icons/fa6";
import { FiArrowLeft, FiDollarSign, FiDroplet, FiMapPin } from "react-icons/fi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ROUTES from "../../../../router";
import PresentationLayout from "../../../../shared/components/layouts/PresentationLayout";
import Loading from "../../../../shared/components/ui/Loading";
import useAuth from "../../../../shared/hooks/auth";
import { carService } from "../../../../shared/services/car";
import type { Car } from "../../../../shared/types/car";

function CarDetailsPage() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        const carData = await carService.getCarById(id);
        setCar(carData);
      } catch (err) {
        setError("Erreur lors du chargement des details de la voiture");
        toast.error("Impossible de charger les details de la voiture");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (isAuthenticated) {
    return <Navigate to={ROUTES.ORDERS} replace />;
  }

  if (loading) {
    return (
      <PresentationLayout activeItem="/voitures">
        <Loading />
      </PresentationLayout>
    );
  }

  if (error || !car) {
    return (
      <PresentationLayout activeItem="/recherche">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 client-theme-text-secondary hover:client-theme-text-primary mb-6 transition-colors"
          >
            <FiArrowLeft />
            Retour
          </button>
          <div className="flex justify-center items-center min-h-96">
            <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-700/30">
              {error || "Voiture non trouvee"}
            </div>
          </div>
        </div>
      </PresentationLayout>
    );
  }

  return (
    <PresentationLayout activeItem="/recherche">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 client-theme-text-secondary mb-4 text-sm"
        >
          <FiArrowLeft />
          Retour aux resultats
        </button>

        <div className="client-theme-card-soft rounded-lg overflow-hidden border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
            <div className="h-80 client-layout-gradient flex items-center justify-center rounded-lg overflow-hidden border client-theme-card-soft">
              {car.image ? (
                <img
                  src={car.image}
                  alt={`${car.marque} ${car.modelCar}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="client-theme-text-secondary flex flex-col items-center">
                  <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-sm">Image non disponible</span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-semibold client-theme-text-primary">
                    {car.marque} {car.modelCar}
                  </h1>
                  <span className="client-theme-chip text-sm px-3 py-1 rounded-lg border">{car.year}</span>
                </div>

                <div className="flex items-center mb-5">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${car.disponible ? "bg-green-500" : "bg-red-500"}`}></span>
                  <span className={`text-sm ${car.disponible ? "text-green-300" : "text-red-300"}`}>
                    {car.disponible ? "Disponible" : "Non disponible"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  <div className="flex items-center client-theme-text-secondary text-sm">
                    <FaGauge className="w-4 h-4 mr-2" />
                    <span>{car.kilometrage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center client-theme-text-secondary text-sm">
                    <FiDroplet className="w-4 h-4 mr-2" />
                    <span>{car.carburant}</span>
                  </div>
                  <div className="flex items-center client-theme-text-secondary text-sm">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    <span>{car.ville}</span>
                  </div>
                  <div className="flex items-center client-theme-text-secondary text-sm">
                    <FiDollarSign className="w-4 h-4 mr-2" />
                    <span>{car.price.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="mb-5">
                  <h2 className="text-lg font-semibold client-theme-text-primary mb-2">Description</h2>
                  <p className="client-theme-text-secondary text-sm leading-6">{car.description}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-5 border-t client-border-t">
                <span className="text-xl font-semibold client-theme-text-primary">{car.price.toLocaleString()} FCFA</span>
                <button className="client-theme-button border px-5 py-2 rounded-lg text-sm font-medium">
                  {car.disponible ? "Commander" : "Indisponible"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PresentationLayout>
  );
}

export default CarDetailsPage;
