import { Object3D } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: {
        object: Object3D
        [key: string]: any
      }
    }
  }
}
