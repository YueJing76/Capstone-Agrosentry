import React from "react";
import AppRouter from "./AppRouter";

// PASTIKAN IMPORT INI ADA DAN DALAM URUTAN YANG BENAR
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap dulu
import "./styles/globals.css"; // CSS custom setelahnya

function App() {
  return <AppRouter />;
}

export default App;
