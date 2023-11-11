import './App.css'
import { Outlet, Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className='w-screen'>
            <h1 className="text-5xl font-bold">UC Showroom</h1>
            <p className="py-6 text-2xl">Pilih salah satu menu di bawah untuk memulai!</p>
            <Link to={`cars`}>
              <button className="btn btn-primary">Mobil</button>
            </Link>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
