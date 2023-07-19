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
  IonButton,
  IonFooter,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import {
  pinSharp,
  compassSharp,
  notificationsCircleSharp,
  homeSharp,
  addCircleSharp,
  logOutSharp,
  moon,
  sunny,
  barChartSharp,
} from 'ionicons/icons';
import "./UserPage.css";

// Importa los componentes de las páginas

import UserAlarmPage from "./UserAlarmPage";
import UserNewAlarmPage from "./UserNewAlarmPage";
import UserSectorAlarmPage from "./UserSectorAlarmPage";
import UserSectorPage from "./UserSectorPage";
import ReportesUsuarios from './ReportsUsersPage';



const handleLogout = () => {
  // Lógica para cerrar sesión del usuario

  // Redireccionar al usuario a la página de inicio de sesión
  window.location.href = '/';
};

const UserApp: React.FC = () => {
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
            <Redirect exact path="/" to="/user/home" />
            <Route exact path="/user/alarms" component={UserAlarmPage} />
            <Route exact path="/user/new-alarm" component={UserNewAlarmPage} />
            <Route
              exact
              path="/user/sector-alarms"
              component={UserSectorAlarmPage}
            />
            <Route exact path="/user/sector" component={UserSectorPage} />
            <Route exact path="/user/reports" component={ReportesUsuarios} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="alarms" href="/user/alarms">
              <IonIcon icon={notificationsCircleSharp} />
              <IonLabel>Mis Alarmas</IonLabel>
            </IonTabButton>
            <IonTabButton tab="reports" href="/user/reports">
              <IonIcon icon={barChartSharp} />
              <IonLabel>Reportes</IonLabel>
            </IonTabButton>
            <IonTabButton tab="new-alarm" href="/user/new-alarm">
              <IonIcon icon={addCircleSharp} />
              <IonLabel>Nueva Alarma</IonLabel>
            </IonTabButton>
            <IonTabButton tab="sector-alarms" href="/user/sector-alarms">
              <IonIcon icon={compassSharp} />
              <IonLabel>Alarmas Sector</IonLabel>
            </IonTabButton>
            <IonTabButton tab="sector" href="/user/sector">
              <IonIcon icon={pinSharp} />
              <IonLabel>Mi Sector</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};
export default UserApp;
