import React, { useState, useEffect, useContext } from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import axios from "axios";
import { UserContext } from "./UserContext";
import "./UserSectorPage.css";
import "@ionic/react/css/ionic.bundle.css";


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

const UserSectorPage: React.FC = () => {
  const { usuarioActual } = useContext(UserContext);
  const [sectorAlarms, setSectorAlarms] = useState<Usuario[]>([]);
  const [map, setMap] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [deviceLocation, setDeviceLocation] = useState<{ lat: number; lng: number } | null>(null);

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
          const usuarios: Usuario[] = response.data;
          const usuariosSector = usuarios.filter(
            (usuario) => usuario.Sector === usuarioActual?.Sector
          );
          setSectorAlarms(usuariosSector);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [usuarioActual]);

  useEffect(() => {
    if (map && sectorAlarms.length > 0 && usuarioActual) {
      sectorAlarms.forEach((usuario: Usuario) => {
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
      });
    }
  }, [map, sectorAlarms, usuarioActual]);

  const initializeMap = () => {
    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDLX4cpil_TAk5K0CDXWctpaQSJFjUSzcs&libraries=places,directions`;
    googleMapsScript.onload = () => {
      const map = new window.google.maps.Map(document.getElementById("map")!, {
        center: {
          lat: parseFloat(usuarioActual?.Latitud?.toString() || "0"),
          lng: parseFloat(usuarioActual?.Longitud?.toString() || "0"),
        },
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      const newDirectionsRenderer = new window.google.maps.DirectionsRenderer();
      newDirectionsRenderer.setMap(map);

      setDirectionsRenderer(newDirectionsRenderer);
      setMap(map);

      // Obtener ubicación del dispositivo
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setDeviceLocation({ lat: latitude, lng: longitude });
            const deviceLocationMarker = new window.google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map,
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

  useEffect(() => {
    initializeMap();

    // Actualizar el mapa y los marcadores cada 2 minutos
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 60000); // 1 minuto (110000 milisegundos)

    // Limpiar el intervalo al desmontar el componente
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://proyectocastrogalarza.somee.com/api/Usuarios", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const usuarios: Usuario[] = response.data;
        const usuariosSector = usuarios.filter(
          (usuario) => usuario.Sector === usuarioActual?.Sector
        );
        setSectorAlarms(usuariosSector);

        // Limpiar los marcadores existentes en el mapa
        sectorAlarms.forEach((usuario: Usuario) => {
          if (usuario.marker) {
            usuario.marker.setMap(null);
          }
        });

        // Crear nuevos marcadores con las ubicaciones actualizadas del sector
        usuariosSector.forEach((usuario: Usuario) => {
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
        });
      }
    } catch (error) {
      console.log(error);
    }
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
          directionsRenderer.setMap(map); // Añadir esta línea para establecer el mapa
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Mi Sector</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div id="map" style={{ height: "79vh", width: "100%" }}></div>
      </IonContent>
    </IonPage>
  );
};

export default UserSectorPage;
