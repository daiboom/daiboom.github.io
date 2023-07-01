export function QuickSort(array: []) {
  const partition = (array: any[], left: number, right: number) => {
    const pivot = array[Math.floor((right + left) / 2)]
    let i: number = left
    let j: number = right

    while (i <= j) {
      while (array[i] < pivot) {
        i++
      }
      while (array[j] < pivot) {
        j--
      }

      if (i <= j) {
        swapQuickSort(array, i, j)
        i++
        j--
      }
    }

    return i
  }
  const quick = (array: any[], left: number, right: number) => {
    let index = 0
    if (array.length > 1) {
      index = partition(array, left, right)

      if (left < index - 1) {
        quick(array, left, index - 1)
      }

      if (index < right) {
        quick(array, index, right)
      }
    }
  }
  quick(array, 0, array.length - 1)
}
