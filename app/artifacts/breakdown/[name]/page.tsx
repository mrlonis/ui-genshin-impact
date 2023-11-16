import ArtifactBreakdownComponent from '@/components/artifacts/breakdown/breakdown.component'
import StackedLayout from '@/components/stacked-layout.component'

export default function ArtifactBreakdown({ params }: { params: { name: string } }) {
  return (
    <StackedLayout artifacts={true}>
      <ArtifactBreakdownComponent name={params.name} />
    </StackedLayout>
  )
}
