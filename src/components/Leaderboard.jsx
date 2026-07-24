import { useEffect, useState } from "react"
import { getRankings, getPlayers } from "../data/googleSheets"

function Leaderboard() {

  const [players, setPlayers] = useState([])
  const [playerIds, setPlayerIds] = useState({})

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

      </div>

    </section>

  )

}

export default Leaderboard