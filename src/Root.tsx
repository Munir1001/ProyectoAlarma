import React from "react";
import { UserProvider } from "./pages/UserContext";
import App from "./App";

const Root: React.FC = () => {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
};

export default Root;
