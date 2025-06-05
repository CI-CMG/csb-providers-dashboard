import { createFileRoute, Link } from "@tanstack/react-router"
import "./index.css"
import HeaderComponent from "../../components/HeaderComponent"

export const Route = createFileRoute("/providers/")({
  component: ProvidersLayoutComponent,
  loader: async ({ context }) => {
    return context.providerData.providers;
  },
})

function ProvidersLayoutComponent() {
  const providers = Route.useLoaderData()

  return (
    <div className="wrapper">
      <header className="header">
        <HeaderComponent
          title={"Crowdsourced Bathymetry Providers"}
        ></HeaderComponent>
      </header>

      <main className="main">
        <h1 className=" text-2xl font-bold pb-2">Providers</h1>
        <table className="border-solid border-2 w-fit">
          <thead></thead>
          <tbody className="">
            {providers.map((i) => (
              <tr
                key={i.Provider}
                className={
                  i.ActiveProvider ? "active-provider" : "inactive-provider"
                }
              >
                <td
                  title={
                    i.ActiveProvider
                      ? "Data reported within the last 30 days"
                      : "No data reported within the last 30 days"
                  }
                >
                  <Link
                    to="/providers/$providerId"
                    params={{
                      providerId: i.Provider,
                    }}
                    className="block py-1 hover:opacity-75 px-5"
                    activeProps={{ className: "font-bold underline" }}
                  >
                    {i.Provider}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="italic text-sm">
          red indicates no data reported in the last 30 days
        </p>
      </main>

      <footer className="footer text-center">Footer</footer>
    </div>
  )
}
