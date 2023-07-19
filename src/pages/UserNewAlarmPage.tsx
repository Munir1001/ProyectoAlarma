import React, { useState, useContext, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import axios from "axios";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { UserContext } from "./UserContext";
import moment from "moment-timezone";


interface Alarma {
  Id: number;
  CedulaUsuario: string;
  FechaCreacion: string;
  DescripcionPer: number;
}

interface Descripcion {
  Id: number;
  Descripcion: string;
}

const generateCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

const UserNewAlarmPage: React.FC = () => {
  const [alarmCode, setAlarmCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState(generateCode());
  const [alarmType, setAlarmType] = useState("");
  const { usuarioActual } = useContext(UserContext);
  const [alarmDescriptions, setAlarmDescriptions] = useState<Descripcion[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [validCode, setValidCode] = useState(false);
  const [canGenerateAlarm, setCanGenerateAlarm] = useState(true); // Nuevo estado para controlar la generación de alarma

  useEffect(() => {
    const fetchAlarmDescriptions = async () => {
      try {
        const response = await axios.get(
          "http://proyectocastrogalarza.somee.com/api/Descripciones",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const descriptions: Descripcion[] = response.data;
          setAlarmDescriptions(descriptions);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAlarmDescriptions();
  }, []);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://signalrproyecto.somee.com/beerhub")
      .build();

    // Configuración adicional para el objeto XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    setConnection(connection);

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    handleGenerateCode();
  }, []);

  const handleGenerateCode = () => {
    const code = generateCode();
    setGeneratedCode(code);
  };

  const validateCode = () => {
    setValidCode(alarmCode === generatedCode);
  };

  const sendAlertSignalR = async () => {
    validateCode(); // Validar el código antes de enviar la alerta

    if (validCode && canGenerateAlarm) {
      try {
        if (connection) {
          connection
            .start()
            .then(() => {
              // Conexión exitosa
              const currentDate = moment().tz("America/Guayaquil");
              const formattedDate = currentDate.format("YYYY-MM-DDTHH:mm:ss.SSS");

              const selectedDescription = alarmDescriptions.find(
                (description) => description.Descripcion === alarmType
              );

              const alarmData = {
                IdUsuario: usuarioActual?.Cedula,
                FechaHora: formattedDate,
                Descripcion: selectedDescription?.Id.toString() // Convertir el ID a cadena de texto
              };

              // Enviar los datos a la API
              axios.post("http://signalrproyecto.somee.com/api/Alarmas", alarmData);

              connection.invoke("AddToGroup", usuarioActual?.Sector);

              console.log("Alarma enviada");
            })
            .catch((error) => {
              console.error("Error al conectar: " + error);
            });
          
          connection.on("ReceivedAlarma", function (mensaje, IdUsuario, FechaHora, Descripcion) {
            // Código para manejar la notificación recibida
            const notificationMessage = `${mensaje}:\n${IdUsuario}\n${FechaHora}\n${Descripcion}\n${usuarioActual?.Nombre} ${usuarioActual?.Apellido}\n`;
            alert(notificationMessage);
            
            // Habilitar la generación de alarma después de 5 minutos
            setCanGenerateAlarm(false); // Deshabilitar la generación de alarma durante 3 minutos
            setTimeout(() => setCanGenerateAlarm(true), 5 * 60 * 1000);
          }
          );

          setAlarmCode(""); // Restablecer el valor del código ingresado a una cadena vacía
          handleGenerateCode();
          
        }
      } catch (error) {
        console.log(error);
        setValidCode(false);
        setAlarmCode("");
        handleGenerateCode();
      }
    } else {
      setValidCode(false);
      handleGenerateCode();
      setAlarmCode("");
    }
  };
    
  useEffect(() => {
    const timer = setTimeout(() => {
      validateCode();
    }, 1000);

    return () => clearTimeout(timer);
  }, [alarmCode]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center ion-align-items-center">Nueva Alarma</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Escriba el código generado"
                    value={alarmCode}
                    onIonChange={(e) => setAlarmCode(e.detail.value!)}
                    required
                    color={validCode ? "success" : alarmCode ? "danger" : ""}
                  ></IonInput>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
          {generatedCode && (
            <IonItem>
              <IonText color={validCode ? "success" : "danger"}>Código generado: {generatedCode}</IonText>
            </IonItem>
          )}

          <IonItem>
            <IonSelect
              value={alarmType}
              placeholder="Seleccione el tipo de alarma"
              onIonChange={(e) => setAlarmType(e.detail.value)}
            >
              {alarmDescriptions.map((description) => (
                <IonSelectOption key={description.Id} value={description.Descripcion}>
                  {description.Descripcion}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={sendAlertSignalR} disabled={!validCode || !canGenerateAlarm}>
          Generar Alarma
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default UserNewAlarmPage;

