import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getPlayers } from "../data/googleSheets"

function Players() {

  const [players, setPlayers] = useState([])

  useEffect(() => {

    getPlayers().then(data => {

      setPlayers(data)

    })

  }, [])

  return (

    <section className="card">

      <h2>
        Players
      </h2>

      <div className="player-grid">

        {players.map((player) => (

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
                Wins: {player.Wins}
              </p>

              <p>
                Runner Ups: {player["Runner Ups"]}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </section>

  )

}

export default Players