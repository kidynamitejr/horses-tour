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
  getPlayerHistory,
  getContributions,
  getMatchEntry,
} from "../data/googleSheets"
import { getPlayedContributions } from "../utils/matchmakingPoints"
import { getPlayerSummaries } from "../utils/matchEntry"

function PlayerProfile() {
  const { name } = useParams()

  const [player, setPlayer] = useState(null)
  const [summary, setSummary] = useState(null)
  const [pointsHistory, setPointsHistory] = useState([])
  const [roundStats, setRoundStats] = useState({
    highest: null,
    lowest: null,
    best: null,
    worst: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPlayer() {
      try {
        const players = await getPlayers()
        const playerHistory = await getPlayerHistory()
        const contributions = await getContributions()
        const matchEntry = await getMatchEntry()

        const foundPlayer = players.find(
          (p) =>
            String(p["Player ID"]).trim() ===
            String(name).trim()
        )

        setPlayer(foundPlayer || null)

        if (foundPlayer) {

          const summaries = getPlayerSummaries(matchEntry)

          setSummary(summaries[foundPlayer.Name] || null)

          const playedContributions = getPlayedContributions(contributions).filter(
            (c) =>
              c.Player.trim().toLowerCase() ===
              foundPlayer.Name.trim().toLowerCase()
          )

          const playedEventIds = new Set(
            playedContributions.map((c) => c["Event ID"])
          )

          // Best/Worst Tournament and Highest/Lowest Round are computed
          // from Contributions (played rows only) instead of the Player
          // Stats sheet's own columns, since a future event's phantom
          // 0.0 row would otherwise always win the "worst" comparison.
          const eventNameById = {}
          const eventDateById = {}

          playerHistory.forEach((h) => {
            eventNameById[h["Event ID"]] = h["Event Name"]
            eventDateById[h["Event ID"]] = h.Date
          })

          // Points scored per match, taken from Match Entry (Match
          // Ranking Points) rather than Player History's running
          // average - only actually played events are included.
          const playedMatchEntryRows = matchEntry
            .filter(
              (row) =>
                row.Player &&
                row.Player.trim().toLowerCase() ===
                  foundPlayer.Name.trim().toLowerCase() &&
                playedEventIds.has(row["Event ID"])
            )
            .sort((a, b) => Number(a["Event ID"]) - Number(b["Event ID"]))

          setPointsHistory(
            playedMatchEntryRows.map((row) => ({
              tournament: `${eventNameById[row["Event ID"]] || `Event ${row["Event ID"]}`} (${eventDateById[row["Event ID"]] || ""})`,
              points: parseFloat(row["Match Ranking Points"]) || 0,
            }))
          )

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
            <p>{summary?.rank ?? "-"}</p>
          </div>

          <div className="stat-card">
            <h3>Power Points</h3>
            <p>{summary?.totalPowerScore ?? "0"}</p>
          </div>

          <div className="stat-card">
            <h3>Ranking Factor</h3>
            <p>{summary?.avgRankingPoints ?? "-"}</p>
          </div>

          <div className="stat-card">
            <h3>Events Played</h3>
            <p>{summary?.eventsPlayed ?? 0}</p>
          </div>

          <div className="stat-card">
            <h3>Wins</h3>
            <p>{summary?.wins ?? 0}</p>
          </div>

          <div className="stat-card">
            <h3>Runner Ups</h3>
            <p>{summary?.runnerUps ?? 0}</p>
          </div>

          <div className="stat-card">
            <h3>Top 3 Finishes</h3>
            <p>{summary?.topThree ?? 0}</p>
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

      {pointsHistory.length > 0 && (
        <section className="card">
          <h2>Points Scored Over Time</h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={pointsHistory}
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
                dataKey="points"
                name="Points Scored"
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