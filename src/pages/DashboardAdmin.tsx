import React, { useState, useEffect } from 'react';
import {
  IonApp,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonFooter,
  IonButton,

} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { alarmSharp, contractSharp, peopleCircleSharp, sunny, moon, logOutSharp, barChartSharp } from "ionicons/icons";
import "./UserPage.css";

// Importa los componentes de las páginas
import AlarmsAdminPage from "./ControlAlarmsAdminPage";
import SettingsPage from "./AlarmsAdminPage";
import AboutPage from "./UsuariosAdminPage";
import ReportesAdmin from './ReportsAdminPage';

const handleLogout = () => {
  // Lógica para cerrar sesión del usuario

  // Redireccionar al usuario a la página de inicio de sesión
  window.location.href = '/';
};

const Admin: React.FC = () => {
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useState(systemPrefersDark);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChangeDarkMode = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChangeDarkMode);

    return () => {
      mediaQuery.removeEventListener('change', handleChangeDarkMode);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <IonApp className={darkMode ? 'dark' : ''}>
      <IonReactRouter>
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle className="ion-text-center ion-align-items-center">Configuración</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem lines="none" className="custom-item" button onClick={handleToggleDarkMode}>
                <IonIcon icon={darkMode ? sunny : moon} slot="start" />
                <IonLabel>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
          <IonFooter>
            <IonToolbar>
              <IonButton
                expand="block"
                color={darkMode ? 'backspace' : ''}
                onClick={handleLogout}
              >
                <IonIcon icon={logOutSharp} slot="start" />
                Cerrar sesión
              </IonButton>
            </IonToolbar>
          </IonFooter>
        </IonMenu>

        <IonTabs>
          <IonRouterOutlet id="main">
            <Redirect exact path="/" to="/home" />
            <Route exact path="/Control" component={AlarmsAdminPage} />
            <Route exact path="/Alarmas" component={SettingsPage} />
            <Route exact path="/Usuarios" component={AboutPage} />
            <Route exact path="/Reportes" component={ReportesAdmin} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="control" href="/Control">
              <IonIcon icon={contractSharp} />
              <IonLabel>Control de Alarmas</IonLabel>
            </IonTabButton>
            <IonTabButton tab="alarmas" href="/Alarmas">
              <IonIcon icon={alarmSharp} />
              <IonLabel>Alarmas</IonLabel>
            </IonTabButton>
            <IonTabButton tab="usuarios" href="/Usuarios">
              <IonIcon icon={peopleCircleSharp} />
              <IonLabel>Usuarios</IonLabel>
            </IonTabButton>
            <IonTabButton tab="reportes" href="/Reportes">
              <IonIcon icon={barChartSharp} />
              <IonLabel>Reportes</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};
export default Admin;
