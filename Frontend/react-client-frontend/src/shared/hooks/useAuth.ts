import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('UseAuth est utilisé en dehors du AuthProvider');
  }
  
  return context;
};

export default useAuth;