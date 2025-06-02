import { createFileRoute, notFound } from '@tanstack/react-router'
import type { ProvidersType } from '../../types'

function fetchPlatformDetail(data:ProvidersType, providerId: string, platformId:string) {
    const providerData = data.providers.find((i) => i.Provider === providerId) 
    const platformData = providerData?.PlatformCounts.find((i) => i.Platform === platformId)

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
        <div className='text-left'>
        <h1 className=' text-xl font-bold pb-2'>{platformId}</h1>
        <p>{platformData.Count.toLocaleString()} total soundings</p>
        <p>First Contribution: {platformData.FirstSubmission}<br/>
        Last Contribution: {platformData.LastSubmission}</p>
        </div>
    )
}
