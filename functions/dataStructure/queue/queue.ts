class Queue {
  queue: any = []
  enqueue = (element: any) => {
    this.queue.push(element)
  }
  dequeue = () => {
    return this.queue.shift()
  }
  front = () => {
    return this.queue[0]
  }
  isEmpty = () => {
    return this.queue.length === 0
  }
  size = () => {
    return this.queue.length
  }
  print = () => {
    console.log(this.queue.toString())
  }
}

const circularQueue = (list: any[], num: number) => {
  const queue = new Queue()
  for (let i = 0; i < list.length; i++) {
    queue.enqueue(list[i])
  }

  let eliminated = ''
  while (queue.size() > 1) {
    for (let i = 0; i < num; i++) {
      queue.enqueue(queue.dequeue())
    }
    eliminated = queue.dequeue()
    console.log(`${eliminated} is banned.`)
  }

  return queue.dequeue()
}

const winner = circularQueue([1, 2, 3, 4, 5, 6, 7, 8], 122)
console.log(`winner is ${winner}`)
