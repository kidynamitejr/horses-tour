import { Link } from "react-router-dom"

function Header() {
  return (
    <header className="header">
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