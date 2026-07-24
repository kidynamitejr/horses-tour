function Hero({ title, subtitle }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>{title}</h1>

        <p>{subtitle}</p>
      </div>
    </section>
  )
}

export default Hero