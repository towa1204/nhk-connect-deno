import { Link, Outlet } from 'react-router-dom'

export default function NavBar() {
  return (
    <>
      <header className="lt-md:!px-4 flex w-full items-center justify-start space-x-4 px-8 py-4">
        <div className="text-lg font-bold">nhk-connect-deno</div>
        <div className="flex space-x-4">
          <Link to="/">Programs</Link>
          <Link to="/settings">Settings</Link>
        </div>
      </header>
      <div className="lt-md:!px-4 mx-auto w-full px-8 md:max-w-7xl">
        <Outlet />
      </div>
    </>
  )
}
