import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
<>
      <div className="p-2 flex gap-2 text-lg border-b">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/providers"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Providers
          </Link>
      </div>
      <hr />

    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
    </>
  )
}