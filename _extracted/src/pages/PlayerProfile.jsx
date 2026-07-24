import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import {
  getPlayers,
  getPlayerStats
} from "../data/googleSheets"

function PlayerProfile() {
  const { name } = useParams()

  const [player, setPlayer] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPlayer() {
      try {
        const players = await getPlayers()
        const playerStats = await getPlayerStats()

        const foundPlayer = players.find(
          (p) =>
            String(p["Player ID"]).trim() ===
            String(name).trim()
        )

        setPlayer(foundPlayer || null)

        if (foundPlayer) {
          const foundStats = playerStats.find(
            (s) =>
              String(s["Player ID"]).trim() ===
              String(foundPlayer["Player ID"]).trim()
          )

          setStats(foundStats || null)
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
            <h3>Total Points</h3>
            <p>{stats?.["Total Points"] || "0"}</p>
          </div>

          <div className="stat-card">
            <h3>Average Points</h3>
            <p>
              {stats?.["Average Points"] === "#DIV/0!"
                ? "-"
                : stats?.["Average Points"] || "-"}
            </p>
          </div>

          <div className="stat-card">
            <h3>Events Played</h3>
            <p>{stats?.["Events Played"] || "0"}</p>
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
    </>
  )
}

export default PlayerProfile