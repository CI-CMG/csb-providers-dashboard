import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
// import type { ProvidersType } from './types'
import './main.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
// import type { ProvidersType } from './types'

  const fetchProvidersData = async () => {
  // return fetch('https://order-pickup.s3.amazonaws.com/csb_provider_statistics.json').then( res => res.json() )
  const response = await fetch('https://order-pickup.s3.amazonaws.com/csb_provider_statistics.json')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json()
  return(data)

}


// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    providerData: await fetchProvidersData()
  }
})
// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}