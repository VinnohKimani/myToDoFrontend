import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import SignUpPage from './pages/signUp'

const routes = createBrowserRouter([
  {
    path: "/signUp",
    element: (
      
        <SignUpPage />
    ),
  },
]);

createRoot(document.getElementById('root')).render(
<StrictMode>
		<Toaster position="top-right" />
		<RouterProvider router={routes} />
	</StrictMode>

)
