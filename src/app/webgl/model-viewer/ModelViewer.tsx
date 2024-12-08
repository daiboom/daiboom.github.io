// 'use client'

// import {
//   GizmoHelper,
//   GizmoViewport,
//   Html,
//   OrbitControls,
//   useGLTF,
// } from '@react-three/drei'
// import { Canvas } from '@react-three/fiber'
// import { Suspense, useState } from 'react'
// import styles from './ModelViewer.module.css'

// function Model({ url }: { url: string }) {
//   const { scene } = useGLTF(url)
//   return <primitive object={scene} />
// }

// function LoadingSpinner() {
//   return (
//     <Html center>
//       <div className={styles.spinner}>Loading...</div>
//     </Html>
//   )
// }

// export default function ModelViewer() {
//   const [modelUrl, setModelUrl] = useState<string | null>(null)
//   const [error, setError] = useState<string | null>(null)

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files
//     if (!files || files.length === 0) return

//     const gltfFile = Array.from(files).find((file) =>
//       file.name.toLowerCase().endsWith('.gltf')
//     )
//     const binFile = Array.from(files).find((file) =>
//       file.name.toLowerCase().endsWith('.bin')
//     )
//     const glbFile = Array.from(files).find((file) =>
//       file.name.toLowerCase().endsWith('.glb')
//     )

//     if (glbFile) {
//       const url = URL.createObjectURL(glbFile)
//       setModelUrl(url)
//       setError(null)
//     } else if (gltfFile) {
//       if (!binFile) {
//         setError('GLTF 파일과 함께 BIN 파일도 선택해주세요.')
//         return
//       }
//       const url = URL.createObjectURL(gltfFile)
//       setModelUrl(url)
//       setError(null)
//     } else {
//       setError('GLB 또는 GLTF+BIN 파일을 선택해주세요.')
//     }
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.uploadSection}>
//         <input
//           type="file"
//           accept=".glb,.gltf,.bin"
//           multiple
//           onChange={handleFileUpload}
//           className={styles.fileInput}
//         />
//         {!modelUrl && (
//           <p className={styles.uploadText}>
//             3D 모델 파일을 업로드하세요:
//             <br />
//             <small>
//               - GLB 파일 또는
//               <br />- GLTF + BIN 파일을 함께 선택해주세요
//             </small>
//           </p>
//         )}
//         {error && <p className={styles.errorText}>{error}</p>}
//       </div>

//       {modelUrl && (
//         <div className={styles.viewer}>
//           <Canvas
//             camera={{ position: [0, 0, 5], fov: 45 }}
//             style={{ background: '#1a1a1a' }}
//           >
//             <ambientLight intensity={0.5} />
//             <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
//             <Suspense fallback={<LoadingSpinner />}>
//               <Model url={modelUrl} />
//             </Suspense>
//             <OrbitControls makeDefault />
//             <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
//               <GizmoViewport />
//             </GizmoHelper>
//             <gridHelper args={[10, 10]} />
//             <axesHelper args={[8]} />
//           </Canvas>
//         </div>
//       )}
//     </div>
//   )
// }
'use client'

import {
  GizmoHelper,
  GizmoViewport,
  Html,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import styles from './ModelViewer.module.css'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className={styles.spinner}>Loading...</div>
    </Html>
  )
}

export default function ModelViewer() {
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [helpers, setHelpers] = useState({
    grid: true,
    axes: true,
    gizmo: true,
  })

  const toggleHelper = (helper: keyof typeof helpers) => {
    setHelpers((prev) => ({
      ...prev,
      [helper]: !prev[helper],
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const gltfFile = Array.from(files).find((file) =>
      file.name.toLowerCase().endsWith('.gltf')
    )
    const binFile = Array.from(files).find((file) =>
      file.name.toLowerCase().endsWith('.bin')
    )
    const glbFile = Array.from(files).find((file) =>
      file.name.toLowerCase().endsWith('.glb')
    )

    if (glbFile) {
      const url = URL.createObjectURL(glbFile)
      setModelUrl(url)
      setError(null)
    } else if (gltfFile) {
      if (!binFile) {
        setError('GLTF 파일과 함께 BIN 파일도 선택해주세요.')
        return
      }
      const url = URL.createObjectURL(gltfFile)
      setModelUrl(url)
      setError(null)
    } else {
      setError('GLB 또는 GLTF+BIN 파일을 선택해주세요.')
    }
  }

  return (
    <div className={styles.container}>
      {modelUrl ? (
        <>
          <div className={styles.helperControls}>
            <label>
              <input
                type="checkbox"
                checked={helpers.grid}
                onChange={() => toggleHelper('grid')}
              />
              Grid
            </label>
            <label>
              <input
                type="checkbox"
                checked={helpers.axes}
                onChange={() => toggleHelper('axes')}
              />
              Axes
            </label>
            <label>
              <input
                type="checkbox"
                checked={helpers.gizmo}
                onChange={() => toggleHelper('gizmo')}
              />
              Gizmo
            </label>
          </div>
          <div className={styles.viewer}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              style={{ background: '#1a1a1a' }}
            >
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <Suspense fallback={<LoadingSpinner />}>
                <Model url={modelUrl} />
              </Suspense>
              <OrbitControls makeDefault />
              {helpers.gizmo && (
                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                  <GizmoViewport />
                </GizmoHelper>
              )}
              {helpers.grid && <gridHelper args={[10, 10]} />}
              {helpers.axes && <axesHelper args={[8]} />}
            </Canvas>
          </div>
        </>
      ) : (
        <div className={styles.uploadSection}>
          <input
            type="file"
            accept=".glb,.gltf,.bin"
            multiple
            onChange={handleFileUpload}
            className={styles.fileInput}
          />
          {!modelUrl && (
            <p className={styles.uploadText}>
              3D 모델 파일을 업로드하세요:
              <br />
              <small>
                - GLB 파일 또는
                <br />- GLTF + BIN 파일을 함께 선택해주세요
              </small>
            </p>
          )}
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      )}
    </div>
  )
}
