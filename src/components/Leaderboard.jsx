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

  // Rank is computed here from Ranking Factor (AVG Ranking Points)
  // rather than trusting the sheet's own Current Rank column, which is
  // a separate lookup against the old Rankings tab and can drift out
  // of sync with what Match Entry actually calculates.
  const sortedPlayers = Object.entries(summaries)
    .map(([name, s]) => ({ name, ...s }))
    .sort((a, b) => b.avgRankingPoints - a.avgRankingPoints)

  let rankCounter = 0

  const rankedPlayers = sortedPlayers.map((player) => {

    if (player.eventsPlayed > 0) {
      rankCounter += 1
      return { ...player, computedRank: rankCounter }
    }

    return { ...player, computedRank: null }

  })

  const powerRankedPlayers = Object.entries(summaries)
    .map(([name, s]) => ({ name, ...s }))
    .sort((a, b) => b.totalPowerScore - a.totalPowerScore)
    .reduce((acc, player) => {

      if (player.eventsPlayed > 0) {
        acc.rankCounter += 1
        acc.players.push({ ...player, computedRank: acc.rankCounter })
      } else {
        acc.players.push({ ...player, computedRank: null })
      }

      return acc

    }, { rankCounter: 0, players: [] }).players

  return (

    <>

    <section className="card">

      <h2>
        Horsewide Leaderboard
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

          {rankedPlayers.map((player) => (

            <tr key={player.name}>

              <td>

                {player.computedRank ?? "-"}

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

    <section className="card power-points-card">

      <h2>
        Power Points Leaderboard
      </h2>

      <div className="table-scroll">

      <table className="leaderboard-table power-points-table">

        <thead>

          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Power Points</th>
          </tr>

        </thead>

        <tbody>

          {powerRankedPlayers.map((player) => (

            <tr key={player.name}>

              <td>

                {player.computedRank ?? "-"}

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

                {player.totalPowerScore}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      </div>

    </section>

    </>

  )

}

export default Leaderboard
