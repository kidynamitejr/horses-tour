import { useEffect, useState } from "react"

import {
  getPlayers,
  getRankings,
  getSchedule,
  getEvents,
  getContributions,
} from "../data/googleSheets"

function Dashboard() {
  const [players, setPlayers] = useState([])
  const [rankings, setRankings] = useState([])
  const [schedule, setSchedule] = useState([])
  const [events, setEvents] = useState([])
  const [contributions, setContributions] = useState([])

  useEffect(() => {
    getPlayers().then(setPlayers)
    getRankings().then(setRankings)
    getSchedule().then(setSchedule)
    getEvents().then(setEvents)
    getContributions().then(setContributions)
  }, [])

  const leader = rankings.length > 0 ? rankings[0] : null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nextEvent = schedule
    .filter((event) => {
      if (!event.Date) return false

      if (
        !event.Status ||
        event.Status.toLowerCase() !== "planned"
      ) {
        return false
      }

      const eventDate = new Date(event.Date)

      if (isNaN(eventDate)) return false

      eventDate.setHours(0, 0, 0, 0)

      return eventDate >= today
    })
    .sort((a, b) => new Date(a.Date) - new Date(b.Date))[0]

  const nextEventTeams = nextEvent
    ? Object.entries(
        contributions
          .filter((row) => row["Event ID"] === nextEvent["Event ID"])
          .reduce((teams, row) => {
            if (!row.Team || !row.Player) return teams

            if (!teams[row.Team]) teams[row.Team] = []

            teams[row.Team].push(row.Player)

            return teams
          }, {})
      ).sort(([a], [b]) => a.localeCompare(b))
    : []

  return (
    <section className="dashboard-grid">

      <div className="dashboard-card leader">

        <h2>Points Leader</h2>

        {leader ? (
          <>
            <h3>{leader.Player}</h3>
            <p>{leader["Total Points"]} Points</p>
          </>
        ) : (
          <>
            <h3>Loading...</h3>
            <p>Please wait...</p>
          </>
        )}

      </div>

      <div className="dashboard-card event">

        <h2>Next Event</h2>

        {nextEvent ? (
          <>
            <h3>{nextEvent["Event Name"]}</h3>
            <p>{nextEvent.Date}</p>
            <p>{nextEvent.Course}</p>

            {nextEventTeams.length > 0 && (
              <ul className="dashboard-team-list">

                {nextEventTeams.map(([team, teamPlayers]) => (
                  <li key={team}>
                    <strong>Team {team}:</strong> {teamPlayers.join(" / ")}
                  </li>
                ))}

              </ul>
            )}
          </>
        ) : (
          <>
            <h3>No Upcoming Event</h3>
            <p>Schedule Coming Soon</p>
          </>
        )}

      </div>

      <div className="dashboard-card players">

        <h2>Players</h2>

        <h3>{players.length}</h3>

        <p>Registered Players</p>

      </div>

      <div className="dashboard-card events">

        <h2>Events</h2>

        <h3>{events.length}</h3>

        <p>Season Events</p>

      </div>

    </section>
  )
}

export default Dashboard