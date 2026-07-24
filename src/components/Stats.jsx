function Stats() {


  const stats = [

    {
      title: "Lowest Scramble Score",
      value: "TBD"
    },

    {
      title: "Longest Top 3 Streak",
      value: "TBD"
    },

    {
      title: "Highest Single Round Points",
      value: "TBD"
    },

    {
      title: "Biggest Mover",
      value: "TBD"
    },

    {
      title: "Most Wins",
      value: "TBD"
    },

    {
      title: "Most Events Played",
      value: "TBD"
    }

  ]


  return (

    <section className="card">


      <h2>
        Tour Statistics
      </h2>



      <div className="stats-grid">


        {stats.map((stat) => (


          <div 
            className="stat-card" 
            key={stat.title}
          >


            <h3>
              {stat.title}
            </h3>


            <p>
              {stat.value}
            </p>


          </div>


        ))}


      </div>


    </section>

  )

}


export default Stats