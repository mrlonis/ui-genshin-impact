export interface ArtifactsResponse {
  [key: string]: string | null | undefined
  id: string
  name: string
  imageUrl: string | null | undefined
  onePieceSetEffect: string | null | undefined
  twoPieceSetEffect: string | null | undefined
  fourPieceSetEffect: string | null | undefined
}
