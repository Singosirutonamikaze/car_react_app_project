// src/app/presentation/components/car/CardSearchStyle.tsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { Car } from "../../../../shared/types/car";
import { carService } from "../../../../shared/services/carService";
import ROUTES from "../../../../router";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import Loading from "../../../../shared/components/ui/Loading";

function CardSearchStyle() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [villeFilter, setVilleFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const carsData = await carService.getAllCars();
        setCars(carsData);
        setFilteredCars(carsData);
      } catch (err) {
        setError("Erreur lors du chargement des voitures");
        toast.error("Impossible de charger les voitures");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    let results = cars;

    if (searchTerm) {
      results = results.filter(car =>
        car.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.modelCar.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (villeFilter) {
      results = results.filter(car =>
        car.ville.toLowerCase().includes(villeFilter.toLowerCase())
      );
    }

    setFilteredCars(results);
  }, [searchTerm, villeFilter, cars]);

  const handleDetailsClick = (carId: string) => {
    navigate(`${ROUTES.CARS}/${carId}`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setVilleFilter("");
  };

  const uniqueVilles = [...new Set(cars.map(car => car.ville))].sort();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-700/30 flex flex-col text-center gap-4">
          <span className="w-full m-auto"> <FiX /> </span>
          <div> {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Recherche de Voitures</h1>
        <p className="text-blue-200 max-w-2xl mx-auto">
          Trouvez la voiture parfaite qui correspond à vos besoins et préférences.
        </p>
      </div>

      <div className="bg-blue-900/30 backdrop-blur-md rounded-xl p-6 mb-8 border border-blue-700/30">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-blue-300" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par marque ou modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-blue-800/40 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-blue-700/50 hover:bg-blue-600/50 text-white rounded-lg transition-colors"
          >
            <FiFilter />
            Filtres
          </button>

          {(searchTerm || villeFilter) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-3 bg-red-700/50 hover:bg-red-600/50 text-white rounded-lg transition-colors"
            >
              <FiX />
              Réinitialiser
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Filtrer par ville
              </label>
              <select
                value={villeFilter}
                onChange={(e) => setVilleFilter(e.target.value)}
                className="w-full px-4 py-3 bg-blue-800/40 border border-blue-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les villes</option>
                {uniqueVilles.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {filteredCars.length} {filteredCars.length === 1 ? 'voiture trouvée' : 'voitures trouvées'}
        </h2>

        {(searchTerm || villeFilter) && (
          <button
            onClick={resetFilters}
            className="text-blue-300 hover:text-blue-100 text-sm flex items-center gap-1"
          >
            <FiX size={14} />
            Effacer les filtres
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCars.map((car) => (
          <div
            key={`${car.marque}-${car.modelCar}-${car.year}`}
            className="bg-blue-900/30 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            <div className="h-48 bg-gradient-to-r from-blue-800 to-blue-900 flex items-center justify-center overflow-hidden">
              {car.image ? (
                <img
                  src={car.image}
                  alt={`${car.marque} ${car.modelCar}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-blue-200 flex flex-col items-center">
                  <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-sm">Image non disponible</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white">
                  {car.marque} {car.modelCar}
                </h3>
                <span className="text-blue-200 text-sm bg-blue-800/40 px-2 py-1 rounded-full">
                  {car.year}
                </span>
              </div>

              <div className="flex items-center mb-4">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${car.disponible ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={`text-sm ${car.disponible ? 'text-green-300' : 'text-red-300'}`}>
                  {car.disponible ? 'Disponible' : 'Non disponible'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="flex items-center text-blue-200">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {car.kilometrage.toLocaleString()} km
                </div>
                <div className="flex items-center text-blue-200">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  {car.carburant}
                </div>
                <div className="flex items-center text-blue-200">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {car.ville}
                </div>
                <div className="flex items-center text-blue-200">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  {car.couleur}
                </div>
              </div>

              <p className="text-blue-200 text-sm mb-4 line-clamp-2">
                {car.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-white">
                  {car.price.toLocaleString()} frcfa
                </span>
                <button
                  onClick={() => handleDetailsClick(car._id || `${car.marque}-${car.modelCar}-${car.year}`)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  Détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <div className="text-blue-200 bg-blue-900/30 p-6 rounded-xl border border-blue-700/30">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16M9 9h6m-6 3h6m-6 3h6" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Aucune voiture trouvée</h3>
            <p>Aucun résultat ne correspond à vos critères de recherche.</p>
            <button
              onClick={resetFilters}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardSearchStyle;