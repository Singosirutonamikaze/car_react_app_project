// src/app/presentation/pages/CarDetailsPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PresentationLayout from "../../../shared/components/layouts/PresentationLayout";
import { carService } from "../../../shared/services/carService";
import type { Car } from "../../../shared/types/car";
import { FiArrowLeft, FiMapPin, FiDroplet, FiDollarSign } from "react-icons/fi";
import { FaGauge } from "react-icons/fa6";
import Loading from "../../../shared/components/ui/Loading";

function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const carData = await carService.getCarById(id);
        setCar(carData);
      } catch (err) {
        setError("Erreur lors du chargement des détails de la voiture");
        toast.error("Impossible de charger les détails de la voiture");
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
            className="flex items-center gap-2 text-blue-300 hover:text-white mb-6 transition-colors"
          >
            <FiArrowLeft />
            Retour
          </button>
          <div className="flex justify-center items-center min-h-96">
            <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-700/30">
              {error || "Voiture non trouvée"}
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
          className="flex items-center gap-2 text-blue-300 hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft />
          Retour aux résultats
        </button>

        <div className="bg-blue-900/30 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-blue-700/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            <div className="h-96 bg-gradient-to-r from-blue-800 to-blue-900 flex items-center justify-center rounded-lg overflow-hidden">
              {car.image ? (
                <img
                  src={car.image}
                  alt={`${car.marque} ${car.modelCar}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-blue-200 flex flex-col items-center">
                  <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-lg">Image non disponible</span>
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-white">
                    {car.marque} {car.modelCar}
                  </h1>
                  <span className="text-blue-200 text-lg bg-blue-800/40 px-3 py-1 rounded-full">
                    {car.year}
                  </span>
                </div>

                <div className="flex items-center mb-6">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${car.disponible ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={`text-lg ${car.disponible ? 'text-green-300' : 'text-red-300'}`}>
                    {car.disponible ? 'Disponible' : 'Non disponible'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-blue-200">
                    <FaGauge className="w-5 h-5 mr-2" />
                    <span>{car.kilometrage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <FiDroplet className="w-5 h-5 mr-2" />
                    <span>{car.carburant}</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <FiMapPin className="w-5 h-5 mr-2" />
                    <span>{car.ville}</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <FiDollarSign className="w-5 h-5 mr-2" />
                    <span>{car.price.toLocaleString()} frcfa</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
                  <p className="text-blue-200">{car.description}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-blue-700/30">
                <span className="text-3xl font-bold text-white">
                  {car.price.toLocaleString()} frcfa
                </span>
                <button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300"
                >
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