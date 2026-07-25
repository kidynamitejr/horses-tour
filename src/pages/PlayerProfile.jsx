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
import {
  getMatchmakingPointsByPlayer,
  getEventsPlayedByPlayer,
  getPlayedContributions,
} from "../utils/matchmakingPoints"

function PlayerProfile() {
  const { name } = useParams()

  const [player, setPlayer] = useState(null)
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [matchmakingPoints, setMatchmakingPoints] = useState(null)
  const [eventsPlayed, setEventsPlayed] = useState(0)
  const [roundStats, setRoundStats] = useState({
    highest: null,
    lowest: null,
    best: null,
    worst: null,
  })
  const [currentRank, setCurrentRank] = useState(null)
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

          // Rank is pulled from Contributions' own rank lookup (rather
          // than the Player Stats sheet's Rank column) so it always
          // matches whatever that sheet is currently computing - it's
          // populated even for a future event's row.
          const rankRow = contributions.find(
            (c) =>
              c.Player &&
              c.Player.trim().toLowerCase() ===
                foundPlayer.Name.trim().toLowerCase() &&
              c["Player's current rank"]
          )

          setCurrentRank(rankRow ? Number(rankRow["Player's current rank"]) : null)

          const playedContributions = getPlayedContributions(contributions).filter(
            (c) =>
              c.Player.trim().toLowerCase() ===
              foundPlayer.Name.trim().toLowerCase()
          )

          const playedEventIds = new Set(
            playedContributions.map((c) => c["Event ID"])
          )

          // Only include events this player actually played - Player
          // History gets a dragged-down row (Points Earned 0.0) for
          // future events too, which would otherwise show up as a fake
          // data point on the chart.
          const foundHistory = playerHistory
            .filter(
              (h) =>
                h.Player.trim().toLowerCase() ===
                  foundPlayer.Name.trim().toLowerCase() &&
                playedEventIds.has(h["Event ID"])
            )
            .sort((a, b) => Number(a["Event ID"]) - Number(b["Event ID"]))

          setHistory(foundHistory)

          const eventsPlayedByPlayer = getEventsPlayedByPlayer(contributions)
          const matchmakingPointsByPlayer = getMatchmakingPointsByPlayer(contributions)

          setEventsPlayed(eventsPlayedByPlayer[foundPlayer.Name] || 0)

          setMatchmakingPoints(
            matchmakingPointsByPlayer[foundPlayer.Name] !== undefined
              ? matchmakingPointsByPlayer[foundPlayer.Name]
              : null
          )

          // Best/Worst Tournament and Highest/Lowest Round are computed
          // from Contributions (played rows only) instead of the Player
          // Stats sheet's own columns, since a future event's phantom
          // 0.0 row would otherwise always win the "worst" comparison.
          const eventNameById = {}

          playerHistory.forEach((h) => {
            eventNameById[h["Event ID"]] = h["Event Name"]
          })

          const roundsWithPoints = playedContributions
            .map((c) => ({
              eventId: c["Event ID"],
              points: parseFloat(c["Match Points"]),
            }))
            .filter((r) => !isNaN(r.points))

          if (roundsWithPoints.length > 0) {
            const best = roundsWithPoints.reduce((a, b) =>
              b.points > a.points ? b : a
            )

            const worst = roundsWithPoints.reduce((a, b) =>
              b.points < a.points ? b : a
            )

            setRoundStats({
              highest: best.points,
              lowest: worst.points,
              best: eventNameById[best.eventId] || null,
              worst: eventNameById[worst.eventId] || null,
            })
          } else {
            setRoundStats({ highest: null, lowest: null, best: null, worst: null })
          }
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
            <p>{currentRank ?? stats?.Rank ?? "-"}</p>
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
            <p>{roundStats.highest !== null ? roundStats.highest.toFixed(2) : "-"}</p>
          </div>

          <div className="stat-card">
            <h3>Lowest Round</h3>
            <p>{roundStats.lowest !== null ? roundStats.lowest.toFixed(2) : "-"}</p>
          </div>

          <div className="stat-card">
            <h3>Best Tournament</h3>
            <p>{roundStats.best || "-"}</p>
          </div>

          <div className="stat-card">
            <h3>Worst Tournament</h3>
            <p>{roundStats.worst || "-"}</p>
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