/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: {
        object: any
        [key: string]: any
      }
      // Three.js 기본 요소들
      mesh: any
      instancedMesh: any
      group: any
      scene: any

      // 지오메트리
      boxGeometry: any
      sphereGeometry: any
      planeGeometry: any
      ringGeometry: any
      cylinderGeometry: any
      coneGeometry: any
      torusGeometry: any
      octahedronGeometry: any
      tetrahedronGeometry: any
      icosahedronGeometry: any

      // 머티리얼
      meshBasicMaterial: any
      meshStandardMaterial: any
      meshPhongMaterial: any
      meshLambertMaterial: any
      meshPhysicalMaterial: any
      lineBasicMaterial: any
      pointsMaterial: any

      // 라이트
      ambientLight: any
      directionalLight: any
      pointLight: any
      spotLight: any
      hemisphereLight: any

      // 기타
      color: any
      fog: any
      fogExp2: any
      axesHelper: any
      gridHelper: any
      cameraHelper: any
      directionalLightHelper: any
      pointLightHelper: any
      spotLightHelper: any
      hemisphereLightHelper: any
    }
  }
}
