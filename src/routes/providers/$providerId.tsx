import { createFileRoute, notFound, Outlet, Link, useNavigate } from '@tanstack/react-router'
import type { MonthlyCountType, PlatformCountType, ProvidersType } from '../../types'
import HeaderComponent from '../../components/HeaderComponent'
import BarChart from '../../components/MonthlyCountsChart/MonthlyCountsChart'

import './providerId.css'
import PlatformsTable from '../../components/PlatformsTable/PlatformsTable'

function fetchProviderDetail(data:ProvidersType, providerId:string) {
    const providerData = data.providers.find((i) => i.Provider === providerId) 
    if (! providerData) { throw notFound() }
    console.log({providerData})
    return(providerData)
}

// return a function for the tick marks and a string for the y-axis label based on range of data
function yAxisHelper(mydata:Array<MonthlyCountType>) {
    const maxValue = mydata.reduce((max, current) => {
        return Math.max(max, current.Count);
    }, -Infinity)

    if (maxValue > 1000000) {
        return ({
            axisLabel: 'Soundings (millions)',
            tickFunction:  (i:number) => i/1000000
        })
        
    // } else if (maxValue > 100000) {
    //     return ( {
    //         axisLabel: 'Soundings (hundreds of thousands',
    //         tickFunction:  (i:number) => i/100000
    //     })
    } else {
         return ( {
            axisLabel: 'Soundings (thousands)',
            tickFunction:  (i:number) => i/1000
        })
    }
}


function constructArrayElement(mydata:Array<MonthlyCountType>, year:number, month:string) {
  const searchString = `${year}-${month}-01`
  // const label = `${month}-${year}`
  const label = `${year}-${month}`

  const match = mydata.find(elem => elem.Month === searchString)
  if (match) {
    return ({'label': label, 'month': new Date(label), 'count': match.Count})
  } else {
    return ({'label': label, 'month': new Date(label), 'count': 0})
  }
}

/**
 * Given an array of non-zero monthly counts, returns a fully-populated array with items for each month
 * 
 * TODO may not be necessary with the use of Javascript Date objects and specifying domain of x-axis
 * 
 * @param data array of monthly counts
 * @returns 
 */
function generateTimeSeriesArray(data:Array<MonthlyCountType>) {
  const result = []
  const myData = data.sort((a, b) => a.Month.localeCompare(b.Month));
  const startYear = parseInt(myData[0].Month.split('-')[0])
  const now = new Date()
  const thisYear = now.getUTCFullYear()
  const thisMonth = now.getUTCMonth() + 1
  for (let yr = startYear; yr < thisYear;  yr++) {
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


function sortById() {
    console.log(`sorting by UUID`)
}

function sortByName() {
    console.log(`sorting by name`)
}

function sortByCount() {
    console.log(`sorting by count`)
}


function ProviderComponent() {
    const { providerId } = Route.useParams()
    const providerData = Route.useLoaderData()
    const navigate = useNavigate()

    const handleHomeButtonClick = () => {
        navigate({ to: '/providers'})
    }

    const timeseriesData = generateTimeSeriesArray(providerData.MonthlyCounts)
    // const dates = timeseriesData.map(i => new Date(i.label))
    // console.log({dates})
    const ylabel = yAxisHelper(providerData.MonthlyCounts)
    return (
        <div className={'wrapper'}>
            <header>
                <HeaderComponent title={'Crowdsourced Bathymetry Provider'} />
                <div>
                <button onClick={handleHomeButtonClick} className="bg-[#0F5CA0] hover:bg-blue-700 text-white font-bold text-sm py-1 px-1 m-1 rounded">Provider Index</button>
                </div>
            </header>
            <main className={'main'}>
                <h1 className=' text-2xl font-bold pb-2 pt-2'>{providerId}</h1>
                <p>Status: 
                { providerData.ActiveProvider ?
                    <span style={{"color": "green", "paddingLeft": "10px"}} title='Data reported within the last 30 days'>Active</span>
                : 
                    <span style={{"color": "red", "paddingLeft": "10px"}} title="No data reported within the last 30 days">Inactive</span>
                }
                </p>
                <p>Soundings collected from {providerData.FirstCollection} to {providerData.LastCollection}.</p>
                <p>Submissions to DCDB from {providerData.FirstSubmission} to {providerData.LastSubmission}.</p>
                {/* <p>Contributions from {providerData.MinDate} to {providerData.MaxDate}.</p> */}
                <p>{providerData.PlatformCount} unique platform(s) with {providerData.TotalSoundings.toLocaleString()} total soundings.</p>
                
                {/* <hr style={{}} className='m-10'/> */}

                <div className='flex flex-row mt-5 pt-5'>
                    <div style={{"height": "300px", "overflow":"auto", "textAlign": "left"}} className='border-solid border-2 '>
                        <table className='bg-gray-20'>
                        <thead>
                            <tr><th className='pl-6' onClick={sortById}>Platform UUID</th><th onClick={sortByName}>Name</th><th className='pr-2' onClick={sortByCount}>Number of Soundings</th></tr>
                        </thead>
                        <tbody>
                        {
                            sortPlatformsByCount(providerData.PlatformCounts).map((i, idx) => 
                            <tr key={idx}>
                                <td style={{paddingLeft: "5px", paddingRight: "10px"}}>
                                <Link
                                    to="/providers/$providerId/$platformId"
                                    params={{ providerId: providerId, platformId: i.UniqueId }}
                                    className="block py-1 hover:opacity-75 px-5"
                                    activeProps={{ className: 'font-bold underline' }}
                                >
                                    {i.UniqueId}
                                </Link>
                                </td>
                                <td style={{paddingRight: "20px"}}>
                                    {i.Platform}
                                </td>
                                {/* TODO why is Number constructor required for toLocaleString() to work? */}
                                <td style={{paddingRight: "10px"}}>{Number(i.Count).toLocaleString()}</td>
                            </tr>)
                        }
                        </tbody>
                        </table>
                    </div>
                    <div className='text-center align-middle m-8 p-1'>
                        <Outlet/>
                    </div>
                </div>
                <div className='bg-slate-100 w-fit mt-6'>
                    <BarChart data={timeseriesData} yAxisLabel={ylabel?.axisLabel} yTickFunction={ylabel?.tickFunction} />
                </div>

                <div>
                    <PlatformsTable data={providerData.PlatformCounts} provider={providerId}></PlatformsTable>
                </div>
            </main>
            <footer className='footer'></footer>
</div>
    )
}
