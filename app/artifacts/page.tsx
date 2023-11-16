import ArtifactsComponent from '@/components/artifacts/artifacts.component'
import StackedLayout from '@/components/stacked-layout.component'

export default function Artifacts() {
  return (
    <StackedLayout artifacts={true}>
      <ArtifactsComponent />
    </StackedLayout>
  )
}
