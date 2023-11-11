// Import React and ReactDOM for rendering
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the main App component and necessary routing components
import App from './App.tsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Import individual page components
import { Cars } from './pages/Cars.tsx';
import { Customers } from './pages/Customers.tsx';
import { Trucks } from './pages/Trucks.tsx';
import { Motorcycles } from './pages/Motorcycles.tsx';
import { Orders } from './pages/Orders.tsx';

// Create a BrowserRouter with defined routes
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

// Use ReactDOM.createRoot to render the RouterProvider with the router
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);