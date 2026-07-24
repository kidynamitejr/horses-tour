import Dashboard from "../components/Dashboard"
import Leaderboard from "../components/Leaderboard"
import Schedule from "../components/Schedule"
import News from "../components/News"
import { Link } from "react-router-dom"

function Home() {
  return (
    <>
      <section className="hero">
        <h1>Welcome to the Horses Tour</h1>

        <p>
          Competitive scramble golf. Track rankings, stats, and history.
        </p>
      </section>

      <Dashboard />

      <Leaderboard />

      <Schedule />

      <News />

      <section className="featured-player card">

        <h2>Featured Player</h2>

        <div className="featured-player-content">

          <img
            src={`${import.meta.env.BASE_URL}images/players/1.jpg`}
            alt="Featured Player"
            className="featured-player-image"
          />

          <div>

            <h3>Cole Browning</h3>

            <p>
              Current Points Leader
            </p>

            <p>
              Follow Cole throughout the season as he competes for the Horses Tour Championship.
            </p>

            <Link
              to="/player-profile/1"
              className="button"
            >
              View Profile
            </Link>

          </div>

        </div>

      </section>

    </>
  )
}

export default Home