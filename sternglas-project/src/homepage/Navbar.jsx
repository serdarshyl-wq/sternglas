import React, { useState } from 'react'
import Logo from '../Logo'
import './Navbar.css'

function Navbar({ onConceptClick }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <nav className={`navbar absolute top-5 left-5 w-[calc(100%-40px)] z-50 flex justify-between items-center px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1rem,2vw,1.5rem)] ${isOpen ? 'open' : ''}`}>
                <div className={`navbar-links flex gap-6 z-60 ${isOpen ? 'hidden-links' : ''}`}>
                    <a href="#" onClick={onConceptClick} className="navbar-link text-[clamp(0.6rem,1.5vw,0.75rem)] font-medium text-black uppercase tracking-widest no-underline" style={{ fontFamily: 'var(--font-ui)' }}>Extras</a>
                    <a href="#" onClick={onConceptClick} className="navbar-link text-[clamp(0.6rem,1.5vw,0.75rem)] font-medium text-black uppercase tracking-widest no-underline" style={{ fontFamily: 'var(--font-ui)' }}>Service</a>
                    <a href="#" onClick={onConceptClick} className="navbar-link text-[clamp(0.6rem,1.5vw,0.75rem)] font-medium text-black uppercase tracking-widest no-underline" style={{ fontFamily: 'var(--font-ui)' }}>About Us</a>
                </div>
                <Logo className="absolute left-1/2 -translate-x-1/2 z-60" />
                <button
                    className={`hamburger bg-transparent border-none cursor-pointer flex flex-col justify-center gap-1.5 p-1 rounded z-60 relative w-8 h-8 ${isOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line block w-6 h-0.5 bg-black rounded-sm" />
                    <span className="hamburger-line block w-6 h-0.5 bg-black rounded-sm" />
                    <span className="hamburger-line block w-6 h-0.5 bg-black rounded-sm" />
                </button>
            </nav>

            <div className={`navbar-overlay fixed inset-0 w-screen h-screen bg-white z-40 flex flex-col items-center justify-center ${isOpen ? 'open' : ''}`}>
                <div className="overlay-content flex gap-[clamp(1.5rem,5vw,15vw)] mt-[5vh]">
                    <div className="overlay-column flex flex-col gap-[clamp(12px,3vw,30px)]">
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>All Watches</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Men</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Women</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Automatic</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Quartz</a>
                    </div>

                    <div className="overlay-column flex flex-col gap-[clamp(12px,3vw,30px)]">
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Mecha-Quartz</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Solar</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Clocks</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Watch Straps</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>New Releases</a>
                    </div>

                    <div className="overlay-column flex flex-col gap-[clamp(12px,3vw,30px)]">
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Bestseller</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Special Editions</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Last Chance</a>
                        <a href="#" onClick={onConceptClick} className="overlay-link text-[clamp(1.1rem,4vw,2.25rem)] text-black no-underline relative inline-block w-max opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Watch Archive</a>
                    </div>
                </div>

                {/* Bottom links - sadece mobilde görünür */}
                <div className="overlay-bottom-links">
                    <a href="#" onClick={onConceptClick} className="overlay-bottom-link font-medium text-black uppercase tracking-widest no-underline opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Extras</a>
                    <a href="#" onClick={onConceptClick} className="overlay-bottom-link font-medium text-black uppercase tracking-widest no-underline opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>Service</a>
                    <a href="#" onClick={onConceptClick} className="overlay-bottom-link font-medium text-black uppercase tracking-widest no-underline opacity-70" style={{ fontFamily: 'var(--font-ui)' }}>About Us</a>
                </div>
            </div>
        </>
    )
}

export default Navbar
