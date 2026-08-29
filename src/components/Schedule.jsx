import { useEffect, useState } from "react"
import { getSchedule, getMatchEntry } from "../data/googleSheets"


function Schedule() {

  const [events, setEvents] = useState([])
  const [winnersByEventId, setWinnersByEventId] = useState({})


  useEffect(() => {

    async function loadSchedule() {

      const [data, matchEntry] = await Promise.all([
        getSchedule(),
        getMatchEntry(),
      ])

      setEvents(data)

      // The Winner column is computed live from Match Entry (whichever
      // team has Placement 1) instead of the sheet's own Winner cell,
      // since that cell is easy to forget updating after an event.
      const winningTeams = {}

      matchEntry.forEach((row) => {

        if (!row.Player || Number(row.Placement) !== 1) return

        const eventId = row["Event ID"]

        if (!winningTeams[eventId]) winningTeams[eventId] = []

        winningTeams[eventId].push(row.Player.trim())

      })

      const winners = {}

      Object.entries(winningTeams).forEach(([eventId, players]) => {
        winners[eventId] = players.join(" / ")
      })

      setWinnersByEventId(winners)

    }

    loadSchedule()

  }, [])



  return (

    <section className="card">


      <h2>
        Tour Schedule
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


              <td className="schedule-event-name">
                {event["Event Name"]}
              </td>


              <td>
                {event.Date}
              </td>


              <td>
                {event.Course}
              </td>


              <td>
                {event.Status && (
                  <span
                    className={`status-badge ${
                      event.Status.trim().toLowerCase() === "played"
                        ? "status-played"
                        : "status-planned"
                    }`}
                  >
                    {event.Status.trim()}
                  </span>
                )}
              </td>


              <td>
                {(() => {

                  const winner = winnersByEventId[event["Event ID"]]

                  return (
                    <span className={`schedule-winner${winner ? "" : " schedule-winner-pending"}`}>
                      {winner || "TBD"}
                    </span>
                  )

                })()}
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