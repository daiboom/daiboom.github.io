interface PriorityQueueClass {
  enqueue: () => {}
}
class QueueElement {
  public element
  public priority

  constructor(element: any, priority: number) {
    this.element = element
    this.priority = priority
  }
}

class PriorityQueue {
  queue: any[] = []

  enqueue = (element: any, priority: number) => {
    const queueElement = new QueueElement(element, priority)
    if (this.isEmpty()) {
      this.queue.push(queueElement)
    } else {
      let added = false
      for (let i = 0; i < this.queue.length; i++) {
        if (queueElement.priority < this.queue[i].priority) {
          const left = this.queue.slice(0, i)
          const right = this.queue.slice(i)

          this.queue = [...left, queueElement, ...right]
          added = true
          break
        }
      }
    }
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
    console.log(JSON.stringify(this.queue))
  }
}

const priorityQueue = new PriorityQueue()
priorityQueue.enqueue('John', 1)
priorityQueue.enqueue('Jack', 2)
priorityQueue.enqueue('Camila', 3)
priorityQueue.print()
