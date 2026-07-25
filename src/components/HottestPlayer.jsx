import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getPlayers, getPlayerHistory } from "../data/googleSheets"

function HottestPlayer() {

  const [hottest, setHottest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadHottestPlayer() {

      try {

        const [players, history] = await Promise.all([
          getPlayers(),
          getPlayerHistory(),
        ])

        if (history.length === 0) {
          setHottest(null)
          return
        }

        const latestEventId = Math.max(
          ...history.map((row) => Number(row["Event ID"]))
        )

        const latestEventRows = history.filter(
          (row) => Number(row["Event ID"]) === latestEventId
        )

        const topRow = latestEventRows.reduce((best, row) =>
          parseFloat(row["Points Earned"]) > parseFloat(best["Points Earned"])
            ? row
            : best
        )

        const player = players.find(
          (p) =>
            p.Name.trim().toLowerCase() ===
            topRow.Player.trim().toLowerCase()
        )

        setHottest({
          player,
          eventName: topRow["Event Name"],
          pointsEarned: topRow["Points Earned"],
        })

      } catch (error) {

        console.error("Hottest Player Error:", error)

      } finally {

        setLoading(false)

      }

    }

    loadHottestPlayer()

  }, [])

  if (loading || !hottest || !hottest.player) {
    return null
  }

  const { player, eventName, pointsEarned } = hottest

  return (

    <section className="featured-player card">

      <h2>Hottest Player</h2>

      <div className="featured-player-content">

        <img
          src={`${import.meta.env.BASE_URL}images/players/${player["Player ID"]}.jpg`}
          alt={player.Name}
          className="featured-player-image"
          onError={(e) => {
            e.target.src = `${import.meta.env.BASE_URL}images/players/default.jpg`
          }}
        />

        <div>

          <h3>{player.Name}</h3>

          <p>
            Top Scorer at {eventName}
          </p>

          <p>
            Earned {pointsEarned} points in the last event to lead the field.
          </p>

          <Link
            to={`/player-profile/${player["Player ID"]}`}
            className="button"
          >
            View Profile
          </Link>

        </div>

      </div>

    </section>

  )

}

export default HottestPlayer
