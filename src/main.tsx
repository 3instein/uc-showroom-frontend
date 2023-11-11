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
import { Motorcycles } from './pages/Motorcycles.tsx';
import { Orders } from './pages/Orders.tsx';

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
      },
      {
        path: "/motorcycles",
        element: <Motorcycles />
      },
      {
        path: "/orders",
        element: <Orders />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
