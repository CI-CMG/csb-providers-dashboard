import { createFileRoute, notFound, Outlet, Link } from '@tanstack/react-router'
import type { PlatformCountType, ProvidersType } from '../../types'
import HeaderComponent from '../../components/HeaderComponent'
import './providerId.css'

function fetchProviderDetail(data:ProvidersType, providerId:string) {
    const providerData = data.providers.find((i) => i.Provider === providerId) 
    if (! providerData) { throw notFound() }

    return(providerData)
}

export const Route = createFileRoute('/providers/$providerId')({
  component: ProviderComponent,
  // Path params are passed to the loader as a params object
  loader: async( { context, params } ) => {
    return fetchProviderDetail(context.providerData, params.providerId)
  },
  notFoundComponent: () => {
    return <p>Provider not found</p>
  },
})

function sortPlatformsByCount(platformArray:PlatformCountType[]) {
    return (
        platformArray.sort((a, b) => {
            if (b.Count < a.Count)  { return -1 }
            if (b.Count > a.Count)  { return 1 }
            return 0
        })
    )
}

function ProviderComponent() {
    const { providerId } = Route.useParams()
    const providerData = Route.useLoaderData()

    return (
        <div className={'wrapper'}>
            <header><HeaderComponent title={'Crowdsourced Bathymetry Provider'} /></header>
    
            <main className={'main'}>
                <h1 className=' text-2xl font-bold pb-2'>{providerId}</h1>
                <p>Status: 
                { providerData.ActiveProvider ?
                    <span style={{"color": "green", "paddingLeft": "10px"}} title='Data reported within the last 30 days'>Active</span>
                : 
                    <span style={{"color": "red", "paddingLeft": "10px"}} title="No data reported within the last 30 days">Inactive</span>
                }
                </p>
                <p>Contributions from {providerData.MinDate} to {providerData.MaxDate}.</p>
                <p>{providerData.PlatformCount} unique platform(s) with {providerData.TotalSoundings.toLocaleString()} total soundings.</p>
                
                {/* <hr style={{}} className='m-10'/> */}

                <div className='flex flex-row w-fit mt-5 pt-5'>
                    <div style={{"height": "400px", "overflow":"auto", "textAlign": "left"}} className='border-solid border-2 '>
                        <table className='bg-gray-20'>
                        <thead>
                            <tr><th className='pl-2'>Platform</th><th className='pr-2'>Number of Soundings</th></tr>
                        </thead>
                        <tbody>
                        {
                            sortPlatformsByCount(providerData.PlatformCounts).map((i) => 
                            <tr key={i.Platform}>
                                <td style={{paddingLeft: "10px", paddingRight: "10px"}}>
                                <Link
                                    to="/providers/$providerId/$platformId"
                                    params={{ providerId: providerId, platformId: i.Platform }}
                                    className="block py-1 hover:opacity-75 px-5"
                                    activeProps={{ className: 'font-bold underline' }}
                                >
                                    {i.Platform}
                                </Link>
                                </td>
                                <td style={{paddingRight: "10px"}}>{i.Count.toLocaleString()}</td>
                            </tr>)
                        }
                        </tbody>
                        </table>
                    </div>
                    <div className='text-center align-middle m-10 p-5'>
                        <Outlet/>
                    </div>
                </div>
            </main>
            <footer className='footer'>Footer</footer>
</div>
    )
}
