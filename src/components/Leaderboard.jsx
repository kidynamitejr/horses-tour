import { useEffect, useState } from "react"
import { getPlayers, getMatchEntry } from "../data/googleSheets"
import { getPlayerSummaries } from "../utils/matchEntry"

function Leaderboard() {

  const [players, setPlayers] = useState([])
  const [playerIds, setPlayerIds] = useState({})
  const [summaries, setSummaries] = useState({})

  useEffect(() => {

    getPlayers().then((data) => {

      const idsByName = {}

      data.forEach((player) => {
        idsByName[player.Name] = player["Player ID"]
      })

      setPlayerIds(idsByName)

    })

    getMatchEntry().then((data) => {

      setSummaries(getPlayerSummaries(data))

    })

  }, [])

  const sortedPlayers = Object.entries(summaries)
    .map(([name, s]) => ({ name, ...s }))
    .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))

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
            <th>Ranking Factor</th>
            <th>Power Points</th>
            <th>Events Played</th>
            <th>Wins</th>
            <th>Runner-Ups</th>
            <th>Top 3</th>
          </tr>

        </thead>

        <tbody>

          {sortedPlayers.map((player) => (

            <tr key={player.name}>

              <td>

                {player.rank ?? "-"}

              </td>

              <td>

                <div className="leaderboard-player">

                  <img
                    src={`${import.meta.env.BASE_URL}images/players/${playerIds[player.name]}.jpg`}
                    alt={player.name}
                    className="leaderboard-avatar"
                    onError={(e) => {
                      e.target.src = `${import.meta.env.BASE_URL}images/players/default.jpg`
                    }}
                  />

                  {player.name}

                </div>

              </td>

              <td>

                {player.avgRankingPoints}

              </td>

              <td>

                {player.totalPowerScore}

              </td>

              <td>

                {player.eventsPlayed}

              </td>

              <td>

                {player.wins}

              </td>

              <td>

                {player.runnerUps}

              </td>

              <td>

                {player.topThree}

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
