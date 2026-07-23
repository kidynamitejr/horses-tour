import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getPlayers } from "../data/googleSheets"


function PlayerProfile() {


  const { name } = useParams()

  const [player, setPlayer] = useState(null)



  useEffect(()=>{


    getPlayers()
      .then(data=>{


        const foundPlayer = data.find(

          p => p["Player ID"] === name

        )


        setPlayer(foundPlayer)


      })


  },[name])



  if(!player){

    return (

      <div className="card">

        <h2>
          Loading Player...
        </h2>

      </div>

    )

  }



  return (

    <section>


      <div className="player-profile-header">


        {player.Headshot && (

          <img

            src={player.Headshot}

            alt={player.Name}

            className="profile-image"

          />

        )}



        <div>


          <h1>
            {player.Name}
          </h1>


          <p>
            Joined: {player["Join Date"]}
          </p>


          <p>
            Status: {player.Active}
          </p>


        </div>


      </div>




      <div className="stats-grid">


        <div className="stat-card">

          <h3>
            Wins
          </h3>

          <p>
            {player.Wins}
          </p>

        </div>



        <div className="stat-card">

          <h3>
            Runner Ups
          </h3>

          <p>
            {player["Runner Ups"]}
          </p>

        </div>



        <div className="stat-card">

          <h3>
            Player ID
          </h3>

          <p>
            {player["Player ID"]}
          </p>

        </div>


      </div>


    </section>

  )

}


export default PlayerProfile