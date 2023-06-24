class Stack {
  items: any[] = []

  push = (element: any) => {
    this.items.push(element)
  }
  pop = () => {
    return this.items.pop()
  }
  peek = () => {
    return this.items[this.items.length - 1]
  }
  isEmpty = () => {
    return this.items.length === 0
  }
  size = () => {
    return this.items.length
  }
  clear = () => {
    this.items = []
  }
  print = () => {
    console.log(this.items.toString())
  }
}

const toBinary = (num: number) => {
  let remStack = new Stack()
  let rem = null
  let binaryString = ''

  while (num > 0) {
    rem = Math.floor(num % 2)
    remStack.push(rem)
    num = Math.floor(num / 2)
  }

  while (!remStack.isEmpty()) {
    binaryString += remStack.pop().toString()
  }

  return binaryString
}

const toBase = (num: number, base: any) => {
  let remStack = new Stack()
  let rem = null
  let baseString = ''
  let digits = '0123456789ABCDEF'

  while (num > 0) {
    rem = Math.floor(num % base)
    remStack.push(rem)
    num = Math.floor(num / base)
  }

  while (!remStack.isEmpty()) {
    baseString += digits[remStack.pop()]
  }

  return baseString
}

console.log(toBinary(233))
console.log(toBase(233, 16))
