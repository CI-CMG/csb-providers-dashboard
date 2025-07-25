import { 
    createRootRouteWithContext,
    Outlet
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { ProvidersType } from '../types'
 
interface MyRouterContext {
    providerData: ProvidersType
}


export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      {/* <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr /> */}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})