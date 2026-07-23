import { useEffect, useState } from "react"
import { getRankings } from "../data/googleSheets"

function Leaderboard() {

  const [players, setPlayers] = useState([])

  useEffect(() => {

    getRankings().then((data) => {

      setPlayers(data)

    })

  }, [])

  return (

    <section className="card">

      <h2>
        🏆 Overall Leaderboard
      </h2>

      <table className="leaderboard-table">

        <thead>

          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Total Points</th>
            <th>Average Points</th>
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

                {player.Rank === "1" && "🥇 "}
                {player.Rank === "2" && "🥈 "}
                {player.Rank === "3" && "🥉 "}

                {player.Rank}

              </td>

              <td>

                {player.Player}

              </td>

              <td>

                {player["Total Points"]}

              </td>

              <td>

                {player["Average Points"]}

              </td>

              <td>

                {player["Events Played"]}

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

    </section>

  )

}

export default Leaderboard