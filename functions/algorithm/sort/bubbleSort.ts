export function BubbleSort(target: any[]) {
  const length = target.length

  const swap = (target: any[], idx1: number, idx2: number) => {
    const aux = target[idx1]
    target[idx1] = target[idx2]
    target[idx2] = aux
    return target
  }

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - 1; j++) {
      if (target[j] > target[j + 1]) {
        swap(target, j, j + 1)
      }
    }
  }
}
