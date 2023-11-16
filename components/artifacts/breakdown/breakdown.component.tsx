'use client'

export default function ArtifactBreakdownComponent(props: { name: string }) {
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return (
    <div>
      <p>Breakdown</p>
      <p>Search: {decodeURI(props.name)}</p>
    </div>
  )
}
