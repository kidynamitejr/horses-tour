import { useEffect, useState } from "react"
import { getEvents } from "../data/googleSheets"


function Events() {

  const [events, setEvents] = useState([])


  useEffect(() => {

    async function loadEvents() {

      const data = await getEvents()

      setEvents(data)

    }

    loadEvents()

  }, [])



  return (

    <section className="card">

      <h2>
        Tour Events
      </h2>


      <div className="table-scroll">

      <table className="leaderboard-table">

        <thead>

          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Course</th>
            <th>Status</th>
            <th>Winner</th>
          </tr>

        </thead>


        <tbody>

          {events.map((event, index) => (

            <tr key={index}>

              <td>
                {event["Event Name"]}
              </td>

              <td>
                {event.Date}
              </td>

              <td>
                {event.Course}
              </td>

              <td>
                {event.Status}
              </td>

              <td>
                {event.Winner}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      </div>

    </section>

  )

}


export default Events