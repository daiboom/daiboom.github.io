import { Bodies, Body, Engine, Events, Render, Runner, World } from 'matter-js'
import { CustomBody, FRUITS_BASE, Fruit } from './fruits'

export class SuikaGame {
  private engine: Matter.Engine
  private render: Matter.Render
  private world: Matter.World
  private currentBody: Matter.Body | null = null
  private currentFruit: Fruit | null = null
  private disableAction: boolean = false
  private interval: NodeJS.Timeout | null = null
  private numberSuika: number = 0

  constructor(container: HTMLElement) {
    this.engine = Engine.create()
    this.render = Render.create({
      engine: this.engine,
      element: container,
      options: {
        wireframes: false,
        background: '#F7F4C8',
        width: 620,
        height: 850,
      },
    })
    this.world = this.engine.world
    this.initialize()
  }

  private initialize(): void {
    this.createWalls()
    this.setupEventListeners()
    this.startGame()
  }

  private createWalls(): void {
    const leftWall = Bodies.rectangle(15, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: '#E6B143' },
    })

    const rightWall = Bodies.rectangle(605, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: '#E6B143' },
    })

    const ground = Bodies.rectangle(310, 820, 620, 60, {
      isStatic: true,
      render: { fillStyle: '#E6B143' },
    })

    const topLine = Bodies.rectangle(310, 150, 620, 2, {
      label: 'topLine',
      isStatic: true,
      isSensor: true,
      render: { fillStyle: '#E6B143' },
    })

    World.add(this.world, [leftWall, rightWall, ground, topLine])
  }

  private addFruit(): void {
    const index = Math.floor(Math.random() * 5)
    const fruit = FRUITS_BASE[index]

    const body = Bodies.circle(300, 50, fruit.radius, {
      index,
      isSleeping: true,
      render: {
        sprite: {
          texture: `${fruit.name}.png`,
          xScale: 1,
          yScale: 1,
        },
      },
      restitution: 0.2,
    } as CustomBody)

    this.currentBody = body
    this.currentFruit = fruit

    World.add(this.world, body)
  }

  private handleCollision = (
    event: Matter.IEventCollision<Matter.Engine>
  ): void => {
    event.pairs.forEach((collision) => {
      const bodyA = collision.bodyA as CustomBody
      const bodyB = collision.bodyB as CustomBody

      if (bodyA.index === bodyB.index) {
        const index = bodyA.index

        if (index === FRUITS_BASE.length - 1) return

        World.remove(this.world, [bodyA, bodyB])

        const newFruit = FRUITS_BASE[index + 1]
        const newBody = Bodies.circle(
          collision.collision.supports[0].x,
          collision.collision.supports[0].y,
          newFruit.radius,
          {
            index: index + 1,
            render: {
              sprite: {
                texture: `${newFruit.name}.png`,
                xScale: 1,
                yScale: 1,
              },
            },
          } as CustomBody
        ) as CustomBody

        World.add(this.world, newBody)

        if (newBody.index === FRUITS_BASE.length - 1) {
          this.numberSuika += 1
          if (this.numberSuika > 1) {
            alert('success')
          }
        }
      }

      if (
        !this.disableAction &&
        (bodyA.label === 'topLine' || bodyB.label === 'topLine')
      ) {
        alert('game over')
      }
    })
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disableAction || !this.currentBody) return

    switch (event.code) {
      case 'KeyA':
        if (this.interval) return
        this.interval = setInterval(() => {
          if (
            this.currentBody &&
            this.currentFruit &&
            this.currentBody.position.x - this.currentFruit.radius > 30
          ) {
            Body.setPosition(this.currentBody, {
              x: this.currentBody.position.x - 10,
              y: this.currentBody.position.y,
            })
          }
        }, 10)
        break

      case 'KeyD':
        if (this.interval) return
        this.interval = setInterval(() => {
          if (
            this.currentBody &&
            this.currentFruit &&
            this.currentBody.position.x + this.currentFruit.radius < 590
          ) {
            Body.setPosition(this.currentBody, {
              x: this.currentBody.position.x + 10,
              y: this.currentBody.position.y,
            })
          }
        }, 10)
        break

      case 'KeyS':
        if (this.currentBody) {
          this.currentBody.isSleeping = false
          this.disableAction = true
          setTimeout(() => {
            this.addFruit()
            this.disableAction = false
          }, 1000)
        }
        break
    }
  }

  private handleKeyUp = (event: KeyboardEvent): void => {
    switch (event.code) {
      case 'KeyA':
      case 'KeyD':
        if (this.interval) {
          clearInterval(this.interval)
          this.interval = null
        }
        break
    }
  }

  private setupEventListeners(): void {
    Events.on(this.engine, 'collisionStart', this.handleCollision)
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
  }

  public startGame(): void {
    Render.run(this.render)
    Runner.run(this.engine)
    this.addFruit()
  }

  public destroy(): void {
    if (this.interval) {
      clearInterval(this.interval)
    }
    World.clear(this.world, false)
    Engine.clear(this.engine)
    this.render.canvas.remove()
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
  }
}
