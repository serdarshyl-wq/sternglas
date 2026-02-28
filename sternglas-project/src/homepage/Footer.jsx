import React, { useState } from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faPinterestP, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Logo from '../Logo';

function Footer({ onConceptClick }) {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (sectionIndex) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionIndex]: !prev[sectionIndex]
        }));
    };

    return (
        <footer className="footer-section relative w-full md:min-h-screen bg-white flex flex-col justify-center items-center py-[2vh] md:py-[10vh] px-[5vw] box-border text-black z-10">
            <div className="flex flex-col w-full max-w-[1400px] gap-[4vh] md:gap-[8vh]">
                <div className="footer-top-logo w-full flex justify-center pt-[2vh]">
                    <div className="logo-wrapper relative inline-block">
                        <Logo />
                        <div className="logo-overlay absolute inset-0 z-10 cursor-default"></div>
                    </div>
                </div>

                <div className="footer-columns">

                    <div className="footer-column">
                        <h3
                            className="footer-heading"
                            onClick={() => window.innerWidth < 768 && toggleSection(1)}
                        >
                            <span>Popular searches</span>
                            <span className="footer-chevron">
                                <FontAwesomeIcon icon={faChevronDown} className={`footer-chevron-icon ${openSections[1] ? 'rotate' : ''}`} />
                            </span>
                        </h3>
                        <div className={`footer-accordion-content ${openSections[1] ? 'is-open' : ''}`}>
                            <ul className="footer-list">
                                <li><a href="#" onClick={onConceptClick} className="footer-link">All Watches</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Men's Watches</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Women's Watches</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Automatic Watches</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Quartz Watches</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Wall Clocks</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Watch Straps</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3
                            className="footer-heading"
                            onClick={() => window.innerWidth < 768 && toggleSection(2)}
                        >
                            <span>About STERNGLAS</span>
                            <span className="footer-chevron">
                                <FontAwesomeIcon icon={faChevronDown} className={`footer-chevron-icon ${openSections[2] ? 'rotate' : ''}`} />
                            </span>
                        </h3>
                        <div className={`footer-accordion-content ${openSections[2] ? 'is-open' : ''}`}>
                            <ul className="footer-list">
                                <li><a href="#" onClick={onConceptClick} className="footer-link">The Sternglas Story</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">The Team</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Press</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Magazine</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Watch Archive</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Newsletter</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3
                            className="footer-heading"
                            onClick={() => window.innerWidth < 768 && toggleSection(3)}
                        >
                            <span>Services</span>
                            <span className="footer-chevron">
                                <FontAwesomeIcon icon={faChevronDown} className={`footer-chevron-icon ${openSections[3] ? 'rotate' : ''}`} />
                            </span>
                        </h3>
                        <div className={`footer-accordion-content ${openSections[3] ? 'is-open' : ''}`}>
                            <ul className="footer-list">
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Contact</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">FAQ</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Repairs</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Retailer locator</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Retail inquiries</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Return Policy</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Shipping & Payment</a></li>
                                <li><a href="#" onClick={onConceptClick} className="footer-link">Accessibility</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-socials">
                        <a href="#" onClick={onConceptClick} className="social-icon instagram flex items-center justify-center w-10 h-10 text-[1.8rem] text-black no-underline rounded-full" aria-label="Instagram">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="#" onClick={onConceptClick} className="social-icon facebook flex items-center justify-center w-10 h-10 text-[1.8rem] text-black no-underline rounded-full" aria-label="Facebook">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="#" onClick={onConceptClick} className="social-icon pinterest flex items-center justify-center w-10 h-10 text-[1.8rem] text-black no-underline rounded-full" aria-label="Pinterest">
                            <FontAwesomeIcon icon={faPinterestP} />
                        </a>
                        <a href="#" onClick={onConceptClick} className="social-icon youtube flex items-center justify-center w-10 h-10 text-[1.8rem] text-black no-underline rounded-full" aria-label="YouTube">
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
