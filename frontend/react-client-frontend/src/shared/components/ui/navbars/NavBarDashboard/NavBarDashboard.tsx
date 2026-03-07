import { useEffect, useMemo, useRef, useState } from "react";
import { FiBell, FiCloud, FiLogOut, FiMapPin, FiMenu, FiX } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

import ROUTES from "../../../../../router";
import useAuth from "../../../../hooks/auth";
import useUser from "../../../../hooks/user";
import formName from "../../../../utils/helpers";

interface WeatherState {
  temperature: number | null;
  weatherCode: number | null;
  loading: boolean;
}

interface WeatherCity {
  key: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

const WEATHER_STORAGE_KEY = "client-dashboard-weather-city";

const WEATHER_CITIES: WeatherCity[] = [
  { key: "dakar-sn", city: "Dakar", country: "Senegal", latitude: 14.7167, longitude: -17.4677 },
  { key: "abidjan-ci", city: "Abidjan", country: "Cote d'Ivoire", latitude: 5.3599, longitude: -4.0083 },
  { key: "cotonou-bj", city: "Cotonou", country: "Benin", latitude: 6.3703, longitude: 2.3912 },
  { key: "lome-tg", city: "Lome", country: "Togo", latitude: 6.1319, longitude: 1.2228 },
  { key: "douala-cm", city: "Douala", country: "Cameroun", latitude: 4.0511, longitude: 9.7679 },
  { key: "paris-fr", city: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
];

function getDefaultWeatherCity(): WeatherCity {
  const language = globalThis.navigator?.language ?? "fr-SN";
  const [, region = "SN"] = language.split("-");

  if (["CI"].includes(region.toUpperCase())) {
    return WEATHER_CITIES[1];
  }

  if (["BJ"].includes(region.toUpperCase())) {
    return WEATHER_CITIES[2];
  }

  if (["TG"].includes(region.toUpperCase())) {
    return WEATHER_CITIES[3];
  }

  if (["CM"].includes(region.toUpperCase())) {
    return WEATHER_CITIES[4];
  }

  if (["FR"].includes(region.toUpperCase())) {
    return WEATHER_CITIES[5];
  }

  return WEATHER_CITIES[0];
}

function NavBarDashboard() {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherState>({
    temperature: null,
    weatherCode: null,
    loading: true,
  });
  const [selectedCityKey, setSelectedCityKey] = useState(() => {
    const saved = globalThis.localStorage?.getItem(WEATHER_STORAGE_KEY);
    return saved && WEATHER_CITIES.some((city) => city.key === saved)
      ? saved
      : getDefaultWeatherCity().key;
  });

  const notificationsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { enhancedUser } = useUser();

  const selectedCity = useMemo(() => {
    return WEATHER_CITIES.find((city) => city.key === selectedCityKey) ?? getDefaultWeatherCity();
  }, [selectedCityKey]);

  useEffect(() => {
    globalThis.localStorage?.setItem(WEATHER_STORAGE_KEY, selectedCity.key);
  }, [selectedCity.key]);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setWeather({ temperature: null, weatherCode: null, loading: true });
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&current=temperature_2m,weather_code&timezone=auto`,
        );
        const data = await response.json();

        setWeather({
          temperature: data?.current?.temperature_2m ?? null,
          weatherCode: data?.current?.weather_code ?? null,
          loading: false,
        });
      } catch {
        setWeather((prev) => ({ ...prev, loading: false }));
      }
    };

    loadWeather();
  }, [selectedCity.latitude, selectedCity.longitude]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!notificationsRef.current) {
        return;
      }

      if (!notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  const weatherLabel = useMemo(() => {
    if (weather.loading) {
      return `${selectedCity.city}, ${selectedCity.country} - meteo en cours...`;
    }

    if (weather.temperature === null) {
      return `${selectedCity.city}, ${selectedCity.country} - meteo indisponible`;
    }

    return `${selectedCity.city}, ${selectedCity.country} ${Math.round(weather.temperature)}°C`;
  }, [weather, selectedCity.city, selectedCity.country]);

  const validationNotifications = useMemo(() => {
    const commandes = enhancedUser?.recentCommandes ?? [];

    return commandes
      .filter((commande) => ["Confirmee", "Confirmée", "Livree", "Livrée"].includes(commande.statut))
      .slice(0, 5)
      .map((commande) => ({
        id: commande._id,
        message:
          commande.statut === "Livree" || commande.statut === "Livrée"
            ? "Votre commande a ete livree"
            : "Votre commande a ete validee",
        date: commande.dateCommande,
      }));
  }, [enhancedUser]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <nav className="sticky top-0 z-30 backdrop-blur-xl border-b px-4 md:px-6 py-3 flex items-center justify-between shadow-md client-surface-strong client-theme-text-primary">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden text-2xl"
            onClick={() => setOpen((state) => !state)}
            aria-label="Ouvrir le menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
          <h2 className="font-bold text-base md:text-lg tracking-wide">
            CarHub <span className="client-theme-text-primary">Dashboard</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-2 rounded-lg border px-3 py-2 text-sm client-surface client-theme-text-secondary">
            <FiCloud className="client-theme-accent-text" />
            <span>{weatherLabel}</span>
            {weather.weatherCode !== null && (
              <span className="text-xs client-theme-text-secondary">code {weather.weatherCode}</span>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2 rounded-lg border px-3 py-2 client-surface client-theme-text-secondary">
            <FiMapPin className="client-theme-accent-text" />
            <select
              value={selectedCity.key}
              onChange={(event) => setSelectedCityKey(event.target.value)}
              className="bg-transparent text-sm client-theme-text-primary outline-none"
              aria-label="Choisir la ville meteo"
            >
              {WEATHER_CITIES.map((city) => (
                <option key={city.key} value={city.key} className="text-slate-900">
                  {city.city}, {city.country}
                </option>
              ))}
            </select>
          </div>

          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              className="relative rounded-lg border px-3 py-2 transition-colors client-surface"
              onClick={() => setNotificationsOpen((state) => !state)}
              aria-label="Ouvrir les notifications"
            >
              <FiBell className="client-theme-accent-text" />
              {validationNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-red-500 text-[10px] leading-5 text-center text-white">
                  {validationNotifications.length}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border backdrop-blur-xl p-3 shadow-xl client-theme-card">
                <p className="text-sm font-semibold client-theme-text-primary mb-2">Notifications de validation</p>
                {validationNotifications.length === 0 ? (
                  <p className="text-xs client-theme-text-secondary">Aucune nouvelle notification.</p>
                ) : (
                  <ul className="space-y-2">
                    {validationNotifications.map((item) => (
                      <li key={item.id} className="rounded-lg border p-2 client-theme-card-soft">
                        <p className="text-sm client-theme-text-primary">{item.message}</p>
                        <p className="text-xs client-theme-text-secondary">
                          {new Date(item.date).toLocaleDateString("fr-FR")}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-lg border px-3 py-2 client-surface">
            <p className="text-sm client-theme-text-secondary">
              {formName(enhancedUser?.name ?? user.name ?? "", enhancedUser?.surname ?? user.surname ?? "") || "Client"}
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors inline-flex items-center gap-2 client-accent-bg-strong client-theme-text-primary"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span className="hidden sm:inline">Deconnexion</span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden fixed top-14 left-0 w-full p-4 z-40 shadow-xl animate-fade-in client-layout-bg client-theme-text-primary">
          <div className="mb-4 border-b pb-2 client-border-b">
            <p className="font-semibold client-theme-text-primary">Client</p>
            <p className="text-sm client-theme-text-secondary">
              {formName(enhancedUser?.name ?? user.name ?? "", enhancedUser?.surname ?? user.surname ?? "")}
            </p>
            <p className="text-xs client-theme-text-secondary">{user.email}</p>
          </div>

          <ul className="space-y-3">
            <li>
              <NavLink to={ROUTES.DASHBOARD} className="block py-2 px-3 rounded-lg transition client-theme-nav-link" onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.FAVORITES} className="block py-2 px-3 rounded-lg transition client-theme-nav-link" onClick={() => setOpen(false)}>
                Favoris
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.CART} className="block py-2 px-3 rounded-lg transition client-theme-nav-link" onClick={() => setOpen(false)}>
                Panier
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.ORDERS} className="block py-2 px-3 rounded-lg transition client-theme-nav-link" onClick={() => setOpen(false)}>
                Commandes
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.STATS} className="block py-2 px-3 rounded-lg transition client-theme-nav-link" onClick={() => setOpen(false)}>
                Statistiques
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.PROFILE} className="block py-2 px-3 rounded-lg transition client-theme-nav-link" onClick={() => setOpen(false)}>
                Profil
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.PARAMETRES} className="block py-2 px-3 rounded-lg transition client-theme-nav-link" onClick={() => setOpen(false)}>
                Parametres
              </NavLink>
            </li>
          </ul>

          <div className="mt-4 rounded-lg border p-3 space-y-2 client-theme-card-soft">
            <p className="text-sm client-theme-text-secondary">{weatherLabel}</p>
            <select
              value={selectedCity.key}
              onChange={(event) => setSelectedCityKey(event.target.value)}
              className="w-full rounded-lg border px-2 py-2 text-sm outline-none client-theme-input"
              aria-label="Choisir la ville meteo"
            >
              {WEATHER_CITIES.map((city) => (
                <option key={city.key} value={city.key} className="text-slate-900">
                  {city.city}, {city.country}
                </option>
              ))}
            </select>
          </div>

          <button className="mt-5 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 transition font-semibold" onClick={handleLogout}>
            Deconnexion
          </button>
        </div>
      )}
    </>
  );
}

export default NavBarDashboard;
