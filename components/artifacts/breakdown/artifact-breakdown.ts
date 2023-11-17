export interface ArtifactBreakdown {
  id: string
  name: string
  imageUrl: string | null | undefined
  onePieceSetEffect: string | null | undefined
  twoPieceSetEffect: string | null | undefined
  fourPieceSetEffect: string | null | undefined
  sandsStats: string[] | null | undefined
  gobletStats: string[] | null | undefined
  circletStats: string[] | null | undefined
  substats: string[] | null | undefined
}
