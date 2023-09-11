

import Content from './Content'
import Footer from './Footer'
import Header from './Header'
import SubHeader from './SubHeader'

export default function Layout({ children }: {children: JSX.Element}) {
  return (
    <>
    <Header/> 
    <SubHeader />
      <Content >
      <main>{children}</main>
      </Content>
      <Footer />
    </>
  )
}