import { useEffect, useState } from "react"
import { getSchedule, getMatchEntry } from "../data/googleSheets"
import { slugify } from "../utils/slugify"

const COURSE_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"]

function CourseImage({ course }) {

  const [extIndex, setExtIndex] = useState(0)

  if (extIndex >= COURSE_IMAGE_EXTENSIONS.length) {
    return null
  }

  const src = `${import.meta.env.BASE_URL}images/courses/${slugify(course)}.${COURSE_IMAGE_EXTENSIONS[extIndex]}`

  return (
    <img
      src={src}
      alt=""
      className="match-card-bg-img"
      onError={() => setExtIndex((i) => i + 1)}
    />
  )

}

function PastMatches() {

  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {

    async function loadMatches() {

      try {

        const [schedule, matchEntry] = await Promise.all([
          getSchedule(),
          getMatchEntry(),
        ])

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const pastEvents = schedule.filter((event) => {
          const eventDate = new Date(event.Date)
          if (isNaN(eventDate)) return false
          eventDate.setHours(0, 0, 0, 0)
          return eventDate < today
        })

        const grouped = pastEvents
          .map((event) => {

            const eventId = event["Event ID"]

            const rowsForEvent = matchEntry.filter(
              (row) =>
                row["Event ID"] === eventId &&
                row["Team Score"] &&
                row.Placement &&
                !isNaN(Number(row.Placement))
            )

            const teamsByLetter = rowsForEvent.reduce((teams, row) => {

              if (!teams[row.Team]) {
                teams[row.Team] = {
                  team: row.Team,
                  finish: row.Placement,
                  score: row["Team Score"],
                  players: [],
                }
              }

              teams[row.Team].players.push(row.Player)

              return teams

            }, {})

            const teams = Object.values(teamsByLetter).sort(
              (a, b) => Number(a.finish) - Number(b.finish)
            )

            return {
              eventId,
              eventName: event["Event Name"],
              date: event.Date,
              course: event.Course,
              teams,
            }

          })
          .sort((a, b) => new Date(b.date) - new Date(a.date))

        setMatches(grouped)

      } catch (error) {

        console.error("Past Matches Error:", error)

      } finally {

        setLoading(false)

      }

    }

    loadMatches()

  }, [])

  if (loading) {
    return (
      <section className="card">
        <h2>Past Matches</h2>
        <p>Loading past matches...</p>
      </section>
    )
  }

  return (

    <section className="card">

      <h2>
        Past Matches
      </h2>

      {matches.length === 0 && (
        <p>No past matches yet.</p>
      )}

      <div className="match-grid">

        {matches.map((match) => {

          const isExpanded = expandedId === match.eventId

          return (

            <div
              className={`match-card${isExpanded ? " match-card-expanded" : ""}`}
              key={match.eventId}
              onClick={() =>
                setExpandedId(isExpanded ? null : match.eventId)
              }
            >

              <CourseImage course={match.course} />

              <div className="match-card-front">
                <h3>{match.eventName}</h3>
                <p>{match.date}</p>
              </div>

              <div className="match-card-hover">

                <h3>{match.eventName}</h3>
                <p>{match.date}</p>

                {match.teams.length > 0 ? (

                  <ul className="match-results-list">

                    {match.teams.map((team) => (
                      <li key={team.team}>
                        <strong>{team.finish}.</strong> {team.players.join(" / ")}
                        <span className="match-score"> — Score: {team.score}</span>
                      </li>
                    ))}

                  </ul>

                ) : (

                  <p>Results coming soon.</p>

                )}

              </div>

            </div>

          )

        })}

      </div>

    </section>

  )

}


export default PastMatches
