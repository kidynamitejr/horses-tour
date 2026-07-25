import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getPlayers, getSchedule, getContributions } from "../data/googleSheets"
import { getPlayedContributions } from "../utils/matchmakingPoints"

function HottestPlayer() {

  const [hottest, setHottest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadHottestPlayer() {

      try {

        const [players, schedule, contributions] = await Promise.all([
          getPlayers(),
          getSchedule(),
          getContributions(),
        ])

        // Only consider events that have actually been played - a
        // future event dragged down in the sheet still has rows, just
        // with blank Contributions, so it's excluded here.
        const played = getPlayedContributions(contributions)

        if (played.length === 0) {
          setHottest(null)
          return
        }

        const latestEventId = Math.max(
          ...played.map((row) => Number(row["Event ID"]))
        )

        const latestEventRows = played.filter(
          (row) => Number(row["Event ID"]) === latestEventId
        )

        const topRow = latestEventRows.reduce((best, row) =>
          parseFloat(row["Match Points"]) > parseFloat(best["Match Points"])
            ? row
            : best
        )

        const player = players.find(
          (p) =>
            p.Name.trim().toLowerCase() ===
            topRow.Player.trim().toLowerCase()
        )

        const event = schedule.find(
          (e) => e["Event ID"] === String(latestEventId)
        )

        setHottest({
          player,
          eventName: event ? event["Event Name"] : `Event ${latestEventId}`,
          pointsEarned: parseFloat(topRow["Match Points"]).toFixed(2),
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
