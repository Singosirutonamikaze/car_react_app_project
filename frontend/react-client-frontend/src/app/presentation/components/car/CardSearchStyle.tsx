// src/app/presentation/components/car/CardSearchStyle.tsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { Car } from "../../../../shared/types/car";
import { carService } from "../../../../shared/services/car";
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

  const uniqueVilles = [...new Set(cars.map((car) => car.ville))].sort((a, b) =>
    a.localeCompare(b, "fr", { sensitivity: "base" }),
  );

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
      <div className="mb-8 max-w-3xl client-page-heading-wrap">
        <h1 className="client-page-heading">Recherche de Voitures</h1>
        <p className="client-page-subheading">
          Trouvez la voiture parfaite qui correspond à vos besoins et préférences.
        </p>
      </div>

      <div className="client-theme-card-soft backdrop-blur-md rounded-xl p-6 mb-8 border">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="client-theme-text-secondary" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par marque ou modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg client-theme-input focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 client-theme-outline-button border rounded-lg transition-colors"
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
              <label htmlFor="ville-filter" className="block text-sm font-medium client-theme-label mb-2">
                Filtrer par ville
              </label>
              <select
                id="ville-filter"
                title="Filtrer les voitures par ville"
                value={villeFilter}
                onChange={(e) => setVilleFilter(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg client-theme-input focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
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
        <h2 className="text-2xl font-bold client-theme-text-primary">
          {filteredCars.length} {filteredCars.length === 1 ? 'voiture trouvée' : 'voitures trouvées'}
        </h2>

        {(searchTerm || villeFilter) && (
          <button
            onClick={resetFilters}
            className="client-theme-text-secondary text-sm flex items-center gap-1"
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
            className="client-theme-card-soft backdrop-blur-md rounded-xl overflow-hidden shadow-xl border transition-all duration-300 hover:scale-105"
          >
            <div className="h-48 client-layout-gradient flex items-center justify-center overflow-hidden">
              {car.image ? (
                <img
                  src={car.image}
                  alt={`${car.marque} ${car.modelCar}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="client-theme-text-secondary flex flex-col items-center">
                  <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-sm">Image non disponible</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold client-theme-text-primary">
                  {car.marque} {car.modelCar}
                </h3>
                <span className="client-theme-chip text-sm px-2 py-1 rounded-full border">
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
                <div className="flex items-center client-theme-text-secondary">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {car.kilometrage.toLocaleString()} km
                </div>
                <div className="flex items-center client-theme-text-secondary">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  {car.carburant}
                </div>
                <div className="flex items-center client-theme-text-secondary">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {car.ville}
                </div>
                <div className="flex items-center client-theme-text-secondary">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  {car.couleur}
                </div>
              </div>

              <p className="client-theme-text-secondary text-sm mb-4 line-clamp-2">
                {car.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold client-theme-text-primary">
                  {car.price.toLocaleString()} FCFA
                </span>
                <button
                  onClick={() => handleDetailsClick(car._id || `${car.marque}-${car.modelCar}-${car.year}`)}
                  className="client-theme-button border px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
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
          <div className="client-theme-text-secondary client-theme-card-soft p-6 rounded-xl border">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16M9 9h6m-6 3h6m-6 3h6" />
            </svg>
            <h3 className="text-xl font-semibold client-theme-text-primary mb-2">Aucune voiture trouvée</h3>
            <p>Aucun résultat ne correspond à vos critères de recherche.</p>
            <button
              onClick={resetFilters}
              className="mt-4 client-theme-button border px-4 py-2 rounded-lg transition-colors"
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