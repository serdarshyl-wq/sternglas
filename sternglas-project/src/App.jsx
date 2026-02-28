import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import './App.css'
import Navbar from './homepage/Navbar'
import Hero from './homepage/Hero'
import HeroDetails from './homepage/HeroDetails'
import Footer from './homepage/Footer'
import LoadingScreen from './homepage/LoadingScreen'
import { heroProducts } from './data/product'

function App() {
  const [activeProductIndex, setActiveProductIndex] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Tüm hero ürün görselleri yüklendiğinde loading'i kaldır
  useEffect(() => {
    const images = heroProducts.map(p => {
      const img = new Image()
      img.src = p.image
      return img
    })

    Promise.all(
      images.map(img => new Promise(resolve => {
        if (img.complete) return resolve()
        img.onload = resolve
        img.onerror = resolve
      }))
    ).then(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Navbar />
      <Hero activeProductIndex={activeProductIndex} setActiveProductIndex={setActiveProductIndex} />
      <HeroDetails activeProductIndex={activeProductIndex} />
      <Footer />

      <button
        className={`scroll-to-top-btn fixed bottom-[30px] right-[30px] w-[50px] h-[50px] bg-black text-white border-none rounded-full flex items-center justify-center text-[1.2rem] cursor-pointer z-1000 ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>

    </>
  )
}

export default App
