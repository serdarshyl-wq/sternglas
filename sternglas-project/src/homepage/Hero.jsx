import { useState, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { heroProducts } from '../data/product'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

function Hero({ activeProductIndex, setActiveProductIndex }) {
    const currentIndex = activeProductIndex
    const setCurrentIndex = setActiveProductIndex
    const [displayIndex, setDisplayIndex] = useState(0)

    const sectionRef = useRef(null)
    const img1Ref = useRef(null)
    const img2Ref = useRef(null)
    const img3Ref = useRef(null)
    const bgRef = useRef(null)
    const contentRef = useRef(null)
    const rightPanelRef = useRef(null)
    const priceRef = useRef(null)
    const mobilePriceRef = useRef(null)
    const scrollCtxRef = useRef(null)
    const animatingRef = useRef(false)
    const cooldownRef = useRef(null)

    const current = heroProducts[currentIndex]
    const next = heroProducts[(currentIndex + 1) % heroProducts.length]
    const afterNext = heroProducts[(currentIndex + 2) % heroProducts.length]

    // Her index değişiminde pozisyonları sıfırla
    useLayoutEffect(() => {
        if (!img1Ref.current || !img2Ref.current || !img3Ref.current) return

        const isMobile = window.matchMedia('(max-width: 767px)').matches
        const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches
        if (isMobile) {
            gsap.set(img1Ref.current, { left: '50%', xPercent: -50, scale: 1, opacity: 1 })
            gsap.set(img2Ref.current, { left: '150%', xPercent: -50, scale: 1, opacity: 1 })
            gsap.set(img3Ref.current, { left: '150%', xPercent: -50, scale: 1, opacity: 1 })
        } else if (isTablet) {
            gsap.set(img1Ref.current, { left: '50%', xPercent: -50, scale: 1, opacity: 1 })
            gsap.set(img2Ref.current, { left: '85%', xPercent: -50, scale: 0.8, opacity: 1 })
            gsap.set(img3Ref.current, { left: '115%', xPercent: -50, scale: 0.8, opacity: 1 })
        } else {
            gsap.set(img1Ref.current, { left: '50%', xPercent: -50, scale: 1, opacity: 1 })
            gsap.set(img2Ref.current, { left: '80%', xPercent: -50, scale: 0.65, opacity: 1 })
            gsap.set(img3Ref.current, { left: '110%', xPercent: -50, scale: 0.65, opacity: 1 })
        }
        if (contentRef.current) gsap.set(contentRef.current, { x: 0, opacity: 1 })
        if (priceRef.current) gsap.set(priceRef.current, { x: 0, opacity: 1 })
        if (mobilePriceRef.current) gsap.set(mobilePriceRef.current, { x: 0, opacity: 1 })
    }, [currentIndex])

    useLayoutEffect(() => {
        const isMobile = window.matchMedia('(max-width: 767px)').matches

        if (isMobile) {
            // Mobil: ürün pinlenir ve üstte sabit kalır (aşağı kaymaz)
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
    }, [currentIndex])

    const goToNext = () => {
        if (animatingRef.current) return
        animatingRef.current = true

        const nextIdx = (currentIndex + 1) % heroProducts.length
        const isMobile = window.matchMedia('(max-width: 767px)').matches
        const isTabletNext = window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches
        const nextScale = isTabletNext ? 0.8 : 0.65
        const nextLeft = isTabletNext ? '85%' : '80%'

        const tl = gsap.timeline({
            onComplete: () => {
                setCurrentIndex(nextIdx)
                // 1.5 saniye cooldown — render alması için
                cooldownRef.current = setTimeout(() => {
                    animatingRef.current = false
                    cooldownRef.current = null
                }, 1500)
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

        const prevIdx = (currentIndex - 1 + heroProducts.length) % heroProducts.length
        const isMobile = window.matchMedia('(max-width: 767px)').matches
        const isTabletPrev = window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches
        const prevScale = isTabletPrev ? 0.8 : 0.65
        const prevLeft = isTabletPrev ? '85%' : '80%'

        const tl = gsap.timeline({
            onComplete: () => {
                setCurrentIndex(prevIdx)
                // 1.5 saniye cooldown — render alması için
                cooldownRef.current = setTimeout(() => {
                    animatingRef.current = false
                    cooldownRef.current = null
                }, 1500)
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
            // Desktop & Tablet: reverse of goToNext
            // ScrollTrigger'ı kill et (scale animasyonuyla çakışmasın)
            if (scrollCtxRef.current) {
                scrollCtxRef.current.revert()
                scrollCtxRef.current = null
            }

            // img3'ün görselini prev ürünüyle değiştir (img3 ekran dışında, güvenli)
            const img3El = img3Ref.current.querySelector('img')
            if (img3El) img3El.src = heroProducts[prevIdx].image

            // img3: sol shape'in arkasından merkeze gelir
            gsap.set(img3Ref.current, { left: '15%', xPercent: -50, scale: prevScale, zIndex: 10 })
            tl.to(img3Ref.current, {
                left: '50%', scale: 1, zIndex: 30, duration: 0.8, ease: 'power2.inOut'
            }, 0)

            tl.fromTo(img1Ref.current,
                { left: '50%', scale: 1 },
                { left: prevLeft, scale: prevScale, duration: 0.8, ease: 'power2.inOut' },
                0
            )

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
            // Desktop/Tablet: text ve price sağa kayar, soldan girer
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
                style={{ backgroundColor: current.leatherColor }}
            />

            <div
                ref={img1Ref}
                className="hero-img-container absolute top-0 h-full flex items-center justify-center"
                style={{ zIndex: 5 }}
            >
                <img src={current.image} alt={current.title} className="hero-product-img object-contain cursor-pointer" />
            </div>

            <div
                ref={img2Ref}
                className="hero-img-container absolute top-0 h-full flex items-center justify-center pointer-events-none"
                style={{ zIndex: 30 }}
            >
                <img
                    src={next.image}
                    alt={next.title}
                    className="hero-product-img object-contain cursor-pointer pointer-events-auto"
                    onClick={goToNext}
                />
            </div>

            <div
                ref={img3Ref}
                className="hero-img-container absolute top-0 h-full flex items-center justify-center pointer-events-none"
                style={{ zIndex: 30 }}
            >
                <img src={afterNext.image} alt={afterNext.title} className="hero-product-img object-contain cursor-pointer pointer-events-auto" />
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

            <div ref={rightPanelRef} className="hero-panel-right absolute right-0 top-0 h-full w-[40%] bg-white pointer-events-none hero-shape-right" style={{ zIndex: 2 }}>
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
