function Hero({ title, subtitle }) {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0,59,92,.75), rgba(0,59,92,.75)), url(${import.meta.env.BASE_URL}images/backgrounds/golf-hero.jpg)`,
  }

  return (
    <section className="hero-section" style={heroStyle}>
      <div className="hero-content">
        <h1>{title}</h1>

        <p>{subtitle}</p>
      </div>
    </section>
  )
}

export default Hero