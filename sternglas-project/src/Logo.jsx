import './Logo.css'

function Logo({ className = '' }) {
    return (
        <a href="/" className={`logo flex flex-col items-center gap-1 no-underline ${className}`}>
            <span className="logo-title text-[clamp(0.85rem,2.5vw,1.2rem)] font-light tracking-[0.3em] whitespace-nowrap" style={{ fontFamily: 'var(--font-logo)' }}>S T E R N G L A S</span>
            <span className="logo-subtitle text-[clamp(0.4rem,1vw,0.55rem)] font-light tracking-[0.35em] whitespace-nowrap" style={{ fontFamily: 'var(--font-logo)' }}>Z E I T M E S S E R</span>
        </a>
    )
}

export default Logo
