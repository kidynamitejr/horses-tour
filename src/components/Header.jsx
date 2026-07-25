import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {

    function handleScroll() {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)

  }, [])

  return (
    <header className={`header${isScrolled ? " header-scrolled" : ""}`}>
      <div className="logo-container">
        <img
          src={`${import.meta.env.BASE_URL}images/logo/horses-tour-logo.png`}
          alt="Horses Tour Logo"
          className="logo-image"
        />

        <span className="logo-text">
          Horses Tour
        </span>
      </div>

      <nav className="nav">
        <Link to="/">
          Home
        </Link>

        <Link to="/leaderboard">
          Leaderboard
        </Link>

        <Link to="/schedule">
          Schedule
        </Link>

        <Link to="/players">
          Players
        </Link>

        <Link to="/stats">
          Stats
        </Link>

        <Link to="/gallery">
          Gallery
        </Link>

        <Link to="/news">
          News
        </Link>

        <Link to="/past-matches">
          Past Matches
        </Link>

        <Link to="/rules">
          Rules
        </Link>
      </nav>
    </header>
  )
}

export default Header