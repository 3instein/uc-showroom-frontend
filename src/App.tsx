import './App.css'
import { Outlet, NavLink } from "react-router-dom";

function App() {
  return (
    <>
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className='w-screen'>
            <h1 className="text-5xl font-bold">UC Showroom</h1>
            <p className="py-6 text-2xl">Pilih salah satu menu di bawah untuk memulai!</p>
            <div className="tabs tabs-boxed">
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
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
