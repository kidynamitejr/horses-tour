import { useEffect, useState } from "react"
import { getRankings, getPlayers, getContributions } from "../data/googleSheets"

function Leaderboard() {

  const [players, setPlayers] = useState([])
  const [playerIds, setPlayerIds] = useState({})
  const [matchmakingPoints, setMatchmakingPoints] = useState({})
  const [eventsPlayed, setEventsPlayed] = useState({})

  useEffect(() => {

    getRankings().then((data) => {

      setPlayers(data)

    })

    getPlayers().then((data) => {

      const idsByName = {}

      data.forEach((player) => {
        idsByName[player.Name] = player["Player ID"]
      })

      setPlayerIds(idsByName)

    })

    getContributions().then((data) => {

      // Rows with no Contributions entered yet (a future/unplayed event
      // that's been dragged down) still compute to 0 via formulas, so
      // they're excluded here rather than counted as a game played.
      const played = data.filter((row) => row.Player && row.Contributions)

      const totals = {}
      const counts = {}

      played.forEach((row) => {

        const name = row.Player.trim()

        counts[name] = (counts[name] || 0) + 1

        const points = parseFloat(row["Match Points"])

        if (isNaN(points)) return

        if (!totals[name]) {
          totals[name] = { sum: 0, count: 0 }
        }

        totals[name].sum += points
        totals[name].count += 1

      })

      const averages = {}

      Object.entries(totals).forEach(([name, { sum, count }]) => {
        averages[name] = sum / count
      })

      setMatchmakingPoints(averages)
      setEventsPlayed(counts)

    })

  }, [])

  return (

    <section className="card">

      <h2>
        Overall Leaderboard
      </h2>

      <div className="table-scroll">

      <table className="leaderboard-table">

        <thead>

          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Power Points</th>
            <th>Matchmaking Points</th>
            <th>Events Played</th>
            <th>Wins</th>
            <th>Runner-Ups</th>
            <th>Top 3</th>
          </tr>

        </thead>

        <tbody>

          {players.map((player, index) => (

            <tr key={index}>

              <td>

                {player.Rank}

              </td>

              <td>

                <div className="leaderboard-player">

                  <img
                    src={`${import.meta.env.BASE_URL}images/players/${playerIds[player.Player]}.jpg`}
                    alt={player.Player}
                    className="leaderboard-avatar"
                    onError={(e) => {
                      e.target.src = `${import.meta.env.BASE_URL}images/players/default.jpg`
                    }}
                  />

                  {player.Player}

                </div>

              </td>

              <td>

                {player["Total Points"]}

              </td>

              <td>

                {matchmakingPoints[player.Player]
                  ? matchmakingPoints[player.Player].toFixed(2)
                  : "-"}

              </td>

              <td>

                {eventsPlayed[player.Player] || 0}

              </td>

              <td>

                {player.Wins}

              </td>

              <td>

                {player["Runner-Ups"]}

              </td>

              <td>

                {player["Top Three Finish"]}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      </div>

    </section>

  )

}

export default Leaderboard
