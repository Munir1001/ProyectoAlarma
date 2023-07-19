import React, { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

interface Usuario {
  Cedula: string;
  Contraseña: string;
  Nombre: string;
  Apellido: string;
  Telefono: string;
  CallePrincipal: string;
  CalleSecundaria: string;
  Latitud: number;
  Longitud: number;
  PisoApartamento: string;
  Sector: string;
  RolPer: number;
  FormularioCompletado: boolean;
}

interface UserContextProps {
  usuarioActual: Usuario | null;
  setUsuarioActual: (usuario: Usuario | null) => void;
  login: (usuario: string, contraseña: string) => Promise<boolean>;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextProps>({
  usuarioActual: null,
  setUsuarioActual: () => {},
  login: async () => false,
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  const login = async (usuario: string, contraseña: string) => {
    try {
      const response = await axios.post(
        `http://proyectocastrogalarza.somee.com/api/Usuarios/Login/${usuario}/${contraseña}`
      );

      if (response.status === 200) {
        const usuarioLogueado: Usuario = response.data;
        setUsuarioActual(usuarioLogueado);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://proyectocastrogalarza.somee.com/api/Usuarios",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.status === 200) {
          const usuarios: Usuario[] = response.data;
          const usuarioEncontrado = usuarios.find(
            (usuario) => usuario.Cedula === usuarioActual?.Cedula
          );
          setUsuarioActual(usuarioEncontrado || null);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <UserContext.Provider
      value={{
        usuarioActual,
        setUsuarioActual,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
