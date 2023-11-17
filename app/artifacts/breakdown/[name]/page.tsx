import ArtifactBreakdownComponent from '@/components/artifacts/breakdown/breakdown.component'

export default function ArtifactBreakdown({ params }: { params: { name: string } }) {
  return <ArtifactBreakdownComponent name={params.name} />
}
