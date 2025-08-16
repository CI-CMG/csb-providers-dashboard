import { createFileRoute, notFound } from '@tanstack/react-router'
import type { ProvidersType } from '../../types'

function fetchPlatformDetail(data:ProvidersType, providerId: string, platformId:string) {
    const providerData = data.providers.find((i) => i.Provider === providerId)
    // const platformData = providerData?.PlatformCounts.find((i) => i.Platform === platformId)
    const platformData = providerData?.PlatformCounts.filter((i) => i.UniqueId === platformId)
    console.log('platformData: ', platformData)
    if (! platformData) { throw notFound() }
    return(platformData)
}

export const Route = createFileRoute('/providers/$providerId/$platformId')({
  component: RouteComponent,
  loader: async( { context, params } ) => {
    return fetchPlatformDetail(context.providerData, params.providerId, params.platformId)
  },

  notFoundComponent: () => {
    return <></>
    // return <p>Platform not found</p>
  }
})

function RouteComponent() {
    const { platformId } = Route.useParams()
    const platformData = Route.useLoaderData()
    return (
      <div>
        {
          platformData.map((i, idx) => 
          <div key={idx} className='text-left pb-6'>
            <h1 className=' text-xl font-bold pb-2'>{platformId}</h1>
            <h2 className=' text-l font-bold'>Name: {i.Platform}</h2>
            <p>{i.Count.toLocaleString()} total soundings</p>
            <p>First Collection: {i.FirstCollection}</p>
            <p>Last Collection: {i.LastCollection}</p>
            <p>First Submission: {i.FirstSubmission}<br/>
            Last Submission: {i.LastSubmission}</p>
          </div>
          )
        }
      </div>
    )
}
