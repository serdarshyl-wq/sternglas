import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { heroProducts } from '../data/product'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const TOTAL = heroProducts.length

function Hero({ activeProductIndex, setActiveProductIndex }) {
    const [displayIndex, setDisplayIndex] = useState(activeProductIndex)
    const indexRef = useRef(activeProductIndex)
    const animatingRef = useRef(false)
    const scrollLockY = useRef(0)
    const scrollCtxRef = useRef(null)

    const sectionRef = useRef(null)
    const productRefs = useRef([])
    const bgRef = useRef(null)
    const contentRef = useRef(null)
    const priceRef = useRef(null)
    const mobilePriceRef = useRef(null)

    const getDevice = () => {
        if (window.matchMedia('(max-width: 767px)').matches) return 'mobile'
        if (window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches) return 'tablet'
        return 'desktop'
    }

    // Her index için hedef pozisyon hesapla (currentIndex'e göre)
    const getTargetProps = useCallback((index, currentIndex, device) => {
        const rel = (index - currentIndex + TOTAL) % TOTAL

        if (device === 'mobile') {
            if (rel === 0) return { left: '50%', xPercent: -50, scale: 1, zIndex: 5, pointerEvents: 'auto' }
            if (rel === 1) return { left: '150%', xPercent: -50, scale: 1, zIndex: 30, pointerEvents: 'none' }
            if (rel === TOTAL - 1) return { left: '-50%', xPercent: -50, scale: 1, zIndex: 30, pointerEvents: 'none' }
            return { left: '200%', xPercent: -50, scale: 1, zIndex: 1, pointerEvents: 'none' }
        }

        const previewScale = device === 'tablet' ? 0.8 : 0.65
        const nextLeft = device === 'tablet' ? '85%' : '80%'
        const afterLeft = device === 'tablet' ? '115%' : '110%'

        if (rel === 0) return { left: '50%', xPercent: -50, scale: 1, zIndex: 5, pointerEvents: 'auto' }
        if (rel === 1) return { left: nextLeft, xPercent: -50, scale: previewScale, zIndex: 30, pointerEvents: 'none' }
        if (rel === 2) return { left: afterLeft, xPercent: -50, scale: previewScale, zIndex: 30, pointerEvents: 'none' }
        if (rel === TOTAL - 1) return { left: '15%', xPercent: -50, scale: previewScale, zIndex: 10, pointerEvents: 'none' }
        return { left: '200%', xPercent: -50, scale: previewScale, zIndex: 1, pointerEvents: 'none' }
    }, [])

    // Tüm ürünleri hedef pozisyonlarına anında yerleştir
    const snapAllPositions = useCallback((currentIndex) => {
        const device = getDevice()
        heroProducts.forEach((_, i) => {
            const el = productRefs.current[i]
            if (!el) return
            const props = getTargetProps(i, currentIndex, device)
            gsap.set(el, { ...props, x: 0 })
        })
    }, [getTargetProps])

    // ScrollTrigger: mevcut ürünü pinle
    const setupScrollTrigger = useCallback((currentIndex) => {
        if (scrollCtxRef.current) {
            scrollCtxRef.current.revert()
            scrollCtxRef.current = null
        }

        const curEl = productRefs.current[currentIndex]
        if (!curEl) return

        const device = getDevice()

        if (device === 'mobile') {
            const ctx = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    pin: curEl,
                    pinSpacing: false
                })
            }, sectionRef)
            scrollCtxRef.current = ctx
        } else {
            const ctx = gsap.context(() => {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                        pin: curEl,
                        pinSpacing: false
                    }
                }).fromTo(curEl, { x: '0vw' }, { x: '10vw', duration: 1, ease: 'none' })
            }, sectionRef)
            scrollCtxRef.current = ctx
        }
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

    // İlk mount: pozisyon + ScrollTrigger
    useLayoutEffect(() => {
        if (productRefs.current.length === 0) return

        const idx = indexRef.current
        snapAllPositions(idx)

        if (contentRef.current) gsap.set(contentRef.current, { x: 0, opacity: 1 })
        if (priceRef.current) gsap.set(priceRef.current, { x: 0, opacity: 1 })
        if (mobilePriceRef.current) gsap.set(mobilePriceRef.current, { x: 0, opacity: 1 })
        if (bgRef.current) bgRef.current.style.backgroundColor = heroProducts[idx].leatherColor

        setupScrollTrigger(idx)

        return () => {
            if (scrollCtxRef.current) { scrollCtxRef.current.revert(); scrollCtxRef.current = null }
        }
    }, [snapAllPositions, setupScrollTrigger])

    // Geçiş tamamlandığında çağrılır
    const finishTransition = (newIdx) => {
        unlockScroll()
        indexRef.current = newIdx

        // Önce ScrollTrigger kur (sadece center element'i pin'ler)
        setupScrollTrigger(newIdx)

        // Sonra tüm pozisyonları snap — ScrollTrigger'ın olası stil müdahalesini ezecek
        snapAllPositions(newIdx)

        // State güncelle
        animatingRef.current = false
        setDisplayIndex(newIdx)
        setActiveProductIndex(newIdx)

        // React re-render sonrası güvenlik: pozisyonları tekrar uygula
        requestAnimationFrame(() => {
            heroProducts.forEach((_, i) => {
                if (i === newIdx) return // Pinli merkez element'e dokunma
                const el = productRefs.current[i]
                if (!el) return
                const props = getTargetProps(i, newIdx, getDevice())
                gsap.set(el, { ...props, x: 0 })
            })
        })
    }

    // ====== NEXT ======
    const goToNext = () => {
        if (animatingRef.current) return
        animatingRef.current = true
        lockScroll()

        const nextIdx = (indexRef.current + 1) % TOTAL
        const device = getDevice()

        // Animasyon öncesi ScrollTrigger'ı kaldır
        if (scrollCtxRef.current) { scrollCtxRef.current.revert(); scrollCtxRef.current = null }

        const tl = gsap.timeline({ onComplete: () => finishTransition(nextIdx) })

        // Her ürünü yeni hedef pozisyonuna anime et
        const imgDur = device === 'mobile' ? 0.6 : 0.8
        heroProducts.forEach((_, i) => {
            const el = productRefs.current[i]
            if (!el) return
            const target = getTargetProps(i, nextIdx, device)
            const relOld = (i - indexRef.current + TOTAL) % TOTAL

            // Wrap-around: sol dışından sağ dışına atlayan öğeyi anında taşı
            if (relOld === TOTAL - 1) {
                gsap.set(el, { ...target, x: 0 })
            } else if (relOld <= 2) {
                tl.to(el, { left: target.left, scale: target.scale, zIndex: target.zIndex, duration: imgDur, ease: 'power2.inOut' }, 0)
            } else {
                gsap.set(el, { ...target, x: 0 })
            }
        })

        // Arka plan
        tl.to(bgRef.current, {
            backgroundColor: heroProducts[nextIdx].leatherColor,
            duration: device === 'mobile' ? 0.6 : 0.8, ease: 'power2.inOut'
        }, 0)

        // Metin animasyonu
        const dur = device === 'mobile' ? 0.3 : 0.4
        const dist = device === 'mobile' ? 100 : 120

        tl.to(contentRef.current, { x: -dist, opacity: device === 'mobile' ? 1 : 0, duration: dur, ease: 'power2.in' }, 0)
        if (device === 'mobile') {
            tl.to(mobilePriceRef.current, { x: -dist, duration: dur, ease: 'power2.in' }, 0)
        } else {
            tl.to(priceRef.current, { x: -dist, opacity: 0, duration: dur, ease: 'power2.in' }, 0)
        }

        tl.call(() => setDisplayIndex(nextIdx), [], dur)

        tl.set(contentRef.current, { x: dist }, dur)
        if (device === 'mobile') {
            tl.set(mobilePriceRef.current, { x: dist }, dur)
        } else {
            tl.set(priceRef.current, { x: dist }, dur)
        }

        tl.to(contentRef.current, { x: 0, opacity: 1, duration: dur, ease: 'power2.out' }, dur)
        if (device === 'mobile') {
            tl.to(mobilePriceRef.current, { x: 0, duration: dur, ease: 'power2.out' }, dur)
        } else {
            tl.to(priceRef.current, { x: 0, opacity: 1, duration: dur, ease: 'power2.out' }, dur)
        }
    }

    // ====== PREV ======
    const goToPrev = () => {
        if (animatingRef.current) return
        animatingRef.current = true
        lockScroll()

        const prevIdx = (indexRef.current - 1 + TOTAL) % TOTAL
        const device = getDevice()

        if (scrollCtxRef.current) { scrollCtxRef.current.revert(); scrollCtxRef.current = null }

        // Prev ürünü animasyondan önce sol tarafa konumlandır (görünmez)
        const prevEl = productRefs.current[prevIdx]
        if (prevEl) {
            const startProps = getTargetProps(prevIdx, indexRef.current, device)
            // Sol dışına yerleştir
            if (device === 'mobile') {
                gsap.set(prevEl, { left: '-50%', xPercent: -50, scale: 1, opacity: 1, zIndex: 30, x: 0 })
            } else {
                const previewScale = device === 'tablet' ? 0.8 : 0.65
                gsap.set(prevEl, { left: '15%', xPercent: -50, scale: previewScale, opacity: 1, zIndex: 10, x: 0 })
            }
        }

        const tl = gsap.timeline({ onComplete: () => finishTransition(prevIdx) })

        // Wrap-around: sağ dışından sol dışına atlayan öğeyi anında taşı
        const wrapIdx = (indexRef.current + 2) % TOTAL
        const wrapEl = productRefs.current[wrapIdx]
        if (wrapEl) {
            const wrapTarget = getTargetProps(wrapIdx, prevIdx, device)
            gsap.set(wrapEl, { ...wrapTarget, x: 0 })
        }

        // Diğer ürünleri anime et
        const imgDur = device === 'mobile' ? 0.6 : 0.8
        heroProducts.forEach((_, i) => {
            const el = productRefs.current[i]
            if (!el || i === wrapIdx) return
            const target = getTargetProps(i, prevIdx, device)
            tl.to(el, { left: target.left, scale: target.scale, zIndex: target.zIndex, duration: imgDur, ease: 'power2.inOut' }, 0)
        })

        // Arka plan
        tl.to(bgRef.current, {
            backgroundColor: heroProducts[prevIdx].leatherColor,
            duration: device === 'mobile' ? 0.6 : 0.8, ease: 'power2.inOut'
        }, 0)

        // Metin animasyonu
        const dur = device === 'mobile' ? 0.3 : 0.4
        const dist = device === 'mobile' ? 100 : 120

        tl.to(contentRef.current, { x: dist, opacity: device === 'mobile' ? 1 : 0, duration: dur, ease: 'power2.in' }, 0)
        if (device === 'mobile') {
            tl.to(mobilePriceRef.current, { x: dist, duration: dur, ease: 'power2.in' }, 0)
        } else {
            tl.to(priceRef.current, { x: dist, opacity: 0, duration: dur, ease: 'power2.in' }, 0)
        }

        tl.call(() => setDisplayIndex(prevIdx), [], dur)

        tl.set(contentRef.current, { x: -dist }, dur)
        if (device === 'mobile') {
            tl.set(mobilePriceRef.current, { x: -dist }, dur)
        } else {
            tl.set(priceRef.current, { x: -dist }, dur)
        }

        tl.to(contentRef.current, { x: 0, opacity: 1, duration: dur, ease: 'power2.out' }, dur)
        if (device === 'mobile') {
            tl.to(mobilePriceRef.current, { x: 0, duration: dur, ease: 'power2.out' }, dur)
        } else {
            tl.to(priceRef.current, { x: 0, opacity: 1, duration: dur, ease: 'power2.out' }, dur)
        }
    }

    return (
        <section ref={sectionRef} className="hero-section w-full relative overflow-x-hidden h-screen" style={{ zIndex: 10 }}>
            <div ref={bgRef} className="absolute inset-0 z-0" />

            {heroProducts.map((product, index) => (
                <div
                    key={product.id}
                    ref={el => (productRefs.current[index] = el)}
                    className="hero-img-container absolute top-0 h-full flex items-center justify-center"
                >
                    <img
                        src={product.image}
                        alt={product.title}
                        className="hero-product-img object-contain cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                        onClick={goToNext}
                    />
                </div>
            ))}

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
