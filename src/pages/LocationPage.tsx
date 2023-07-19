import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonLoading, IonInput } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { locate } from "ionicons/icons";
import GoogleMapReact from 'google-map-react';
import { Geolocation, GeolocationPosition, GeolocationOptions } from '@capacitor/geolocation';
import { useHistory } from 'react-router-dom';
import "./LocationPage.css"

const Home: React.FC = () => {
  const currentZoom = 15;
  const [positionReady, setPositionReady] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [showLoading, setShowLoading] = useState(false);
  const history = useHistory();
  const [currentAddress, setCurrentAddress] = useState('');

  const startGetGPS = async () => {
    console.log('Obteniendo Ubicacion');
    setShowLoading(true);

    const options: GeolocationOptions = {
      enableHighAccuracy: true, // Habilitar alta precisión
      timeout: 5000, // Tiempo máximo de espera para obtener la ubicación
    };

    try {
      const position: GeolocationPosition = await Geolocation.getCurrentPosition(options);

      setShowLoading(false);
      console.log('Current', position);
      setPositionReady(true);
      setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude });

      const geocoder = new (window as any).google.maps.Geocoder();
      const latlng = new (window as any).google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      geocoder.geocode({ location: latlng }, (results: any[], status: string) => {
        if (status === (window as any).google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            setCurrentAddress(results[0].formatted_address);
          }
        }
      });

    } catch (error) {
      setShowLoading(false);
      console.error('Error al obtener la ubicación', error);
      // Manejar el error de obtener la ubicación aquí
    }
  };

  const onMapLoad = (map: any, maps: any) => {
    let marker = new maps.Marker({
      position: currentPosition,
      map: map,
      title: 'Mi ubicacion.'
    });
  };

  const handleConfirmAddress = () => {
    // Redirigir a la página "FormularioLocation" y pasar la latitud y longitud como parámetros en la URL
    history.push(`/Formulario?latitud=${currentPosition.lat}&longitud=${currentPosition.lng}`);
  };  

  let googleMap;

  if (positionReady) {
    console.log('Ubicacion Lista');
    googleMap = (
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyBY-sbTs5JGxC_yLQjETuDHanFlLWTZG5I' }}
        defaultCenter={currentPosition}
        defaultZoom={currentZoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => onMapLoad(map, maps)}
      >
      </GoogleMapReact>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Ubicacion</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={startGetGPS}>
              <IonIcon icon={locate} slot="icon-only" className="flashing" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ height: '94vh', width: '100%' }}>
          {googleMap}
        </div>
        <IonLoading
          isOpen={showLoading}
          message={'Obteniendo ubicacion...'}
          duration={5000}
        />
      </IonContent>
      <IonToolbar>
        <IonInput readonly value={currentAddress} className="ion-text-center" />
        <IonButton expand="block" color="success" onClick={handleConfirmAddress}>
          Confirmar dirección
        </IonButton>
      </IonToolbar>
    </IonPage>
  );
};

export default Home;
