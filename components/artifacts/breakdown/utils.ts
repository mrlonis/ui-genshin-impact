export function build_substats_string(substats: string[] | null | undefined): string {
  if (!substats) {
    return 'No Substats to Display!'
  }
  let returnValue = ''
  for (let substat of substats) {
    returnValue += substat + ' | '
  }
  return returnValue.slice(0, -3)
}

export function getImageUrl(url: string | null | undefined) {
  if (!url) {
    return 'https://avatars.githubusercontent.com/u/86160567?s=200&v=4'
  }
  return 'http://localhost:9002/api/' + url
}
