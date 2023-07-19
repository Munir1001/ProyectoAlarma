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
  IonCheckbox,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonInput,
} from "@ionic/react";
import "./UsuariosAdminPage.css";

interface NewUser {
  Cedula: string;
  Contraseña: string;
  RolPer: number;
}

const UsuariosAdminPage: React.FC = () => {
  const [users, setUsers] = useState([] as any[]);
  const [filteredUsers, setFilteredUsers] = useState([] as any[]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    Cedula: "",
    Contraseña: "",
    RolPer: 2,
  });
  const [rolOptions, setRolOptions] = useState<JSX.Element[]>([]);

  useEffect(() => {
    fetch("http://proyectocastrogalarza.somee.com/api/Usuarios")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetch("http://proyectocastrogalarza.somee.com/api/roles")
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((rol: any) => (
          <IonSelectOption key={rol.Id} value={rol.Id}>
            {rol.Descripcion}
          </IonSelectOption>
        ));
        setRolOptions(options);
      })
      .catch((error) => console.error(error));
  }, []);


  const handleDelete = async (cedula: string) => {
    try {
      // Eliminar las alarmas del usuario
      await fetch(
        `http://proyectocastrogalarza.somee.com/api/Alarmas/${cedula}`,
        {
          method: "DELETE",
        }
      );
  
      // Eliminar el usuario
      await fetch(
        `http://proyectocastrogalarza.somee.com/api/Usuarios/${cedula}`,
        {
          method: "DELETE",
        }
      );
  
      console.log("Usuario eliminado");
  
      // Actualizar los usuarios y filteredUsers
      const updatedUsers = users.filter((user: any) => user.Cedula !== cedula);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };
    
  const handleFilterByCedula = (event: any) => {
    const searchValue = event.target.value;

    if (searchValue === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user: any) =>
        user.Cedula.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleCreateUser = async () => {
    try {
      // Guardar el nuevo usuario en la API
      const response = await fetch(
        "http://proyectocastrogalarza.somee.com/api/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        // Actualizar los usuarios y filteredUsers
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);

        // Cerrar el formulario modal
        setShowModal(false);
      } else {
        console.log("Error al crear el usuario");
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Usuarios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonInput
                type="text"
                placeholder="Buscar por cédula"
                onIonChange={handleFilterByCedula}
              ></IonInput>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid className="grid-container">
          <IonRow className="grid-header">
            <IonCol className="grid-cell-header">Cedula</IonCol>
            <IonCol className="grid-cell-header">Contraseña</IonCol>
            <IonCol className="grid-cell-header">Nombre</IonCol>
            <IonCol className="grid-cell-header">Apellido</IonCol>
            <IonCol className="grid-cell-header">Telefono</IonCol>
            <IonCol className="grid-cell-header">Calle Principal</IonCol>
            <IonCol className="grid-cell-header">Calle Secundaria</IonCol>
            <IonCol className="grid-cell-header">Latitud</IonCol>
            <IonCol className="grid-cell-header">Longitud</IonCol>
            <IonCol className="grid-cell-header">Piso/Apartamento</IonCol>
            <IonCol className="grid-cell-header">Sector</IonCol>
            <IonCol className="grid-cell-header">Rol</IonCol>
            <IonCol className="grid-cell-header">Formulario</IonCol>
            <IonCol className="grid-cell-header">Acción</IonCol>
          </IonRow>
          {filteredUsers.map((user: any) => (
            <IonRow key={user.Cedula} className="grid-row">
              <IonCol className="grid-cell">{user.Cedula}</IonCol>
              <IonCol className="grid-cell">{user.Contraseña}</IonCol>
              <IonCol className="grid-cell">{user.Nombre}</IonCol>
              <IonCol className="grid-cell">{user.Apellido}</IonCol>
              <IonCol className="grid-cell">{user.Telefono}</IonCol>
              <IonCol className="grid-cell">{user.CallePrincipal}</IonCol>
              <IonCol className="grid-cell">{user.CalleSecundaria}</IonCol>
              <IonCol className="grid-cell">{user.Latitud}</IonCol>
              <IonCol className="grid-cell">{user.Longitud}</IonCol>
              <IonCol className="grid-cell">{user.PisoApartamento}</IonCol>
              <IonCol className="grid-cell">{user.Sector}</IonCol>
              <IonCol className="grid-cell">
                {rolOptions.find((option: any) => option.props.value === user.RolPer)?.props.children}
              </IonCol>
              <IonCol className="grid-cell">
                <IonCheckbox checked={user.FormularioCompletado} />
              </IonCol>
              <IonCol className="grid-cell">
                <IonButton
                  color={"danger"}
                  onClick={() => handleDelete(user.Cedula)}
                  className="delete-button"
                >
                  Eliminar
                </IonButton>
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>


        <IonButton
          onClick={() => setShowModal(true)}
          className="create-button"
        >
          Crear Nuevo Usuario
        </IonButton>

        <IonModal isOpen={showModal}>
          <IonGrid className="modal-container">
            <IonRow>
              <IonCol>
                <IonInput
                required
                  type="text"
                  placeholder="Cedula"
                  value={newUser.Cedula}
                  onIonChange={(e) =>
                    setNewUser({
                      ...newUser,
                      Cedula: e.target.value as string,
                    })
                  }
                ></IonInput>
              </IonCol>
              <IonCol>
                <IonInput
                required
                  type="password"
                  placeholder="Contraseña"
                  value={newUser.Contraseña}
                  onIonChange={(e) =>
                    setNewUser({
                      ...newUser,
                      Contraseña: e.target.value as string,
                    })
                  }
                ></IonInput>
              </IonCol>
              <IonCol>
                <IonSelect
                  value={newUser.RolPer}
                  placeholder="Rol"
                  onIonChange={(e) =>
                    setNewUser({
                      ...newUser,
                      RolPer: e.target.value as number,
                    })
                  }
                >
                  {rolOptions}
                </IonSelect>
              </IonCol>
              <IonCol>
              <IonButton color="success" onClick={handleCreateUser} disabled={!newUser.Cedula || !newUser.Contraseña}>Guardar</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default UsuariosAdminPage;
