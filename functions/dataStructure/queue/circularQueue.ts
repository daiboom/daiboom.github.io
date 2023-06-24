class CircularQueue {
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
