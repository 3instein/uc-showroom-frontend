import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Cars } from './pages/Cars.tsx';
import { Customers } from './pages/Customers.tsx';
import { Trucks } from './pages/Trucks.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/customers",
        element: <Customers />
      },
      {
        path: "/cars",
        element: <Cars />
      },
      {
        path: "/trucks",
        element: <Trucks />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
