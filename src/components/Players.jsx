import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getPlayers, getMatchEntry } from "../data/googleSheets"
import { getPlayerSummaries } from "../utils/matchEntry"

function Players() {

  const [players, setPlayers] = useState([])
  const [summaries, setSummaries] = useState({})

  useEffect(() => {

    getPlayers().then(data => {

      setPlayers(data)

    })

    getMatchEntry().then((data) => {

      setSummaries(getPlayerSummaries(data))

    })

  }, [])

  return (

    <section className="card">

      <h2>
        Players
      </h2>

      <div className="player-grid">

        {players.map((player) => {

          const summary = summaries[player.Name.trim()]

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
                  Wins: {summary ? summary.wins : "0"}
                </p>

                <p>
                  Runner Ups: {summary ? summary.runnerUps : "0"}
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