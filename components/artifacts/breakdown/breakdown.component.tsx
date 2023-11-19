'use client'

import { ArtifactBreakdown, ArtifactBreakdownMap } from './artifact-breakdown'

function createArrayString(artifactBreakdownMap: ArtifactBreakdownMap | null | undefined): string {
  if (!artifactBreakdownMap) {
    return 'null'
  }
  let x = 0
  let returnValue = ''
  for (const [key, value] of Object.entries(artifactBreakdownMap)) {
    if (x != 0) {
      returnValue += ' / '
    }
    returnValue += `${key}: (`
    let i = 0
    for (let character of value) {
      if (i != 0) {
        returnValue += ', '
      }
      returnValue += `${character.name}`
      i += 1
    }
    returnValue += ')'
    x += 1
  }
  return returnValue
}

export default function ArtifactBreakdownComponent(props: { artifactBreakdown: ArtifactBreakdown }) {
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
