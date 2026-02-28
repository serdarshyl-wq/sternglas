import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { heroProducts } from '../data/product'
import './LoadingScreen.css'

const pairs = [
    [heroProducts[0], heroProducts[1]],
    [heroProducts[2], heroProducts[3]]
]

function LoadingScreen() {
    const leftImgRef = useRef(null)
    const rightImgRef = useRef(null)
    const textRef = useRef(null)
    const pairIndexRef = useRef(0)

    useLayoutEffect(() => {
        const leftImg = leftImgRef.current
        const rightImg = rightImgRef.current
        const text = textRef.current

        // Başlangıç pozisyonları: ürünler merkeze yakın
        gsap.set(leftImg, { x: '-8vw' })
        gsap.set(rightImg, { x: '8vw' })
        gsap.set(text, { opacity: 0, clipPath: 'inset(0 50% 0 50%)' })

        const tl = gsap.timeline({ repeat: -1 })

        // Phase 1: Uzaklaşma + "LOADING..." belirme
        tl.to(leftImg, {
            x: '-25vw', duration: 0.8, ease: 'power2.inOut'
        }, 0)
        tl.to(rightImg, {
            x: '25vw', duration: 0.8, ease: 'power2.inOut'
        }, 0)
        tl.to(text, {
            opacity: 1,
            clipPath: 'inset(0 0% 0 0%)',
            duration: 0.8,
            ease: 'power2.inOut'
        }, 0)

        tl.to({}, { duration: 0.5 })

        tl.to(leftImg, {
            x: '-8vw', duration: 0.8, ease: 'power2.inOut'
        }, '+=0')
        tl.to(rightImg, {
            x: '8vw', duration: 0.8, ease: 'power2.inOut'
        }, '<')
        tl.to(text, {
            opacity: 0,
            clipPath: 'inset(0 50% 0 50%)',
            duration: 0.8,
            ease: 'power2.inOut'
        }, '<')

        tl.to([leftImg, rightImg], {
            opacity: 0, duration: 0.3, ease: 'power2.in',
            onComplete: () => {
                pairIndexRef.current = (pairIndexRef.current + 1) % pairs.length
                const nextPair = pairs[pairIndexRef.current]
                const leftEl = leftImg.querySelector('img')
                const rightEl = rightImg.querySelector('img')
                if (leftEl) leftEl.src = nextPair[0].image
                if (rightEl) rightEl.src = nextPair[1].image
            }
        })
        tl.to([leftImg, rightImg], {
            opacity: 1, duration: 0.3, ease: 'power2.out'
        })

        return () => tl.kill()
    }, [])

    const currentPair = pairs[0]

    return (
        <div className="loading-screen">
            <div className="loading-products">
                <div ref={leftImgRef} className="loading-img-wrapper">
                    <img src={currentPair[0].image} alt={currentPair[0].title} />
                </div>

                <span
                    ref={textRef}
                    className="loading-text"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    LOADING...
                </span>

                <div ref={rightImgRef} className="loading-img-wrapper">
                    <img src={currentPair[1].image} alt={currentPair[1].title} />
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen
