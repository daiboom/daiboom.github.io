import DefaultLayout from '@/app/components/layout'

export const metadata = {
  title: {
    default: 'WebGL 갤러리',
    template: '%S | 사이트명',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>
}
