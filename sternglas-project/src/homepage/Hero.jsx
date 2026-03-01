import { useState, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { heroProducts } from '../data/product'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

function Hero({ activeProductIndex, setActiveProductIndex }) {
    const setCurrentIndex = setActiveProductIndex
    const [displayIndex, setDisplayIndex] = useState(0)
    const indexRef = useRef(activeProductIndex)

    const sectionRef = useRef(null)
    const img1Ref = useRef(null)
    const img2Ref = useRef(null)
    const img3Ref = useRef(null)
    const bgRef = useRef(null)
    const contentRef = useRef(null)
    const priceRef = useRef(null)
    const mobilePriceRef = useRef(null)
    const scrollCtxRef = useRef(null)
    const animatingRef = useRef(false)
    const scrollLockY = useRef(0)
    const preloadedImages = useRef(new Set())

    // Tüm hero ürün görsellerini önceden yükle (deploy'da gecikmeyi önler)
    useLayoutEffect(() => {
        heroProducts.forEach(product => {
            if (!preloadedImages.current.has(product.image)) {
                const img = new Image()
                img.src = product.image
                img.onload = () => preloadedImages.current.add(product.image)
                if (img.complete) preloadedImages.current.add(product.image)
            }
        })
    }, [])

    const lockScroll = () => {
        scrollLockY.current = window.scrollY
        document.documentElement.style.overflowY = 'scroll'
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollLockY.current}px`
        document.body.style.left = '0'
        document.body.style.right = '0'
    }

    const unlockScroll = () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.documentElement.style.overflowY = ''
        window.scrollTo(0, scrollLockY.current)
    }

    // DOM üzerinden img src + pozisyon sıfırlama (React render'dan bağımsız)
    const resetPositions = (newIndex) => {
        const newCurrent = heroProducts[newIndex]
        const newNext = heroProducts[(newIndex + 1) % heroProducts.length]
        const newAfterNext = heroProducts[(newIndex + 2) % heroProducts.length]

        const img1El = img1Ref.current?.querySelector('img')
        const img2El = img2Ref.current?.querySelector('img')
        const img3El = img3Ref.current?.querySelector('img')
        if (img1El) img1El.src = newCurrent.image
        if (img2El) img2El.src = newNext.image
        if (img3El) img3El.src = newAfterNext.image

        // Arka plan rengini de DOM üzerinden güncelle
        if (bgRef.current) bgRef.current.style.backgroundColor = newCurrent.leatherColor

        const isMobile = window.matchMedia('(max-width: 767px)').matches
        const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches
        if (isMobile) {
            gsap.set(img1Ref.current, { left: '50%', x: 0, xPercent: -50, scale: 1, opacity: 1, zIndex: 5 })
            gsap.set(img2Ref.current, { left: '150%', x: 0, xPercent: -50, scale: 1, opacity: 1, zIndex: 30 })
            gsap.set(img3Ref.current, { left: '150%', x: 0, xPercent: -50, scale: 1, opacity: 1, zIndex: 30 })
        } else if (isTablet) {
            gsap.set(img1Ref.current, { left: '50%', x: 0, xPercent: -50, scale: 1, opacity: 1, zIndex: 5 })
            gsap.set(img2Ref.current, { left: '85%', x: 0, xPercent: -50, scale: 0.8, opacity: 1, zIndex: 30 })
            gsap.set(img3Ref.current, { left: '115%', x: 0, xPercent: -50, scale: 0.8, opacity: 1, zIndex: 30 })
        } else {
            gsap.set(img1Ref.current, { left: '50%', x: 0, xPercent: -50, scale: 1, opacity: 1, zIndex: 5 })
            gsap.set(img2Ref.current, { left: '80%', x: 0, xPercent: -50, scale: 0.65, opacity: 1, zIndex: 30 })
            gsap.set(img3Ref.current, { left: '110%', x: 0, xPercent: -50, scale: 0.65, opacity: 1, zIndex: 30 })
        }
    }

    // Pozisyon sıfırlama + ScrollTrigger kurulumu (tek useLayoutEffect)
    useLayoutEffect(() => {
        if (!img1Ref.current || !img2Ref.current || !img3Ref.current) return
        // Animasyon devam ediyorsa veya React eski state'i işliyorsa atla
        if (animatingRef.current || activeProductIndex !== indexRef.current) return

        resetPositions(activeProductIndex)
        if (contentRef.current) gsap.set(contentRef.current, { x: 0, opacity: 1 })
        if (priceRef.current) gsap.set(priceRef.current, { x: 0, opacity: 1 })
        if (mobilePriceRef.current) gsap.set(mobilePriceRef.current, { x: 0, opacity: 1 })

        // ScrollTrigger kurulumu
        const isMobile = window.matchMedia('(max-width: 767px)').matches

        if (isMobile) {
            const ctx = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    pin: img1Ref.current,
                    pinSpacing: false
                })
            }, sectionRef)
            return () => ctx.revert()
        }

        // Desktop/Tablet: Ana ürün pinlenir ve sağa kayar
        if (scrollCtxRef.current) scrollCtxRef.current.revert()
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    pin: img1Ref.current,
                    pinSpacing: false
                }
            })
            tl.fromTo(img1Ref.current,
                { x: '0vw' },
                { x: '10vw', duration: 1, ease: 'none' }
            )
        }, sectionRef)
        scrollCtxRef.current = ctx

        return () => ctx.revert()
    }, [activeProductIndex])

    const goToNext = () => {
        if (animatingRef.current) return
        animatingRef.current = true
        lockScroll()

        const nextIdx = (indexRef.current + 1) % heroProducts.length
        const isMobile = window.matchMedia('(max-width: 767px)').matches
        const isTabletNext = window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches
        const nextScale = isTabletNext ? 0.8 : 0.65
        const nextLeft = isTabletNext ? '85%' : '80%'

        // Sonraki turda lazım olacak görseli şimdiden yükle
        const afterNextIdx = (nextIdx + 2) % heroProducts.length
        const preImg = new Image()
        preImg.src = heroProducts[afterNextIdx].image

        const tl = gsap.timeline({
            onComplete: () => {
                unlockScroll()
                indexRef.current = nextIdx
                // rAF ile browser'ın src değişikliklerini paint etmesini bekle
                requestAnimationFrame(() => {
                    resetPositions(nextIdx)
                    animatingRef.current = false
                    setCurrentIndex(nextIdx)
                })
            }
        })

        if (isMobile) {
            tl.fromTo(img1Ref.current,
                { left: '50%' },
                { left: '-50%', duration: 0.6, ease: 'power2.inOut' },
                0
            )
            tl.fromTo(img2Ref.current,
                { left: '150%' },
                { left: '50%', duration: 0.6, ease: 'power2.inOut' },
                0
            )
            // img1 ekrandan çıkarken yeni src'yi yükle (resetPositions'dan önce hazır olsun)
            tl.call(() => {
                const img1El = img1Ref.current?.querySelector('img')
                if (img1El) img1El.src = heroProducts[nextIdx].image
                const img3El = img3Ref.current?.querySelector('img')
                if (img3El) img3El.src = heroProducts[(nextIdx + 2) % heroProducts.length].image
            }, [], 0.3)
        } else {
            tl.fromTo(img1Ref.current,
                { left: '50%', scale: 1 },
                { left: '20%', scale: nextScale, duration: 0.8, ease: 'power2.inOut' },
                0
            )
            tl.to(img2Ref.current, {
                left: '50%', scale: 1, duration: 0.8, ease: 'power2.inOut'
            }, 0)
            tl.to(img3Ref.current, {
                left: nextLeft, scale: nextScale, duration: 0.8, ease: 'power2.inOut'
            }, 0)
            // img1 kenara kayarken yeni src'yi yükle (resetPositions'dan önce hazır olsun)
            tl.call(() => {
                const img1El = img1Ref.current?.querySelector('img')
                if (img1El) img1El.src = heroProducts[nextIdx].image
                const img3El = img3Ref.current?.querySelector('img')
                if (img3El) img3El.src = heroProducts[(nextIdx + 2) % heroProducts.length].image
            }, [], 0.4)
        }

        tl.to(bgRef.current, {
            backgroundColor: heroProducts[nextIdx].leatherColor,
            duration: isMobile ? 0.6 : 0.8,
            ease: 'power2.inOut'
        }, 0)

        if (isMobile) {
            tl.to(contentRef.current, {
                x: -100, duration: 0.3, ease: 'power2.in'
            }, 0)
            tl.to(mobilePriceRef.current, {
                x: -100, duration: 0.3, ease: 'power2.in'
            }, 0)
            tl.call(() => setDisplayIndex(nextIdx), [], 0.3)
            tl.set(contentRef.current, { x: 100 }, 0.3)
            tl.set(mobilePriceRef.current, { x: 100 }, 0.3)
            tl.to(contentRef.current, {
                x: 0, duration: 0.3, ease: 'power2.out'
            }, 0.3)
            tl.to(mobilePriceRef.current, {
                x: 0, duration: 0.3, ease: 'power2.out'
            }, 0.3)
        } else {
            tl.to(contentRef.current, {
                x: -120, opacity: 0, duration: 0.4, ease: 'power2.in'
            }, 0)
            tl.to(priceRef.current, {
                x: -120, opacity: 0, duration: 0.4, ease: 'power2.in'
            }, 0)
            tl.call(() => setDisplayIndex(nextIdx), [], 0.4)
            tl.set(contentRef.current, { x: 120 }, 0.4)
            tl.set(priceRef.current, { x: 120 }, 0.4)
            tl.to(contentRef.current, {
                x: 0, opacity: 1, duration: 0.4, ease: 'power2.out'
            }, 0.4)
            tl.to(priceRef.current, {
                x: 0, opacity: 1, duration: 0.4, ease: 'power2.out'
            }, 0.4)
        }
    }

    const goToPrev = () => {
        if (animatingRef.current) return
        animatingRef.current = true
        lockScroll()

        const prevIdx = (indexRef.current - 1 + heroProducts.length) % heroProducts.length
        const isMobile = window.matchMedia('(max-width: 767px)').matches
        const isTabletPrev = window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches
        const prevScale = isTabletPrev ? 0.8 : 0.65
        const prevLeft = isTabletPrev ? '85%' : '80%'

        const tl = gsap.timeline({
            onComplete: () => {
                unlockScroll()
                indexRef.current = prevIdx
                requestAnimationFrame(() => {
                    resetPositions(prevIdx)
                    animatingRef.current = false
                    setCurrentIndex(prevIdx)
                })
            }
        })

        if (isMobile) {
            const img2El = img2Ref.current.querySelector('img')
            if (img2El) img2El.src = heroProducts[prevIdx].image

            tl.fromTo(img1Ref.current,
                { left: '50%' },
                { left: '150%', duration: 0.6, ease: 'power2.inOut' },
                0
            )
            tl.fromTo(img2Ref.current,
                { left: '-50%' },
                { left: '50%', duration: 0.6, ease: 'power2.inOut' },
                0
            )
        } else {
            // ScrollTrigger'ı kill et (scale animasyonuyla çakışmasın)
            if (scrollCtxRef.current) {
                scrollCtxRef.current.revert()
                scrollCtxRef.current = null
            }

            // img3 mevcut ürünün yerine geçer (merkezde kalır)
            const img3El = img3Ref.current.querySelector('img')
            if (img3El) img3El.src = heroProducts[indexRef.current].image
            gsap.set(img3Ref.current, { left: '50%', xPercent: -50, scale: 1, zIndex: 5 })

            // img1 sol shape'in arkasına gider, prev ürünü yüklenir
            gsap.set(img1Ref.current, { left: '15%', xPercent: -50, scale: prevScale, zIndex: 10 })
            const img1El = img1Ref.current.querySelector('img')
            if (img1El) img1El.src = heroProducts[prevIdx].image

            // img1 (prev) soldan merkeze gelir
            tl.to(img1Ref.current, {
                left: '50%', scale: 1, duration: 0.8, ease: 'power2.inOut'
            }, 0)

            // img3 (mevcut) sağa kayar
            tl.to(img3Ref.current, {
                left: prevLeft, scale: prevScale, duration: 0.8, ease: 'power2.inOut'
            }, 0)

            // img2 ekran dışına çıkar
            tl.to(img2Ref.current, {
                left: '150%', duration: 0.8, ease: 'power2.inOut'
            }, 0)
        }

        tl.to(bgRef.current, {
            backgroundColor: heroProducts[prevIdx].leatherColor,
            duration: isMobile ? 0.6 : 0.8,
            ease: 'power2.inOut'
        }, 0)

        if (isMobile) {
            tl.to(contentRef.current, {
                x: 100, duration: 0.3, ease: 'power2.in'
            }, 0)
            tl.to(mobilePriceRef.current, {
                x: 100, duration: 0.3, ease: 'power2.in'
            }, 0)
            tl.call(() => setDisplayIndex(prevIdx), [], 0.3)
            tl.set(contentRef.current, { x: -100 }, 0.3)
            tl.set(mobilePriceRef.current, { x: -100 }, 0.3)
            tl.to(contentRef.current, {
                x: 0, duration: 0.3, ease: 'power2.out'
            }, 0.3)
            tl.to(mobilePriceRef.current, {
                x: 0, duration: 0.3, ease: 'power2.out'
            }, 0.3)
        } else {
            tl.to(contentRef.current, {
                x: 120, opacity: 0, duration: 0.4, ease: 'power2.in'
            }, 0)
            tl.to(priceRef.current, {
                x: 120, opacity: 0, duration: 0.4, ease: 'power2.in'
            }, 0)
            tl.call(() => setDisplayIndex(prevIdx), [], 0.4)
            tl.set(contentRef.current, { x: -120 }, 0.4)
            tl.set(priceRef.current, { x: -120 }, 0.4)
            tl.to(contentRef.current, {
                x: 0, opacity: 1, duration: 0.4, ease: 'power2.out'
            }, 0.4)
            tl.to(priceRef.current, {
                x: 0, opacity: 1, duration: 0.4, ease: 'power2.out'
            }, 0.4)
        }
    }

    return (
        <section ref={sectionRef} className="hero-section w-full relative overflow-x-hidden h-screen" style={{ zIndex: 10 }}>
            <div
                ref={bgRef}
                className="absolute inset-0 z-0"
            />

            <div
                ref={img1Ref}
                className="hero-img-container absolute top-0 h-full flex items-center justify-center"
                style={{ zIndex: 5 }}
            >
                <img alt="current product" className="hero-product-img object-contain cursor-pointer" />
            </div>

            <div
                ref={img2Ref}
                className="hero-img-container absolute top-0 h-full flex items-center justify-center pointer-events-none"
                style={{ zIndex: 30 }}
            >
                <img
                    alt="next product"
                    className="hero-product-img object-contain cursor-pointer pointer-events-auto"
                    onClick={goToNext}
                />
            </div>

            <div
                ref={img3Ref}
                className="hero-img-container absolute top-0 h-full flex items-center justify-center pointer-events-none"
                style={{ zIndex: 30 }}
            >
                <img alt="upcoming product" className="hero-product-img object-contain cursor-pointer pointer-events-auto" />
            </div>

            <div className="hero-panel-left absolute left-0 top-0 h-full w-[40%] bg-white hero-shape-left" style={{ zIndex: 20 }}>
                <div ref={contentRef} className="flex flex-col justify-center items-center text-center h-full px-[15%]">
                    <h1 className="text-[clamp(1.75rem,5vw,5rem)] font-bold leading-[1.05] text-black mb-6" style={{ fontFamily: 'var(--font-heading)' }}>{heroProducts[displayIndex].title}</h1>
                    <p className="text-[clamp(0.85rem,1.5vw,1.2rem)] leading-[1.6] text-black/70 mb-8" style={{ fontFamily: 'var(--font-body)' }}>{heroProducts[displayIndex].description}</p>
                </div>
                <span ref={priceRef} className="absolute bottom-[5vh] hidden md:block left-[5vw] text-[clamp(4rem,10vw,8rem)] font-semibold tracking-[0.05em] text-black/80 z-30" style={{ fontFamily: 'var(--font-heading)' }}>
                    {heroProducts[displayIndex].price}
                </span>
                <div className="hero-prev-text pointer-events-auto cursor-pointer" onClick={goToPrev}>
                    <span className="uppercase tracking-[0.2em] text-black/50" style={{ fontFamily: 'var(--font-ui)' }}>Previous</span>
                </div>
            </div>

            <div className="hero-panel-right absolute right-0 top-0 h-full w-[40%] bg-white pointer-events-none hero-shape-right" style={{ zIndex: 2 }}>
                <div className="hero-next-text flex flex-col items-center justify-end h-full pb-60 pointer-events-auto cursor-pointer" onClick={goToNext}>
                    <span className="text-[clamp(1.25rem,2.5vw,2rem)] uppercase tracking-[0.2em] text-black/50 mt-2.5" style={{ fontFamily: 'var(--font-ui)' }}>Next</span>
                </div>
            </div>

            <div ref={mobilePriceRef} className="hero-mobile-price absolute z-20 w-full text-center">
                <span className="font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{heroProducts[displayIndex].price}</span>
            </div>
            <button className="hero-arrow-btn hero-arrow-left" onClick={goToPrev} aria-label="Previous product">
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className="hero-arrow-btn hero-arrow-right" onClick={goToNext} aria-label="Next product">
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </section>
    )
}

export default Hero
