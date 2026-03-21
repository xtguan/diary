import React from 'react'
import Header from './components/Header'
import About from './components/About'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Gallery from './components/Gallery'

export default function App() {
  return (
    <div className="site">
      <Header />
      <main>
        <About />
        <Projects />
        <Blog />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
