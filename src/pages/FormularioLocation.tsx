import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonToast, IonTitle, IonToolbar, IonButton, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';
import { useLocation } from 'react-router-dom';


const FormularioLocation: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [callePrincipal, setCallePrincipal] = useState('');
  const [calleSecundaria, setCalleSecundaria] = useState('');
  const [pisoApartamento, setPisoApartamento] = useState('');
  const [sector, setSector] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const history = useHistory();
  const { usuarioActual } = useContext(UserContext);
  const location = useLocation();

  const latitud = new URLSearchParams(location.search).get('latitud') || '';
  const longitud = new URLSearchParams(location.search).get('longitud') || '';

  const handleGuardar = async () => {
  // Validar que todos los campos requeridos estén completos
  if (!nombre || !apellido || !telefono || !callePrincipal || !calleSecundaria || !pisoApartamento || !sector) {
    setShowWarning(true); // Mostrar advertencia
    return;
  }

  try {
    // Construir objeto con la información del formulario
    const formData = {
      cedula: usuarioActual?.Cedula || '',
      nombre,
      apellido,
      telefono,
      callePrincipal,
      calleSecundaria,
      latitud,
      longitud,
      pisoApartamento,
      sector,
      FormularioCompletado: true, // Establecer FormularioCompletado como true
    };

    // Enviar los datos al servidor utilizando Axios
    const updateResponse = await axios.put(`http://proyectocastrogalarza.somee.com/api/EditarUsuarios/${usuarioActual?.Cedula}`, formData);
    console.log('Datos guardados exitosamente:', updateResponse.data);

    history.push('/Usuario');
  } catch (error) {
    // Error al conectar con la API
    console.error('Error al guardar los datos:', error);
    // Aquí puedes mostrar un mensaje de error al usuario
  }
};


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Datos Personales</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput placeholder="Cédula" value={usuarioActual?.Cedula} readonly></IonInput>
        <IonInput placeholder="Nombre" value={nombre} onIonChange={e => setNombre(e.detail.value!)} required></IonInput>
        <IonInput placeholder="Apellido" value={apellido} onIonChange={e => setApellido(e.detail.value!)} required></IonInput>
        <IonInput placeholder="Teléfono" value={telefono} onIonChange={e => setTelefono(e.detail.value!)} required></IonInput>
        <IonInput placeholder="Calle Principal" value={callePrincipal} onIonChange={e => setCallePrincipal(e.detail.value!)} required></IonInput>
        <IonInput placeholder="Calle Secundaria" value={calleSecundaria} onIonChange={e => setCalleSecundaria(e.detail.value!)} required></IonInput>
        <IonInput readonly placeholder="Latitud" value={latitud}></IonInput>
        <IonInput readonly placeholder="Longitud" value={longitud}></IonInput>
        <IonInput placeholder="Piso/Apartamento" value={pisoApartamento} onIonChange={e => setPisoApartamento(e.detail.value!)} required></IonInput>
        <IonSelect placeholder="Sector" value={sector} onIonChange={e => setSector(e.detail.value)}>
          <IonSelectOption value="San Bartolomé">San Bartolomé</IonSelectOption>
          <IonSelectOption value="Quisapincha">Quisapincha</IonSelectOption>
          <IonSelectOption value="Atocha">Atocha</IonSelectOption>
          <IonSelectOption value="Huachi Grande">Huachi Grande</IonSelectOption>
          <IonSelectOption value="La Matriz">La Matriz</IonSelectOption>
          <IonSelectOption value="Las Virtudes">Las Virtudes</IonSelectOption>
          <IonSelectOption value="La Merced">La Merced</IonSelectOption>
          <IonSelectOption value="La Vicentina">La Vicentina</IonSelectOption>
          <IonSelectOption value="Ingahurco">Ingahurco</IonSelectOption>
          <IonSelectOption value="Pishilata">Pishilata</IonSelectOption>
          <IonSelectOption value="Santa Rosa">Santa Rosa</IonSelectOption>
          <IonSelectOption value="La Pradera">La Pradera</IonSelectOption>
          <IonSelectOption value="Pinllo">Pinllo</IonSelectOption>
          <IonSelectOption value="Quinta Chica">Quinta Chica</IonSelectOption>
          <IonSelectOption value="Santa Clara">Santa Clara</IonSelectOption>
          <IonSelectOption value="Unamuncho">Unamuncho</IonSelectOption>
          <IonSelectOption value="Montalvo">Montalvo</IonSelectOption>
          <IonSelectOption value="Atahualpa">Atahualpa</IonSelectOption>
        </IonSelect>
        <IonButton expand="block" color="primary" onClick={handleGuardar}>
          Guardar
        </IonButton>
      </IonContent>
      <IonToast
        isOpen={showWarning}
        className="ion-text-center"
        message="Por favor complete todos los campos."
        duration={3000}
        color="warning"
        onDidDismiss={() => setShowWarning(false)}
      />
    </IonPage>
  );
};

export default FormularioLocation;
