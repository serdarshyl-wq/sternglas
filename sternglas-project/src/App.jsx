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
  const isFirstVisit = !sessionStorage.getItem('visited')
  const [isLoading, setIsLoading] = useState(isFirstVisit)
  const [alertMessage, setAlertMessage] = useState("")

  const showConceptAlert = (e) => {
    e.preventDefault()
    setAlertMessage("This is a concept project focusing on the Homepage & Configurator experience.")
    setTimeout(() => setAlertMessage(""), 3000)
  }

  // Loading sırasında scroll'u engelle
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isLoading])

  // İlk ziyarette tüm sayfa içeriği yüklenene kadar loading göster
  useEffect(() => {
    if (!isFirstVisit) return

    const onAllLoaded = () => {
      // Sayfadaki tüm görseller (img + CSS background) yüklenene kadar bekle
      const allImages = Array.from(document.querySelectorAll('img'))
        .filter(img => !img.complete)
        .map(img => new Promise(resolve => {
          img.onload = resolve
          img.onerror = resolve
        }))

      // Hero ürün görselleri de dahil
      const heroImgs = heroProducts.map(p => {
        const img = new Image()
        img.src = p.image
        return new Promise(resolve => {
          if (img.complete) return resolve()
          img.onload = resolve
          img.onerror = resolve
        })
      })

      Promise.all([...allImages, ...heroImgs]).then(() => {
        sessionStorage.setItem('visited', '1')
        setIsLoading(false)
      })
    }

    if (document.readyState === 'complete') {
      onAllLoaded()
    } else {
      window.addEventListener('load', onAllLoaded)
      return () => window.removeEventListener('load', onAllLoaded)
    }
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

      <div className={`app-content${isLoading ? ' app-content--loading' : ''}`}>
        {alertMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-md shadow-lg z-9999 font-bold text-center tracking-wide transition-all duration-300 animate-fade-in-down" style={{ fontFamily: 'var(--font-ui)' }}>
            {alertMessage}
          </div>
        )}

        <Navbar onConceptClick={showConceptAlert} />
        <Hero activeProductIndex={activeProductIndex} setActiveProductIndex={setActiveProductIndex} />
        <HeroDetails activeProductIndex={activeProductIndex} />
        <Footer onConceptClick={showConceptAlert} />

        <button
          className={`scroll-to-top-btn fixed bottom-[30px] right-[30px] w-[50px] h-[50px] bg-black text-white border-none rounded-full flex items-center justify-center text-[1.2rem] cursor-pointer z-1000 ${showScrollTop ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    </>
  )
}

export default App
