import { useEffect, useState } from "react"
import { getSchedule } from "../data/googleSheets"


function Schedule() {

  const [events, setEvents] = useState([])


  useEffect(() => {

    async function loadSchedule() {

      const data = await getSchedule()

      setEvents(data)

    }

    loadSchedule()

  }, [])



  return (

    <section className="card">


      <h2>
        📅 Tour Schedule
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
            <th>Tee Times</th>

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


              <td>
                {event["Tee Times"]}
              </td>


            </tr>

          ))}


        </tbody>


      </table>

      </div>


    </section>

  )

}


export default Schedule