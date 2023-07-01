export function InsertionSort(array: any[]) {
  const length = array.length
  let j = 0
  let temp = null

  for (let i = 0; i < length; i++) {
    j = i
    temp = array[i]
    while (j > 0 && array[j - 1] > temp) {
      array[j] = array[j - 1]
      j--
    }
    array[j] = temp
  }
}
