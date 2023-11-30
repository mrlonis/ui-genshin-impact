export interface ArtifactBreakdown {
  id: string
  name: string
  imageUrl: string | null | undefined
  onePieceSetEffect: string | null | undefined
  twoPieceSetEffect: string | null | undefined
  fourPieceSetEffect: string | null | undefined
  characters: ArtifactBreakdownCharacter[] | null | undefined
  sandsStats: ArtifactBreakdownMap | null | undefined
  gobletStats: ArtifactBreakdownMap | null | undefined
  circletStats: ArtifactBreakdownMap | null | undefined
}

export interface ArtifactBreakdownMap {
  [key: string]: ArtifactBreakdownCharacter[] | null | undefined
}

export interface ArtifactBreakdownCharacter {
  [key: string]: string | string[] | null | undefined
  id: string
  name: string
  imageUrl: string | null | undefined
  substats: string[] | null | undefined
}
