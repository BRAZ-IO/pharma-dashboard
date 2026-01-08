import React from 'react';
import { Outlet } from 'react-router-dom';

const Clientes = () => {
  return (
    <div className="clientes-layout">
      <Outlet />
    </div>
  );
};

export default Clientes;
