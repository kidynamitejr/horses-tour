import { NavLink } from "react-router-dom"
import { useEffect, useState } from "react"

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Defaults to the OS/browser preference the first time a visitor
  // shows up, then remembers whatever they pick from here on.
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("horses-tour-theme")
      if (saved) return saved
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    } catch {
      return "light"
    }
  })

  useEffect(() => {

    function handleScroll() {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)

  }, [])

  useEffect(() => {

    document.documentElement.setAttribute("data-theme", theme)

    try {
      localStorage.setItem("horses-tour-theme", theme)
    } catch {
      // Private browsing etc. - theme just won't persist, that's fine.
    }

  }, [theme])

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
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/leaderboard">
          Leaderboard
        </NavLink>

        <NavLink to="/schedule">
          Schedule
        </NavLink>

        <NavLink to="/players">
          Players
        </NavLink>

        <NavLink to="/stats">
          Stats
        </NavLink>

        <NavLink to="/gallery">
          Gallery
        </NavLink>

        <NavLink to="/news">
          News
        </NavLink>

        <NavLink to="/past-matches">
          Past Matches
        </NavLink>

        <NavLink to="/course-history">
          Course History
        </NavLink>

        <NavLink to="/rules">
          Rules
        </NavLink>

        <NavLink to="/hall-of-champions">
          Hall of Champions
        </NavLink>
      </nav>

      <button
        type="button"
        className="theme-toggle"
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </header>
  )
}

export default Header