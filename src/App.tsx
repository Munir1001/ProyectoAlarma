import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { UserContext } from "./pages/UserContext";
import Login from "./pages/Login"; // Importa el componente Login
import { PushNotifications } from '@capacitor/push-notifications';

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Admin from "./pages/DashboardAdmin";
import UserHomePage from "./pages/UserPage";
import LocationPage from "./pages/LocationPage";
import FormularioLocation from "./pages/FormularioLocation";
PushNotifications.register();
setupIonicReact();

const App: React.FC = () => {
  const { usuarioActual } = React.useContext(UserContext);

  return (
    <IonApp>
      <IonReactRouter basename="/ProyectoAlarma">
        <IonRouterOutlet>
          <Route path="/" component={Login} exact={true} />
          <Route path="/Admin" component={Admin} exact={true} />
          <Route path="/Usuario" component={UserHomePage} exact={true} />
          <Route path="/Locacion" component={LocationPage} exact={true} />
          <Route
            path="/Formulario"
            component={FormularioLocation}
            exact={true}
          />
          {usuarioActual ? (
            <Redirect to="/Usuario" />
          ) : (
            <Redirect to="/" />
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
