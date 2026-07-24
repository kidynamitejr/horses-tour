function PastMatches() {


  const matches = [

    {
      event: "J.S. Clark Open",
      date: "May 10, 2026",
      winner: "Team A",
      first: "Cole Browning / Player Two",
      second: "Player Three / Player Four",
      third: "Player Five / Player Six"
    },


    {
      event: "Horses Tour Summer Classic",
      date: "July 18, 2026",
      winner: "TBD",
      first: "TBD",
      second: "TBD",
      third: "TBD"
    }

  ]


  return (

    <section className="card">


      <h2>
        Past Matches
      </h2>


      {matches.map((match) => (


        <div 
          className="match-card"
          key={match.event}
        >


          <h3>
            {match.event}
          </h3>


          <p>
            Date: {match.date}
          </p>


          <p>
            Winner: {match.winner}
          </p>


          <hr />


          <p>
            1st: {match.first}
          </p>


          <p>
            2nd: {match.second}
          </p>


          <p>
            3rd: {match.third}
          </p>


        </div>


      ))}


    </section>

  )

}


export default PastMatches