// Import necessary dependencies from React and React Router
import './App.css'
import { Outlet, NavLink } from "react-router-dom";

// Define the main App component
function App() {
  // Render the component
  return (
    <>
      {/* Hero section */}
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className='w-screen'>
            {/* Main title */}
            <h1 className="text-5xl font-bold">UC Showroom</h1>
            {/* Subtitle */}
            <p className="py-6 text-2xl">Pilih salah satu menu di bawah untuk memulai!</p>
            {/* Navigation tabs */}
            <div className="tabs tabs-boxed">
              {/* Customer Tab */}
              <NavLink
                to={`customers`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "tab tab-lg tab-active"
                    : isPending
                      ? "pending"
                      : "tab tab-lg"
                }
              >
                <button className='text-lg font-semibold'>Pelanggan</button>
              </NavLink>
              {/* Cars Tab */}
              <NavLink
                to={`cars`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "tab tab-lg tab-active"
                    : isPending
                      ? "pending"
                      : "tab tab-lg"
                }
              >
                <button className='text-lg font-semibold'>Mobil</button>
              </NavLink>
              {/* Trucks Tab */}
              <NavLink
                to={`trucks`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "tab tab-lg tab-active"
                    : isPending
                      ? "pending"
                      : "tab tab-lg"
                }
              >
                <button className='text-lg font-semibold'>Truk</button>
              </NavLink>
              {/* Motorcycles Tab */}
              <NavLink
                to={`motorcycles`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "tab tab-lg tab-active"
                    : isPending
                      ? "pending"
                      : "tab tab-lg"
                }
              >
                <button className='text-lg font-semibold'>Motor</button>
              </NavLink>
              {/* Orders Tab */}
              <NavLink
                to={`orders`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "tab tab-lg tab-active"
                    : isPending
                      ? "pending"
                      : "tab tab-lg"
                }
              >
                <button className='text-lg font-semibold'>Pesanan</button>
              </NavLink>
            </div>
            {/* Render the nested routes */}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

// Export the App component as the default export
export default App;