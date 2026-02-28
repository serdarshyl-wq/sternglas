import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/all'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { heroProducts } from '../data/product'
import { productDetails } from '../data/Details'
import './HeroDetails.css'

gsap.registerPlugin(ScrollTrigger, Draggable)

function HeroDetails({ activeProductIndex }) {
    const sectionRef = useRef(null)
    const stickyRef = useRef(null)
    const productRef = useRef(null)
    const titleRef = useRef(null)
    const germanAwardRef = useRef(null)
    const strapRefs = useRef([])
    const strapDescRef = useRef(null)

    const varDescRef = useRef(null)
    const varWrapperRef = useRef(null)
    const varRefs = useRef([])
    const singleVariationRef = useRef(null)

    const [loopVariations, setLoopVariations] = useState([])

    const videoRef = useRef(null)
    const videoSectionRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const product = heroProducts[activeProductIndex]
    const details = productDetails.find(d => d.id === product.id)

    // Viewport Auto-Play
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    videoElement.play().catch(e => console.log(e));
                    setIsPlaying(true);
                } else {
                    videoElement.pause();
                    setIsPlaying(false);
                }
            })
        }, { threshold: 0.5 });

        observer.observe(videoElement);

        return () => observer.disconnect();
    }, [details])

    // Varyasyonları sonsuz döngü için çoğalt
    useEffect(() => {
        if (details?.variations) {
            if (details.variations.length === 1) {
                // Tek bir varyasyon varsa klonlamaya ve loop'a gerek yok
                setLoopVariations([...details.variations])
            } else {
                setLoopVariations([
                    ...details.variations,
                    ...details.variations,
                    ...details.variations,
                    ...details.variations,
                    ...details.variations,
                    ...details.variations
                ])
            }
        }
    }, [details])

    useLayoutEffect(() => {
        if (!details || !sectionRef.current) return

        // Ref array'lerini veri değiştiğinde temizle
        strapRefs.current = strapRefs.current.slice(0, details.strapOptions.length)
        varRefs.current = varRefs.current.slice(0, loopVariations.length)

        const ctx = gsap.context(() => {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === sectionRef.current) st.kill()
            })

            const straps = strapRefs.current.filter(Boolean)
            const isMobile = window.matchMedia('(max-width: 767px)').matches

            // ===== INITIAL STATES =====
            if (!productRef.current || !titleRef.current) return

            gsap.set(productRef.current, {
                top: '50%',
                left: '50%',
                x: isMobile ? '0vw' : '10vw',
                xPercent: -50,
                yPercent: -50,
                scale: 1,
                opacity: 0
            })

            if (isMobile) {
                gsap.set(titleRef.current, {
                    top: 'auto',
                    bottom: '10%',
                    left: '50%',
                    xPercent: -50,
                    yPercent: 0,
                    textAlign: 'center',
                    fontSize: 'clamp(3rem, 14vw, 6rem)',
                    opacity: 0
                })
            } else {
                gsap.set(titleRef.current, {
                    top: '50%',
                    left: '15%',
                    yPercent: -50,
                    opacity: 0
                })
            }

            straps.forEach(el => {
                gsap.set(el, {
                    top: '50%',
                    left: '50%',
                    x: '10vw',
                    xPercent: -50,
                    yPercent: -50,
                    opacity: 0,
                    scale: 0.3
                })
            })

            if (strapDescRef.current) gsap.set(strapDescRef.current, { y: '100%', opacity: 0 })

            if (varDescRef.current) gsap.set(varDescRef.current, { y: '100%', opacity: 0, position: 'absolute' })

            if (varWrapperRef.current) gsap.set(varWrapperRef.current, {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1
            })

            if (product.id === 2 && singleVariationRef.current) {
                gsap.set(singleVariationRef.current, {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    x: '0vw',
                    yPercent: -50,
                    xPercent: -50,
                    opacity: 0,
                    scale: 1
                })
            } else if (varRefs.current.filter(Boolean).length > 0) {
                gsap.set(varRefs.current.filter(Boolean), {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    x: '0vw',
                    yPercent: -50,
                    xPercent: -50,
                    opacity: 0,
                    scale: 1
                })
            }

            // Sadece ilk geçiş anını dinleyip ürün görünürlüğünü açıyoruz
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom bottom',
                onEnter: () => gsap.set(productRef.current, { opacity: 1 }),
                onLeaveBack: () => gsap.set(productRef.current, { opacity: 0 })
            })

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'top top',
                    scrub: true
                }
            })

            if (isMobile) {
                tl.fromTo(titleRef.current,
                    { bottom: '-10%', opacity: 0 },
                    { bottom: '10%', opacity: 1, duration: 1, ease: 'none' }
                )
            } else {
                tl.fromTo(titleRef.current,
                    { left: '-20%', opacity: 0 },
                    { left: '10%', opacity: 1, duration: 1, ease: 'none' }
                )
            }

            if (germanAwardRef.current) {
                if (isMobile) {
                    gsap.set(germanAwardRef.current, {
                        top: '10%',
                        left: '50%',
                        xPercent: -50,
                        right: 'auto',
                        width: '60vw',
                        opacity: 0
                    })
                    tl.to(germanAwardRef.current,
                        { opacity: 1, duration: 1, ease: 'none' },
                        '<'
                    )
                } else {
                    tl.fromTo(germanAwardRef.current,
                        { right: '-20%', opacity: 0 },
                        { right: '15%', opacity: 1, duration: 1, ease: 'none' },
                        '<'
                    )
                }
            }

            // MASTER TIMELINE (PHASE 2 & PHASE 3 SEQUENCED)
            const masterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5,
                    pin: false
                }
            })

            // ==== PHASE 2 ====
            masterTl.addLabel('phase2', 0)

            if (isMobile) {
                masterTl.to(titleRef.current, {
                    left: '120%',
                    opacity: 0,
                    duration: 1,
                    ease: 'power1.inOut'
                }, 'phase2')

                if (germanAwardRef.current) {
                    masterTl.to(germanAwardRef.current, {
                        left: '120%',
                        opacity: 0,
                        duration: 1,
                        ease: 'power1.inOut'
                    }, 'phase2')
                }

                masterTl.to(productRef.current, {
                    top: '25%',
                    x: '-25vw',
                    duration: 1,
                    ease: 'power2.inOut'
                }, 'phase2')

                if (straps[0]) {
                    masterTl.to(straps[0], {
                        top: '25%',
                        left: '50%',
                        x: '25vw',
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: 'power2.out'
                    }, 'phase2+=0.2')
                }

                if (straps[1]) {
                    masterTl.to(straps[1], {
                        top: '65%',
                        left: '50%',
                        x: '0vw',
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: 'power2.out'
                    }, 'phase2+=0.2')
                }

                masterTl.to(strapDescRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out'
                }, 'phase2+=0.2')
            } else {
                // Desktop: mevcut davranış
                masterTl.to(titleRef.current, {
                    left: '-20%',
                    opacity: 0,
                    duration: 1,
                    ease: 'power1.inOut'
                }, 'phase2')

                if (germanAwardRef.current) {
                    masterTl.to(germanAwardRef.current, {
                        right: '-20%',
                        opacity: 0,
                        duration: 1,
                        ease: 'power1.inOut'
                    }, 'phase2')
                }

                masterTl.to(productRef.current, {
                    top: '30%',
                    duration: 1,
                    ease: 'power2.inOut'
                }, 'phase2')

                masterTl.to(strapDescRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out'
                }, 'phase2+=0.2')

                const numStraps = straps.length
                const totalItems = numStraps + 1;
                const gapVw = 22.5;

                const positions = Array.from({ length: totalItems }).map((_, i) => {
                    return (i - (totalItems - 1) / 2) * gapVw;
                });
                const mainProductIndex = Math.floor(totalItems / 2);
                const mainProductX = positions[mainProductIndex];

                masterTl.to(productRef.current, {
                    x: `${mainProductX}vw`,
                    duration: 1,
                    ease: 'power2.inOut'
                }, 'phase2');

                const strapPositions = positions.filter((_, i) => i !== mainProductIndex);

                straps.forEach((el, index) => {
                    masterTl.to(el, {
                        top: '30%',
                        left: '50%',
                        x: `${strapPositions[index]}vw`,
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: 'power2.out'
                    }, 'phase2+=0.2');
                });
            }

            // ==== PHASE 3 ====
            masterTl.addLabel('phase3_start', isMobile ? 'phase2+=0.8' : 'phase2+=1.5')

            masterTl.to(productRef.current, {
                x: '0vw',
                duration: 1.5,
                ease: 'power2.inOut'
            }, 'phase3_start')

            straps.forEach((el) => {
                masterTl.to(el, {
                    x: '0vw',
                    opacity: 0,
                    scale: 0.5,
                    duration: 1.5,
                    ease: 'power2.inOut'
                }, 'phase3_start')
            })

            masterTl.addLabel('phase3_text_swap', isMobile ? 'phase3_start+=0.5' : 'phase3_start+=1')

            masterTl.to(strapDescRef.current, {
                y: '-100%',
                opacity: 0,
                duration: 1.5,
                ease: 'power2.in'
            }, 'phase3_text_swap')

            masterTl.to(varDescRef.current, {
                y: '0%',
                opacity: 1,
                duration: 1.5,
                ease: 'power2.out'
            }, 'phase3_text_swap+=0.5')

            masterTl.addLabel('phase3_variations', isMobile ? 'phase3_text_swap+=0.3' : 'phase3_text_swap+=0.5')

            if (product.id === 2) {
                const isMobileVar = window.matchMedia('(max-width: 767px)').matches
                const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches
                const displacement = isMobileVar ? '25vw' : isTablet ? '22vw' : '18vw'

                masterTl.to(productRef.current, {
                    x: `-${displacement}`,
                    duration: 1.5,
                    ease: 'power2.out'
                }, 'phase3_variations')

                if (singleVariationRef.current) {
                    masterTl.fromTo(singleVariationRef.current,
                        { x: '0vw', y: isMobileVar ? '-6vh' : '0vh' },
                        {
                            x: displacement,
                            y: isMobileVar ? '-6vh' : '0vh',
                            opacity: 1,
                            scale: 1,
                            duration: 1.5,
                            ease: 'power2.out'
                        }, 'phase3_variations')
                }
            } else {
                masterTl.to(productRef.current, {
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out'
                }, 'phase3_variations+=1.5')

                const validVars = varRefs.current.filter(Boolean)
                if (validVars.length > 0) {
                    validVars.forEach((el, i) => {
                        const isMobileVar = window.matchMedia('(max-width: 767px)').matches
                        const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches
                        const gap = isMobileVar ? 65 : isTablet ? 25 : 23
                        const finalX = (i - 1) * gap
                        if (i < 4) {
                            masterTl.to(el, {
                                x: `${finalX}vw`,
                                opacity: 1,
                                scale: 1,
                                duration: 1.5,
                                ease: 'power2.out'
                            }, `phase3_variations+=${i * 0.3}`)
                        } else {
                            masterTl.fromTo(el,
                                { x: `${finalX}vw` },
                                { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
                                `phase3_variations+=1.2`
                            )
                        }
                    })
                }
            }

        }, sectionRef)

        return () => ctx.revert()
    }, [activeProductIndex, loopVariations])

    useEffect(() => {
        if (!varWrapperRef.current || loopVariations.length === 0) return

        const wrapper = varWrapperRef.current
        let autoScrollTween;
        let drag;

        if (product.id === 2) {
            gsap.killTweensOf(wrapper)
            return () => {
                gsap.killTweensOf(wrapper)
            }
        }

        const items = varRefs.current.filter(Boolean)

        if (items.length === 0) return

        const originalLength = details.variations.length
        const vwToPx = window.innerWidth / 100
        const isMobile = window.matchMedia('(max-width: 767px)').matches
        const gap = isMobile ? 85 : 23
        const singleSetWidthPx = originalLength * gap * vwToPx

        const offscreenOffsetPx = 100 * vwToPx;

        const startAutoScroll = () => {
            if (autoScrollTween) autoScrollTween.kill()

            autoScrollTween = gsap.to(wrapper, {
                x: `-=${singleSetWidthPx}`,
                duration: originalLength * 4,
                ease: "none",
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize(gsap.utils.wrap(-singleSetWidthPx - offscreenOffsetPx, -offscreenOffsetPx))
                }
            })
        }

        drag = Draggable.create(wrapper, {
            type: "x",
            inertia: true,
            cursor: "auto",
            activeCursor: "auto",
            modifiers: {
                x: gsap.utils.unitize(gsap.utils.wrap(-singleSetWidthPx - offscreenOffsetPx, -offscreenOffsetPx))
            },
            onPress: () => {
                if (autoScrollTween) autoScrollTween.kill()
            },
            onRelease: function () {
                if (!this.tween || !this.tween.isActive()) {
                    startAutoScroll()
                }
            },
            onThrowComplete: () => {
                startAutoScroll()
            }
        })
        startAutoScroll()

        return () => {
            if (drag && drag[0]) drag[0].kill()
            if (autoScrollTween) autoScrollTween.kill()
            gsap.killTweensOf(wrapper)
        }
    }, [loopVariations, product.id])

    if (!details) return null

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play()
                setIsPlaying(true)
            } else {
                videoRef.current.pause()
                setIsPlaying(false)
            }
        }
    }

    return (
        <>
            <section ref={sectionRef} className="hero-details-section relative w-full h-[600vh] bg-white cursor-auto" style={{ zIndex: 1 }}>
                <div ref={stickyRef} className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
                    <div ref={productRef} className="hero-details__product absolute z-10">
                        <img src={product.image} alt={product.title} className="max-h-[75vh] max-w-none object-contain" />
                    </div>
                    <div ref={titleRef} className="hero-details__title absolute z-11 text-[6vw] font-bold text-black text-left leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                        {product.id === 2 ? (
                            <>
                                <div className="md:hidden text-[12vw] leading-tight">
                                    <span className="block whitespace-nowrap">NAOS SOLAR</span>
                                    <span className="block whitespace-nowrap">DARK GREEN</span>
                                </div>
                                <div className="hidden md:block">
                                    <span className="block">NAOS</span>
                                    <span className="block">SOLAR</span>
                                    <span className="block">DARK</span>
                                    <span className="block">GREEN</span>
                                </div>
                            </>
                        ) : (
                            product.title.split(' ').map((word, index) => (
                                <span key={index} className="block">
                                    {word}
                                </span>
                            ))
                        )}
                    </div>

                    {(product.id === 1 || product.id === 2) && (
                        <div ref={germanAwardRef} className="hero-details__german-award absolute z-12 top-[10%] max-md:left-1/2 max-md:-translate-x-1/2 md:top-[20%] w-[60vw] md:w-[15vw] max-w-[300px] md:max-w-[150px]">
                            <img src="/german-awward.webp" alt="German Design Award" className="w-full h-auto object-contain" />
                        </div>
                    )}

                    {details.strapOptions.map((strap, i) => (
                        <div
                            key={strap.id}
                            ref={el => (strapRefs.current[i] = el)}
                            className="hero-details__strap absolute z-5"
                        >
                            <img src={strap.image} alt={strap.name} className="max-h-[75vh] max-w-none object-contain" />
                        </div>
                    ))}

                    <div className="absolute max-md:bottom-[10%] bottom-[5%] left-0 w-full z-15 flex items-end justify-center px-2.5 box-border pointer-events-none">
                        <div ref={strapDescRef} className="hero-details__desc-phase2 w-full text-center font-bold leading-none text-black tracking-[0.02em] uppercase pointer-events-auto max-md:whitespace-nowrap text-[6vw] md:text-[4vw]" style={{ fontFamily: "var(--font-heading)" }}>
                            {details.strapDescription}
                        </div>
                    </div>

                    <div className="absolute max-md:bottom-[15%] bottom-[5%] left-0 w-full z-15 flex items-end justify-center px-2.5 box-border pointer-events-none">
                        <div ref={varDescRef} className="hero-details__desc-phase3 w-full text-center font-bold leading-none text-black tracking-[0.02em] uppercase pointer-events-auto" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {details.variationDescription && details.variationDescription.split(' ').length >= 2 ? (
                                <>
                                    <span className="block md:inline-block">{details.variationDescription.split(' ').slice(0, -1).join(' ')}</span>
                                    <span className="hidden md:inline-block whitespace-pre"> </span>
                                    <span className="block md:inline-block">{details.variationDescription.split(' ').slice(-1).join(' ')}</span>
                                </>
                            ) : (
                                details.variationDescription
                            )}
                        </div>
                    </div>

                    <div
                        className="absolute top-[30%] left-0 w-full h-[75vh] z-20 flex items-center justify-center pointer-events-none"
                        style={{ transform: 'translateY(-50%)' }}
                    >
                        <div
                            ref={varWrapperRef}
                            className="w-full h-full pointer-events-auto"
                        >
                            {product.id === 2 ? (
                                <div
                                    ref={singleVariationRef}
                                    className="hero-details__variation absolute z-20 shrink-0"
                                >
                                    <img src={details.variations[0].image} alt={details.variations[0].name} className="max-h-[75vh] max-w-none object-contain" />
                                </div>
                            ) : (
                                loopVariations.map((v, i) => (
                                    <div
                                        key={`var-${i}`}
                                        ref={el => varRefs.current[i] = el}
                                        className="hero-details__variation relative z-5 shrink-0"
                                    >
                                        <img src={v.image} alt={v.name} className="max-h-[75vh] max-w-none object-contain" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section ref={videoSectionRef} className="hero-video-section relative z-10 w-full min-h-screen bg-white flex flex-col items-center justify-center gap-[6vh] py-[4vh] md:py-[10vh] cursor-auto">
                <h2 className="text-[8vw] md:text-[3.5vw] font-bold text-black uppercase tracking-[0.05em] mb-[4vh] text-center" style={{ fontFamily: 'var(--font-heading)' }}>WATCH THE VIDEO</h2>

                <div className="hero-video-container relative w-[90vw] md:w-[60vw] max-w-[1000px] aspect-video rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src={details.video}
                        loop
                        muted
                        playsInline
                    ></video>

                    <button className="hero-video-play-btn absolute bottom-5 right-5 bg-black/40 border-none text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-10" onClick={togglePlay}>
                        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-[4vw] mt-[8vh] md:mt-[3vh]">
                    <div className="flex flex-row items-center justify-center gap-[6vw] md:gap-[4vw]">
                        <img src="./FratelloBildmarke.avif" alt="Fratello" className="hero-video-logo h-[40px] md:h-[60px] object-contain opacity-50" />
                        <img src="./logo-ww-text-only-black.svg" alt="Ga" className="hero-video-logo h-[25px] md:h-10 object-contain opacity-50" />
                    </div>
                    <img src="./Teddy_Logo.avif" alt="Zeitmagazin" className="hero-video-logo h-[25px] md:h-10 object-contain opacity-50" />
                </div>
            </section>
        </>
    )
}

export default HeroDetails
