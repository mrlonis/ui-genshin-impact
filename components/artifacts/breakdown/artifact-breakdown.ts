export interface ArtifactBreakdown {
  id: string
  name: string
  imageUrl: string | null | undefined
  onePieceSetEffect: string | null | undefined
  twoPieceSetEffect: string | null | undefined
  fourPieceSetEffect: string | null | undefined
  sandsStats: ArtifactBreakdownMap | null | undefined
  gobletStats: ArtifactBreakdownMap | null | undefined
  circletStats: ArtifactBreakdownMap | null | undefined
}

export interface ArtifactBreakdownMap {
  [key: string]: ArtifactBreakdownCharacter[]
}

export interface ArtifactBreakdownCharacter {
  id: string
  name: string
  imageUrl: string | null | undefined
  substats: string[] | null | undefined
}
