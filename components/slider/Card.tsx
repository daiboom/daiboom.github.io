import { ReactElement } from 'react'

export default function Card({
  title,
  children,
}: {
  title: string
  children: ReactElement | ReactElement[]
}) {
  return (
    <div className="p-2">
      <div className="p-4  bg-white shadow-md rounded-md inline-block">
        <div className="px-3 font-bold text-xl pb-4">{title}</div>
        {children}
      </div>
    </div>
  )
}
