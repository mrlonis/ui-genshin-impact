'use client'

import { ArtifactBreakdown } from './artifact-breakdown'

function createArrayString(array: string[] | null | undefined): string {
  if (!array) {
    return 'null'
  }
  return array.join(' / ')
}

export default function ArtifactBreakdownComponent(props: { artifactBreakdown: ArtifactBreakdown }) {
  console.log(props.artifactBreakdown)
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return (
    <div>
      <p>Breakdown</p>
      <p>ID: {props.artifactBreakdown.id}</p>
      <p>Name: {props.artifactBreakdown.name}</p>
      <p>Image URL: {props.artifactBreakdown.imageUrl ?? 'null'}</p>
      <p>1-Piece: {props.artifactBreakdown.onePieceSetEffect ?? 'null'}</p>
      <p>2-Piece: {props.artifactBreakdown.twoPieceSetEffect ?? 'null'}</p>
      <p>4-Piece: {props.artifactBreakdown.fourPieceSetEffect ?? 'null'}</p>
      <p>Sands Stats: {createArrayString(props.artifactBreakdown.sandsStats)}</p>
      <p>Goblet Stats: {createArrayString(props.artifactBreakdown.gobletStats)}</p>
      <p>Circlet Stats: {createArrayString(props.artifactBreakdown.circletStats)}</p>
      <p>Subtats: {createArrayString(props.artifactBreakdown.substats)}</p>
    </div>
  )
}
