import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import {
  getPlayers,
  getPlayerStats,
  getPlayerHistory,
  getContributions
} from "../data/googleSheets"

function PlayerProfile() {
  const { name } = useParams()

  const [player, setPlayer] = useState(null)
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [matchmakingPoints, setMatchmakingPoints] = useState(null)
  const [eventsPlayed, setEventsPlayed] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPlayer() {
      try {
        const players = await getPlayers()
        const playerStats = await getPlayerStats()
        const playerHistory = await getPlayerHistory()
        const contributions = await getContributions()

        const foundPlayer = players.find(
          (p) =>
            String(p["Player ID"]).trim() ===
            String(name).trim()
        )

        setPlayer(foundPlayer || null)

        if (foundPlayer) {
          const foundStats = playerStats.find(
            (s) =>
              s.Player.trim().toLowerCase() ===
              foundPlayer.Name.trim().toLowerCase()
          )

          setStats(foundStats || null)

          const foundHistory = playerHistory
            .filter(
              (h) =>
                h.Player.trim().toLowerCase() ===
                foundPlayer.Name.trim().toLowerCase()
            )
            .sort((a, b) => Number(a["Event ID"]) - Number(b["Event ID"]))

          setHistory(foundHistory)

          // Rows with no Contributions entered yet (a future/unplayed
          // event that's been dragged down) still compute to 0 via
          // formulas, so they're excluded rather than counted as played.
          const playedRows = contributions.filter(
            (c) =>
              c.Player.trim().toLowerCase() ===
                foundPlayer.Name.trim().toLowerCase() &&
              c.Contributions
          )

          setEventsPlayed(playedRows.length)

          const matchPoints = playedRows
            .map((c) => parseFloat(c["Match Points"]))
            .filter((points) => !isNaN(points))

          setMatchmakingPoints(
            matchPoints.length > 0
              ? matchPoints.reduce((a, b) => a + b, 0) / matchPoints.length
              : null
          )
        }
      } catch (error) {
        console.error("Player Profile Error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPlayer()
  }, [name])

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (!player) {
    return <h2>Player not found.</h2>
  }

  return (
    <>
      <section className="player-profile-header">
        <img
          src={`${import.meta.env.BASE_URL}images/players/${player["Player ID"]}.jpg`}
          alt={player.Name}
          className="profile-image"
          onError={(e) => {
            e.target.src = `${import.meta.env.BASE_URL}images/players/default.jpg`
          }}
        />

        <div>
          <h1>{player.Name}</h1>

          <p>Joined: {player["Join Date"]}</p>

          <p>Status: {player.Active}</p>
        </div>
      </section>

      <section className="card">
        <h2>Career Statistics</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Rank</h3>
            <p>{stats?.Rank || "-"}</p>
          </div>

          <div className="stat-card">
            <h3>Power Points</h3>
            <p>{stats?.["Total Points"] || "0"}</p>
          </div>

          <div className="stat-card">
            <h3>Matchmaking Points</h3>
            <p>
              {matchmakingPoints !== null
                ? matchmakingPoints.toFixed(2)
                : "-"}
            </p>
          </div>

          <div className="stat-card">
            <h3>Events Played</h3>
            <p>{eventsPlayed}</p>
          </div>

          <div className="stat-card">
            <h3>Wins</h3>
            <p>{stats?.Wins || "0"}</p>
          </div>

          <div className="stat-card">
            <h3>Runner Ups</h3>
            <p>{stats?.["Runner Ups"] || "0"}</p>
          </div>

          <div className="stat-card">
            <h3>Top 3 Finishes</h3>
            <p>{stats?.["Top 3 Finishes"] || "0"}</p>
          </div>

          <div className="stat-card">
            <h3>Highest Round</h3>
            <p>{stats?.["Highest Round Points"] || "-"}</p>
          </div>

          <div className="stat-card">
            <h3>Lowest Round</h3>
            <p>{stats?.["Lowest Round Points"] || "-"}</p>
          </div>

          <div className="stat-card">
            <h3>Best Tournament</h3>
            <p>{stats?.["Best Tournament"] || "-"}</p>
          </div>

          <div className="stat-card">
            <h3>Worst Tournament</h3>
            <p>{stats?.["Worst Tournament"] || "-"}</p>
          </div>
        </div>
      </section>

      {history.length > 0 && (
        <section className="card">
          <h2>Average Points Over Time</h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={history.map((h) => ({
                tournament: `${h["Event Name"]} (${h.Date})`,
                averagePoints: parseFloat(h["Average Points"]) || 0,
              }))}
              margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="tournament"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={70}
                tick={{ fontSize: 12 }}
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="averagePoints"
                name="Average Points"
                stroke="#003b5c"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}
    </>
  )
}

export default PlayerProfile