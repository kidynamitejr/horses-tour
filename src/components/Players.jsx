import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getPlayers, getPlayerStats } from "../data/googleSheets"

function Players() {

  const [players, setPlayers] = useState([])
  const [statsByName, setStatsByName] = useState({})

  useEffect(() => {

    getPlayers().then(data => {

      setPlayers(data)

    })

    getPlayerStats().then((data) => {

      const map = {}

      data.forEach((stat) => {
        map[stat.Player.trim().toLowerCase()] = stat
      })

      setStatsByName(map)

    })

  }, [])

  return (

    <section className="card">

      <h2>
        Players
      </h2>

      <div className="player-grid">

        {players.map((player) => {

          const stats = statsByName[player.Name.trim().toLowerCase()]

          return (

            <Link
              key={player["Player ID"]}
              to={`/player-profile/${player["Player ID"]}`}
              className="player-link"
            >

              <div className="player-card">

                <img
                  src={`${import.meta.env.BASE_URL}images/players/${player["Player ID"]}.jpg`}
                  alt={player.Name}
                  className="player-headshot"
                  onError={(e) => {
                    e.target.src = `${import.meta.env.BASE_URL}images/players/default.jpg`
                  }}
                />

                <h3>
                  {player.Name}
                </h3>

                <p>
                  Wins: {stats ? stats.Wins : "0"}
                </p>

                <p>
                  Runner Ups: {stats ? stats["Runner Ups"] : "0"}
                </p>

              </div>

            </Link>

          )

        })}

      </div>

    </section>

  )

}

export default Players