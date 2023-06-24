export const compare = (a: number, b: number) => {
  if (a < b) {
    return -1
  }

  if (a > b) {
    return 1
  }

  return 0
}
