import { createFileRoute, notFound, Outlet, Link } from '@tanstack/react-router'
import type { MonthlyCountType, PlatformCountType, ProvidersType } from '../../types'
import HeaderComponent from '../../components/HeaderComponent'
import BarChart from '../../components/MonthlyCountsChart/MonthlyCountsChart'

import './providerId.css'

function fetchProviderDetail(data:ProvidersType, providerId:string) {
    const providerData = data.providers.find((i) => i.Provider === providerId) 
    if (! providerData) { throw notFound() }

    return(providerData)
}


function constructArrayElement(mydata:Array<MonthlyCountType>, year:number, month:string) {
    console.log({mydata})
  const searchString = `${year}-${month}-01`
  // const label = `${month}-${year}`
  const label = `${year}-${month}`

  const match = mydata.find(elem => elem.Month === searchString)
  if (match) {
    return ({'label': label, 'count': match.Count})
  } else {
    return ({'label': label, 'count': 0})
  }
}

/**
 * Given an array of non-zero monthly counts, returns a fully-populated array with items for each month
 * 
 * @param data array of monthly counts
 * @returns 
 */
function generateTimeSeriesArray(data:Array<MonthlyCountType>) {
  const result = []

  const now = new Date()
  const thisYear = now.getUTCFullYear()
  const thisMonth = now.getUTCMonth() + 1
  for (let yr = 2017; yr < thisYear;  yr++) {
    for (let mon = 1; mon <= 12; mon++) {
      const monthString =  String(mon).padStart(2,'0')
      result.push( constructArrayElement(data, yr, monthString) )
    } 
  }
  for (let mon = 1; mon <= thisMonth; mon++) {
      const monthString =  String(mon).padStart(2,'0')
      result.push( constructArrayElement(data, thisYear, monthString) )
  } 
  return result
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

    const timeseriesData = generateTimeSeriesArray(providerData.MonthlyCounts)
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
                <div className='bg-slate-100 mt-10'>
                    <BarChart data={timeseriesData} />
                    </div>
            </main>
            <footer className='footer'>Footer</footer>
</div>
    )
}
