import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(false);
  const [current, setCurrent] = useState();
  const [authenticated, setAuthenticated] = useState(false); // Default to user role

  const updateUserRole = (newRole) => {
    setUserRole(newRole);
  };

 

  const updateAuth = () => {
    
    setAuthenticated(!authenticated);
    console.log(authenticated);
  }

  const logoutAuth = () =>{
    setAuthenticated(!authenticated);
    console.log(authenticated);
  }

  const updateCurrent =(newId)=>{
    setCurrent(newId);
  }

  return (
    <UserContext.Provider value={{ userRole, updateUserRole ,updateAuth, logoutAuth , authenticated, current, updateCurrent }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);