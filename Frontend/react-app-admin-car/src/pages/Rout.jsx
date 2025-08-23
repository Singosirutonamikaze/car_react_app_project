import { Navigate } from "react-router-dom";

const Rout = () => {
  //Verifier l'existence de l'utilisateur
  const isAuthenticated = !!localStorage.getItem("token");

  //Rediriger vers la page de Dashboard si l'utilisateur est authentifié
  return (
    isAuthenticated
      ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/login" />
      )
  );
}

export default Rout;