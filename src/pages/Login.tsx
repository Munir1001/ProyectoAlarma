import React, { useState, useEffect, useContext } from "react";
import { IonContent, IonInput, IonButton, IonText, IonImg } from "@ionic/react";
import mostrarImg from "./contraseña.png";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { withRouter, RouteComponentProps } from "react-router-dom";
import "./Login.css";
import { UserContext } from "./UserContext";
import { v4 as uuidv4 } from 'uuid';

interface LoginProps extends RouteComponentProps { }

const LoginScreen: React.FC<LoginProps> = ({ history }) => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const { usuarioActual, setUsuarioActual } = useContext(UserContext);
  const [showMessage, setShowMessage] = useState(false);

  const mostrarContraseña = () => {
    setShowPassword((prevState) => !prevState);
  };

  const obtenerIdDeSesion = () => {
    // Generar un ID de sesión único utilizando UUID
    return uuidv4();
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://proyectocastrogalarza.somee.com/api/Usuarios/Login/${usuario}/${contraseña}`,
        {},
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const token = response.data;
        const decodedToken = jwtDecode(token);
        const usuarioResponse = await axios.get(
          `http://proyectocastrogalarza.somee.com/api/Usuarios/${usuario}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        const usuarioData = usuarioResponse.data;
        const rolPer = usuarioData.RolPer;
        setUsuarioActual(usuarioData);

        if (rolPer) {
          // Verificar el rol del usuario
          if (rolPer === 1) {
            history.push("/Admin"); // Redireccionar a ./Admin para el rol de administrador
          } else {
            if (usuarioData.FormularioCompletado) {
              history.push("/Usuario"); // Redireccionar a ./Usuario si el formulario ha sido enviado
            } else {
              history.push("/Locacion"); // Redireccionar a ./Locacion si el formulario no ha sido enviado
            }
          }
        } else {
          // Rol no encontrado en la respuesta del usuario
          setError("Rol no encontrado en la respuesta del usuario.");
        }
      } else {
        // Usuario o contraseña incorrectos
        setError("El usuario o contraseña son incorrectos.");
      }
    } catch (error) {
      // Error al conectar con la API
      console.log(error);
      setError("El usuario o contraseña son incorrectos.");
    }

    setUsuario("");
    setContraseña("");
  };

  useEffect(() => {
    if (usuarioActual && localStorage.getItem(`formCompleted_${usuarioActual.Cedula}`) === 'true') {
      history.push("/Usuario");
    }
  }, [usuarioActual, history]);




  const handleClick = () => {
    setShowMessage(true);
  };

  return (
    <IonContent>
      <div className="container">
        <div className="logincontainer">
          <div className="formContainer">
            <IonImg
              src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
              className="illustration"
              alt="Illustration"
            />
            <h2 className="title">LOGIN</h2>
            <div>
              <IonInput
                type="text"
                placeholder="CÉDULA"
                required
                value={usuario}
                onIonChange={(e) => setUsuario(e.detail.value!)}
                className="input"
              />
              <div className="passwordInputContainer">
                <IonInput
                  type={showPassword ? "text" : "password"}
                  placeholder="CONTRASEÑA"
                  required
                  value={contraseña}
                  onIonChange={(e) => setContraseña(e.detail.value!)}
                  className="input"
                />
                <div className="logoButton" onClick={mostrarContraseña}>
                  <IonImg
                    src={mostrarImg}
                    className="mostrarImg"
                    alt="Mostrar"
                  />
                </div>
              </div>
              <div className="buttonContainer">
                <IonButton
                  type="submit"
                  className="button"
                  onClick={handleSubmit}
                >
                  Iniciar sesión
                </IonButton>
              </div>
              {error && <IonText className="errorMessage">{error}</IonText>}
            </div>
            <div>
              <IonText>
                <p className="forgotPasswordLink" onClick={handleClick}>
                  Olvidaste tu contraseña?
                </p>
              </IonText>

              {showMessage && (
                <IonText>
                  <p className="formalMessage">
                    Estimado usuario, si ha olvidado su contraseña, por favor comuníquese con el administrador de la aplicación para brindarle su contraseña. Gracias.
                  </p>
                </IonText>
              )}
            </div>
          </div>
        </div>
      </div>
    </IonContent>
  );
};

export default withRouter(LoginScreen);
