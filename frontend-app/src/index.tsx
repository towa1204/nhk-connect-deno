import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StrictMode } from 'react'
import ErrorPage from 'error-page'
import NavBar from 'components/layout/NavBar'
import Settings from 'pages/settings/Settings'
import App from 'components/App'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

const router = createBrowserRouter([
  {
    path: '/',
    element: <NavBar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
])

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
