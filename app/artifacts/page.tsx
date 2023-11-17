import { ArtifactsResponse } from '@/components/artifacts/artifacts-response'
import ArtifactsComponent from '@/components/artifacts/artifacts.component'

// TODO - Eventually we'll want to remove this when the backend is deployed somewhere
export const dynamic = 'force-dynamic'

async function getData(): Promise<ArtifactsResponse[]> {
  const res = await fetch('http://localhost:9002/api/v2/artifacts', { next: { revalidate: 1 } })
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Artifacts() {
  const data = await getData()

  return <ArtifactsComponent artifacts={data} />
}
