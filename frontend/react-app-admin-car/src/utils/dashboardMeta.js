export const formatDashboardDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formatDashboardTime = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export const getDynamicWeatherLabel = (date) => {
  const hour = date.getHours();

  if (hour >= 6 && hour < 12) return "Matin clair";
  if (hour >= 12 && hour < 18) return "Apres-midi doux";
  if (hour >= 18 && hour < 22) return "Soiree calme";
  return "Nuit fraiche";
};
