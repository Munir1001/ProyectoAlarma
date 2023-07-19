import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import axios from "axios";
import "./UserSectorPage.css";
import "@ionic/react/css/ionic.bundle.css";
import moment from "moment-timezone";

declare global {
  interface Window {
    google: any;
  }
}

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
  marker?: any;
}

const HomePage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [map, setMap] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [deviceLocation, setDeviceLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [alarmas, setAlarmas] = useState<any[]>([]);
  const [descripciones, setDescripciones] = useState<any[]>([]);
  const [lastAlarmTimestamp, setLastAlarmTimestamp] = useState<number | null>(null);
  const [allAlarmas, setAllAlarmas] = useState<any[]>([]);


  useEffect(() => {
    const fetchAlarmas = async () => {
      try {
        const response = await axios.get("http://proyectocastrogalarza.somee.com/api/Alarmas", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const alarms: any[] = response.data;
          const currentDate = moment().tz("America/Guayaquil").format("YYYY-MM-DDTHH:mm:ss.SSS");
          const filteredAlarms = alarms.filter((alarma: any) => {
            const fechaCreacion = moment(alarma.FechaCreacion);
            return fechaCreacion.isSame(moment(currentDate), "minute");
          });
          setAlarmas(filteredAlarms);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get("http://proyectocastrogalarza.somee.com/api/Usuarios", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const usuarios: Usuario[] = response.data.filter((usuario: Usuario) => usuario.RolPer === 2);
          setUsuarios(usuarios);
          initializeMap(usuarios); // Inicializar el mapa con los marcadores de usuario
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Llamar a fetchData una vez al cargar el componente

    const interval = setInterval(fetchAlarmas, 1000); // Consulta la API de alarmas cada segundo

    return () => {
      clearInterval(interval); // Limpia el temporizador al desmontar el componente
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://proyectocastrogalarza.somee.com/api/Usuarios", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const usuarios: Usuario[] = response.data.filter((usuario: Usuario) => usuario.RolPer === 2);
          setUsuarios(usuarios);

          initializeMap(usuarios);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (map && usuarios.length > 0) {
      usuarios.forEach((usuario: Usuario) => {
        // Verificar si el usuario tiene el rol "Admin"
        if (usuario.RolPer !== 1) {
          const marker = new window.google.maps.Marker({
            position: {
              lat: parseFloat(usuario.Latitud?.toString() || "0"),
              lng: parseFloat(usuario.Longitud?.toString() || "0"),
            },
            map,
            title: usuario.Nombre,
          });

          usuario.marker = marker;

          marker.addListener("click", () => {
            showUserInfo(usuario);
          });
        }
      });
    }
  }, [map, usuarios]);

  useEffect(() => {
    const fetchDescripciones = async () => {
      try {
        const response = await axios.get("http://proyectocastrogalarza.somee.com/api/Descripciones", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const descripciones: any[] = response.data;
          setDescripciones(descripciones);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDescripciones();
  }, []);

  const initializeMap = (usuarios: Usuario[]) => {
    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAm9HgI78XoVUl3inf5oKVBnzKStfBwFg8&libraries=places,directions`;
    googleMapsScript.onload = () => {
      const usersWithCoordinates = usuarios.filter((usuario) => {
        return usuario.Latitud !== null && usuario.Longitud !== null;
      });

      const initialCenter =
        usersWithCoordinates.length > 0
          ? {
              lat: parseFloat(usersWithCoordinates[0].Latitud.toString()),
              lng: parseFloat(usersWithCoordinates[0].Longitud.toString()),
            }
          : { lat: 0, lng: 0 };

      const newMap = new window.google.maps.Map(document.getElementById("map")!, {
        center: initialCenter,
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      const newDirectionsRenderer = new window.google.maps.DirectionsRenderer();
      newDirectionsRenderer.setMap(newMap);

      setDirectionsRenderer(newDirectionsRenderer);
      setMap(newMap);

      // Obtener ubicación del dispositivo
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setDeviceLocation({ lat: latitude, lng: longitude });
            const deviceLocationMarker = new window.google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map: newMap,
              title: "Ubicación Actual",
            });
          },
          (error) => {
            console.log("Error al obtener la ubicación del dispositivo:", error);
          }
        );
      } else {
        console.log("La geolocalización no es compatible con este navegador.");
      }
    };

    document.body.appendChild(googleMapsScript);
  };

  const showUserInfo = (user: Usuario) => {
    const infoWindowContent = document.createElement("div");
    infoWindowContent.innerHTML = `
      <p class="info-window-text">Nombre: ${user.Nombre || ""}</p>
      <p class="info-window-text">Apellido: ${user.Apellido || ""}</p>
      <p class="info-window-text">Teléfono: ${user.Telefono || ""}</p>
      <p class="info-window-text">Calle Principal: ${user.CallePrincipal || ""}</p>
      <p class="info-window-text">Calle Secundaria: ${user.CalleSecundaria || ""}</p>
      <button id="routeButton" class="info-window-button">Ruta</button>
      <button id="cancelRouteButton" class="info-window-button info-window-button-cancel">Cancelar Ruta</button>
    `;

    const infoWindow = new window.google.maps.InfoWindow({
      content: infoWindowContent,
    });

    infoWindow.open(map, user.marker);

    const routeButton = infoWindowContent.querySelector("#routeButton");
    if (routeButton) {
      routeButton.addEventListener("click", () => {
        if (deviceLocation) {
          calculateAndDisplayRoute(user);
        }
      });
    }

    const cancelRouteButton = infoWindowContent.querySelector("#cancelRouteButton");
    if (cancelRouteButton) {
      cancelRouteButton.addEventListener("click", () => {
        cancelRoute(user);
      });
    }
  };

  const calculateAndDisplayRoute = (user: Usuario) => {
    const directionsService = new window.google.maps.DirectionsService();

    const origin = new window.google.maps.LatLng(
      parseFloat(deviceLocation?.lat?.toString() || "0"),
      parseFloat(deviceLocation?.lng?.toString() || "0")
    );
    const destination = new window.google.maps.LatLng(
      parseFloat(user.Latitud?.toString() || "0"),
      parseFloat(user.Longitud?.toString() || "0")
    );

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response: any, status: any) => {
        if (status === "OK") {
          const newRoute = response.routes[0];
          setRoutes([...routes, newRoute]);
          directionsRenderer.setDirections(response);
        } else {
          window.alert("No se pudo calcular la ruta.");
        }
      }
    );
  };

  const cancelRoute = (user: Usuario) => {
    const userRouteIndex = routes.findIndex((route) => route && route.legs[0].end_address === user.marker.title);
    if (userRouteIndex !== -1) {
      const updatedRoutes = [...routes];
      updatedRoutes.splice(userRouteIndex, 1);
      setRoutes(updatedRoutes);
    }

    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
  };

  const getUsuarioName = (cedulaUsuario: string) => {
    const usuario = usuarios.find((usuario) => usuario.Cedula === cedulaUsuario);
    if (usuario) {
      return `${usuario.Nombre} ${usuario.Apellido}`;
    }
    return "";
  };

  const getDescripcion = (descripcionId: number) => {
    const descripcion = descripciones.find((descripcion) => descripcion.Id === descripcionId);
    if (descripcion) {
      return descripcion.Descripcion;
    }
    return "";
  };

  const animateUserLocations = () => {
    if (map && usuarios.length > 0) {
      const alarmUserSet = new Set<string>(alarmas.map((alarma) => alarma.CedulaUsuario));

      usuarios.forEach((usuario: Usuario) => {
        // Verificar si el usuario ha generado una alarma recientemente
        const alarmaGenerada = alarmUserSet.has(usuario.Cedula);

        if (usuario.marker) {
          if (!alarmaGenerada) {
            // Ocultar ubicación del usuario y detener animación
            usuario.marker.setMap(null);
            usuario.marker.setAnimation(null);
          } else {
            // Encender ubicación del usuario y agregar animación
            usuario.marker.setMap(map);
            usuario.marker.setAnimation(window.google.maps.Animation.BOUNCE);
          }
        }
      });
    }
  };

  useEffect(() => {
    animateUserLocations();
  }, [alarmas]);

  useEffect(() => {
    const clearAlarmPanel = () => {
      setAlarmas([]);
      setLastAlarmTimestamp(null);
    };

    const checkAlarmPanel = () => {
      if (lastAlarmTimestamp) {
        const currentTime = moment().tz("America/Guayaquil").valueOf();
        const timeDifference = currentTime - lastAlarmTimestamp;

        if (timeDifference >= 240000) {
          clearAlarmPanel();
        } else {
          const timeout = setTimeout(checkAlarmPanel, 240000 - timeDifference);
          return () => clearTimeout(timeout);
        }
      }
    };

    checkAlarmPanel();
  }, [lastAlarmTimestamp]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Panel de Control</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="8">
              <div id="map" style={{ height: "79vh", width: "100%" }}></div>
            </IonCol>
            <IonCol size="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>Panel de Alarmas</IonCardSubtitle>
                  <IonCardTitle>Alarmas Generadas</IonCardTitle>
                </IonCardHeader>
                {alarmas.map((alarma) => (
                  <div key={alarma.Id}>
                    <p>Usuario: {getUsuarioName(alarma.CedulaUsuario)}</p>
                    <p>Fecha y Hora: {alarma.FechaCreacion}</p>
                    <p>Descripcion: {getDescripcion(alarma.DescripcionPer)}</p>
                  </div>
                ))}
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
