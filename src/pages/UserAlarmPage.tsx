import React, { useState, useEffect, useContext } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import { UserContext } from "./UserContext";
import "./AlarmPages.css";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Alarma {
  Id: number;
  CedulaUsuario: string;
  FechaCreacion: string;
  DescripcionPer: number;
}

interface Usuario {
  Cedula: string;
  Nombre: string;
  Apellido: string;
  Latitud: number;
  Longitud: number;
  Sector: string;
}

interface Descripcion {
  Id: number;
  Descripcion: string;
}

const UserAlarmPage: React.FC = () => {
  const { usuarioActual } = useContext(UserContext);
  const [alarmas, setAlarmas] = useState<Alarma[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [descripciones, setDescripciones] = useState<Descripcion[]>([]);
  const [filtroFechaInicio, setFiltroFechaInicio] = useState<Date | null>(null);
  const [filtroFechaFin, setFiltroFechaFin] = useState<Date | null>(null);
  const [filtroDescripcion, setFiltroDescripcion] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://proyectocastrogalarza.somee.com/api/Alarmas"
        );

        if (response.status === 200) {
          const alarmasData: Alarma[] = response.data;
          setAlarmas(alarmasData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(
          "http://proyectocastrogalarza.somee.com/api/Usuarios"
        );

        if (response.status === 200) {
          const usuariosData: Usuario[] = response.data;
          setUsuarios(usuariosData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDescripciones = async () => {
      try {
        const response = await axios.get(
          "http://proyectocastrogalarza.somee.com/api/Descripciones"
        );

        if (response.status === 200) {
          const descripcionesData: Descripcion[] = response.data;
          setDescripciones(descripcionesData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    fetchUsuarios();
    fetchDescripciones();
  }, []);

  const getUsuarioData = (cedulaUsuario: string) => {
    const usuario = usuarios.find((u) => u.Cedula === cedulaUsuario);
    if (usuario) {
      return `${usuario.Nombre} ${usuario.Apellido}`;
    }
    return "";
  };

  const handleVerEnMapa = (latitud: number, longitud: number) => {
    history.push({
      pathname: "./sector",
      state: { latitud, longitud },
    });
  };

  const getDireccion = (cedulaUsuario: string) => {
    const usuario = usuarios.find((u) => u.Cedula === cedulaUsuario);
    if (usuario) {
      return (
        <button
          style={{
            color: "#666666",
            textDecoration: "underline",
            cursor: "pointer",
            background: "transparent",
          }}
          onClick={() => handleVerEnMapa(usuario.Latitud, usuario.Longitud)}
        >
          Ver en Mapa
        </button>
      );
    }
    return "";
  };

  const getDescripcion = (descripcionId: number) => {
    const descripcion = descripciones.find((d) => d.Id === descripcionId);
    if (descripcion) {
      return descripcion.Descripcion;
    }
    return "";
  };

  const handleFiltrarAlarmas = () => {
    const alarmasFiltradas = alarmas.filter((alarma) => {
      const fechaCreacion = new Date(alarma.FechaCreacion);
      const descripcion = getDescripcion(alarma.DescripcionPer).toLowerCase();

      return (
        ((!filtroFechaInicio && !filtroFechaFin) ||
          (filtroFechaInicio && filtroFechaFin &&
            fechaCreacion >= filtroFechaInicio &&
            fechaCreacion <= filtroFechaFin)) &&
        descripcion.includes(filtroDescripcion.toLowerCase())
      );
    });

    setAlarmas(alarmasFiltradas);
  };
  const handleLimpiarFiltros = () => {
    setFiltroFechaInicio(null);
    setFiltroFechaFin(null);
    setFiltroDescripcion("");
    // Volver a cargar todos los datos
    fetchData();
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://proyectocastrogalarza.somee.com/api/Alarmas"
      );

      if (response.status === 200) {
        const alarmasData: Alarma[] = response.data;
        setAlarmas(alarmasData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredAlarmas = alarmas.filter(
    (alarma) => alarma.CedulaUsuario === usuarioActual?.Cedula
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Mis Alarmas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="container">
        <div className="filtro-container">
          <DatePicker className="inicio"
            selected={filtroFechaInicio}
            onChange={(date: Date | null) =>
              setFiltroFechaInicio(date)
            }
            selectsStart
            startDate={filtroFechaInicio}
            endDate={filtroFechaFin}
            placeholderText="Fecha de Inicio"
          />
          <DatePicker className="fin"
            selected={filtroFechaFin}
            onChange={(date: Date | null) =>
              setFiltroFechaFin(date)
            }
            selectsEnd
            startDate={filtroFechaInicio}
            endDate={filtroFechaFin}
            minDate={filtroFechaInicio}
            placeholderText="Fecha de Fin"
          />
          <select
            value={filtroDescripcion}
            onChange={(e) => setFiltroDescripcion(e.target.value)}
          >
            <option value="">Todas las descripciones</option>
            {descripciones.map((descripcion) => (
              <option key={descripcion.Id} value={descripcion.Descripcion}>
                {descripcion.Descripcion}
              </option>
            ))}
          </select>
          <button onClick={handleFiltrarAlarmas}>Filtrar</button>
          <button onClick={handleLimpiarFiltros}>Limpiar</button>
        </div>
        <table className="data-grid">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Direccion</th>
              <th>Fecha de Creacion</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlarmas.map((alarma) => (
              <tr key={alarma.Id}>
                <td>{getUsuarioData(alarma.CedulaUsuario)}</td>
                <td>{getDireccion(alarma.CedulaUsuario)}</td>
                <td>{alarma.FechaCreacion}</td>
                <td>{getDescripcion(alarma.DescripcionPer)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </IonContent>
    </IonPage>
  );
};

export default UserAlarmPage;
