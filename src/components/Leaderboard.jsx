import { useEffect, useState } from "react"
import { getRankings, getPlayers, getContributions } from "../data/googleSheets"
import { getMatchmakingPointsByPlayer, getEventsPlayedByPlayer } from "../utils/matchmakingPoints"

function Leaderboard() {

  const [players, setPlayers] = useState([])
  const [playerIds, setPlayerIds] = useState({})
  const [matchmakingPoints, setMatchmakingPoints] = useState({})
  const [eventsPlayed, setEventsPlayed] = useState({})
  const [currentRanks, setCurrentRanks] = useState({})

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

      setMatchmakingPoints(getMatchmakingPointsByPlayer(data))
      setEventsPlayed(getEventsPlayedByPlayer(data))

      // Rank is pulled from Contributions' own rank lookup (rather than
      // the Rankings sheet's Rank column directly) so the leaderboard
      // always matches whatever that sheet is currently computing.
      const ranks = {}

      data.forEach((row) => {

        if (!row.Player || !row["Player's current rank"]) return

        const name = row.Player.trim()

        if (!ranks[name]) {
          ranks[name] = Number(row["Player's current rank"])
        }

      })

      setCurrentRanks(ranks)

    })

  }, [])

  const sortedPlayers = [...players].sort((a, b) => {

    const rankA = currentRanks[a.Player] ?? Number(a.Rank)
    const rankB = currentRanks[b.Player] ?? Number(b.Rank)

    return rankA - rankB

  })

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

          {sortedPlayers.map((player, index) => (

            <tr key={index}>

              <td>

                {currentRanks[player.Player] ?? player.Rank}

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
