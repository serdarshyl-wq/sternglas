import { useState, useRef, useLayoutEffect } from 'react'
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
    const img1Ref = useRef(null)
    const img2Ref = useRef(null)
    const img3Ref = useRef(null)
    const bgRef = useRef(null)
    const contentRef = useRef(null)
    const priceRef = useRef(null)
    const mobilePriceRef = useRef(null)

    // Roller: [current, next, afterNext] → container index (0=img1, 1=img2, 2=img3)
    const rolesRef = useRef([0, 1, 2])

    const allRefs = () => [img1Ref, img2Ref, img3Ref]
    const refByRole = (role) => allRefs()[rolesRef.current[role]]

    const setImgSrc = (ref, src) => {
        const el = ref.current?.querySelector('img')
        if (el) el.src = src
    }

    // Tüm görselleri mount'ta browser cache'e yükle
    useLayoutEffect(() => {
        heroProducts.forEach(p => { const i = new Image(); i.src = p.image })
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

    const getDevice = () => {
        if (window.matchMedia('(max-width: 767px)').matches) return 'mobile'
        if (window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches) return 'tablet'
        return 'desktop'
    }

    const getPreviewProps = (device) => ({
        scale: device === 'tablet' ? 0.8 : 0.65,
        nextLeft: device === 'tablet' ? '85%' : '80%',
        afterLeft: device === 'tablet' ? '115%' : '110%'
    })

    // Z-index ve pointer-events güncelle
    const updateContainerStyles = () => {
        const cur = refByRole(0).current
        const nxt = refByRole(1).current
        const aft = refByRole(2).current
        if (!cur || !nxt || !aft) return

        gsap.set(cur, { zIndex: 5 })
        gsap.set(nxt, { zIndex: 30 })
        gsap.set(aft, { zIndex: 30 })

        cur.style.pointerEvents = 'auto'
        nxt.style.pointerEvents = 'none'
        aft.style.pointerEvents = 'none'
        const nxtImg = nxt.querySelector('img')
        const aftImg = aft.querySelector('img')
        if (nxtImg) nxtImg.style.pointerEvents = 'auto'
        if (aftImg) aftImg.style.pointerEvents = 'auto'
    }

    // ScrollTrigger'ı yeniden oluştur (current container pin)
    const setupScrollTrigger = () => {
        if (scrollCtxRef.current) {
            scrollCtxRef.current.revert()
            scrollCtxRef.current = null
        }
        const device = getDevice()
        const cur = refByRole(0)

        if (device === 'mobile') {
            const ctx = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    pin: cur.current,
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
                        pin: cur.current,
                        pinSpacing: false
                    }
                }).fromTo(cur.current, { x: '0vw' }, { x: '10vw', duration: 1, ease: 'none' })
            }, sectionRef)
            scrollCtxRef.current = ctx
        }
    }

    // Mount: pozisyon + src + ScrollTrigger
    useLayoutEffect(() => {
        if (!img1Ref.current || !img2Ref.current || !img3Ref.current) return

        const device = getDevice()
        const { scale, nextLeft, afterLeft } = getPreviewProps(device)
        const idx = indexRef.current

        // Görselleri yükle
        setImgSrc(refByRole(0), heroProducts[idx].image)
        setImgSrc(refByRole(1), heroProducts[(idx + 1) % TOTAL].image)
        setImgSrc(refByRole(2), heroProducts[(idx + 2) % TOTAL].image)

        // Pozisyonlar
        gsap.set(refByRole(0).current, { left: '50%', x: 0, xPercent: -50, scale: 1, opacity: 1 })

        if (device === 'mobile') {
            gsap.set(refByRole(1).current, { left: '150%', x: 0, xPercent: -50, scale: 1, opacity: 1 })
            gsap.set(refByRole(2).current, { left: '150%', x: 0, xPercent: -50, scale: 1, opacity: 1 })
        } else {
            gsap.set(refByRole(1).current, { left: nextLeft, x: 0, xPercent: -50, scale, opacity: 1 })
            gsap.set(refByRole(2).current, { left: afterLeft, x: 0, xPercent: -50, scale, opacity: 1 })
        }

        updateContainerStyles()

        if (contentRef.current) gsap.set(contentRef.current, { x: 0, opacity: 1 })
        if (priceRef.current) gsap.set(priceRef.current, { x: 0, opacity: 1 })
        if (mobilePriceRef.current) gsap.set(mobilePriceRef.current, { x: 0, opacity: 1 })
        if (bgRef.current) bgRef.current.style.backgroundColor = heroProducts[idx].leatherColor

        setupScrollTrigger()

        return () => {
            if (scrollCtxRef.current) { scrollCtxRef.current.revert(); scrollCtxRef.current = null }
        }
    }, [])

    // Img tıklanınca sadece "next" rolündeki container tetikler
    const handleImgClick = (containerIdx) => {
        if (containerIdx === rolesRef.current[1]) goToNext()
    }

    // ====== NEXT ======
    const goToNext = () => {
        if (animatingRef.current) return
        animatingRef.current = true
        lockScroll()

        const nextIdx = (indexRef.current + 1) % TOTAL
        const device = getDevice()
        const { scale, nextLeft } = getPreviewProps(device)

        if (scrollCtxRef.current) { scrollCtxRef.current.revert(); scrollCtxRef.current = null }

        const cur = refByRole(0)
        const nxt = refByRole(1)
        const aft = refByRole(2)

        const tl = gsap.timeline({
            onComplete: () => {
                unlockScroll()

                // Rolleri döndür: next→current, afterNext→next, current→afterNext
                const [c, n, a] = rolesRef.current
                rolesRef.current = [n, a, c]

                // Eski current (artık afterNext) → ekran dışı, yeni görsel
                const oldCur = allRefs()[c]
                setImgSrc(oldCur, heroProducts[(nextIdx + 2) % TOTAL].image)

                if (device === 'mobile') {
                    gsap.set(oldCur.current, { left: '150%', x: 0, xPercent: -50, scale: 1, opacity: 1 })
                } else {
                    const afterLeft = device === 'tablet' ? '115%' : '110%'
                    gsap.set(oldCur.current, { left: afterLeft, x: 0, xPercent: -50, scale, opacity: 1 })
                }

                updateContainerStyles()
                indexRef.current = nextIdx
                animatingRef.current = false
                setDisplayIndex(nextIdx)
                setActiveProductIndex(nextIdx)
                setupScrollTrigger()
            }
        })

        // Görsel animasyonları
        if (device === 'mobile') {
            tl.fromTo(cur.current, { left: '50%' }, { left: '-50%', duration: 0.6, ease: 'power2.inOut' }, 0)
            tl.fromTo(nxt.current, { left: '150%' }, { left: '50%', duration: 0.6, ease: 'power2.inOut' }, 0)
        } else {
            tl.fromTo(cur.current, { left: '50%', scale: 1 }, { left: '20%', scale, duration: 0.8, ease: 'power2.inOut' }, 0)
            tl.to(nxt.current, { left: '50%', scale: 1, duration: 0.8, ease: 'power2.inOut' }, 0)
            tl.to(aft.current, { left: nextLeft, scale, duration: 0.8, ease: 'power2.inOut' }, 0)
        }

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
        const { scale, nextLeft } = getPreviewProps(device)

        if (scrollCtxRef.current) { scrollCtxRef.current.revert(); scrollCtxRef.current = null }

        const cur = refByRole(0)
        const nxt = refByRole(1)
        const aft = refByRole(2)

        // afterNext container'a prev ürünü yükle (ekran dışında, kullanıcı görmez)
        setImgSrc(aft, heroProducts[prevIdx].image)

        if (device === 'mobile') {
            gsap.set(aft.current, { left: '-50%', xPercent: -50, scale: 1 })
        } else {
            gsap.set(aft.current, { left: '15%', xPercent: -50, scale, zIndex: 10 })
        }

        const tl = gsap.timeline({
            onComplete: () => {
                unlockScroll()

                // Rolleri döndür: afterNext→current, current→next, next→afterNext
                const [c, n, a] = rolesRef.current
                rolesRef.current = [a, c, n]

                // Eski next (artık afterNext) zaten doğru görsele sahip — pozisyonla
                const oldNxt = allRefs()[n]
                if (device === 'mobile') {
                    gsap.set(oldNxt.current, { left: '150%', x: 0, xPercent: -50, scale: 1, opacity: 1 })
                } else {
                    const afterLeft = device === 'tablet' ? '115%' : '110%'
                    gsap.set(oldNxt.current, { left: afterLeft, x: 0, xPercent: -50, scale, opacity: 1 })
                }

                updateContainerStyles()
                indexRef.current = prevIdx
                animatingRef.current = false
                setDisplayIndex(prevIdx)
                setActiveProductIndex(prevIdx)
                setupScrollTrigger()
            }
        })

        // Görsel animasyonları
        if (device === 'mobile') {
            tl.fromTo(cur.current, { left: '50%' }, { left: '150%', duration: 0.6, ease: 'power2.inOut' }, 0)
            tl.fromTo(aft.current, { left: '-50%' }, { left: '50%', duration: 0.6, ease: 'power2.inOut' }, 0)
        } else {
            tl.to(aft.current, { left: '50%', scale: 1, duration: 0.8, ease: 'power2.inOut' }, 0)
            tl.to(cur.current, { left: nextLeft, scale, duration: 0.8, ease: 'power2.inOut' }, 0)
            tl.to(nxt.current, { left: '150%', duration: 0.8, ease: 'power2.inOut' }, 0)
        }

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

            <div ref={img1Ref} className="hero-img-container absolute top-0 h-full flex items-center justify-center">
                <img alt="product" className="hero-product-img object-contain cursor-pointer" onClick={() => handleImgClick(0)} />
            </div>

            <div ref={img2Ref} className="hero-img-container absolute top-0 h-full flex items-center justify-center">
                <img alt="product" className="hero-product-img object-contain cursor-pointer" onClick={() => handleImgClick(1)} />
            </div>

            <div ref={img3Ref} className="hero-img-container absolute top-0 h-full flex items-center justify-center">
                <img alt="product" className="hero-product-img object-contain cursor-pointer" onClick={() => handleImgClick(2)} />
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
