function Schedule() {


  const events = [

    {
      name: "J.S. Clark Open",
      date: "May 10, 2026",
      course: "J.S. Clark Golf Course",
      status: "Completed",
      winner: "Team A",
      teeTime: "N/A"
    },


    {
      name: "Horses Tour Summer Classic",
      date: "July 18, 2026",
      course: "TBD",
      status: "Upcoming",
      winner: "N/A",
      teeTime: "N/A"
    },


    {
      name: "Horses Tour Championship",
      date: "October 4, 2026",
      course: "TBD",
      status: "Upcoming",
      winner: "N/A",
      teeTime: "N/A"
    }

  ]


  return (

    <section className="card">


      <h2>
        📅 Tour Schedule
      </h2>


      <table className="leaderboard-table">


        <thead>

          <tr>

            <th>
              Event
            </th>

            <th>
              Date
            </th>

            <th>
              Course
            </th>

            <th>
              Status
            </th>

            <th>
              Winner
            </th>

            <th>
              Tee Time
            </th>

          </tr>

        </thead>



        <tbody>


          {events.map((event, index) => (

            <tr key={index}>


              <td>
                {event.name}
              </td>


              <td>
                {event.date}
              </td>


              <td>
                {event.course}
              </td>


              <td>
                {event.status}
              </td>


              <td>
                {event.winner}
              </td>


              <td>
                {event.teeTime}
              </td>


            </tr>

          ))}


        </tbody>


      </table>


    </section>

  )

}


export default Schedule