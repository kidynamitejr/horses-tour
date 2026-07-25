import { useEffect, useState } from "react"
import { getTourRecords, getPlayerStats, getMatchResults } from "../data/googleSheets"

function getLeadersFromEntries(entries) {

  const valid = entries.filter((e) => !isNaN(e.value))

  if (valid.length === 0) {
    return { value: null, names: [] }
  }

  const max = Math.max(...valid.map((e) => e.value))

  if (max === 0) {
    return { value: 0, names: [] }
  }

  const names = valid
    .filter((e) => e.value === max)
    .map((e) => e.name)

  return { value: max, names }

}

function getLeaders(players, field) {
  return getLeadersFromEntries(
    players.map((p) => ({ name: p.Player, value: parseFloat(p[field]) }))
  )
}

// Wins/Runner Ups/Top 3 are computed from Match Results (not the
// Player Stats columns) so both teammates on a team automatically get
// credit for their team's finish, instead of relying on a manually
// tracked column that can miss a player.
function getTeamRecordCounts(matchResults) {

  const counts = {}

  matchResults.forEach((row) => {

    const finish = Number(row.Finish)

    if (!finish) return

    const teammates = [row["Player 1"], row["Player 2"]]
      .map((name) => name && name.trim())
      .filter(Boolean)

    teammates.forEach((name) => {

      if (!counts[name]) {
        counts[name] = { wins: 0, runnerUps: 0, topThree: 0 }
      }

      if (finish === 1) counts[name].wins += 1
      if (finish === 2) counts[name].runnerUps += 1
      if (finish <= 3) counts[name].topThree += 1

    })

  })

  return counts

}

function formatScore(value) {
  if (value === null) return "-"
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

function Stats() {

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadRecords() {

      try {

        const [tourRecords, playerStats, matchResults] = await Promise.all([
          getTourRecords(),
          getPlayerStats(),
          getMatchResults(),
        ])

        const lowestTeamScore = tourRecords.find(
          (r) => r.Record === "Lowest Team Score"
        )

        const highestSingleEvent = getLeaders(playerStats, "Highest Round Points")
        const totalPoints = getLeaders(playerStats, "Total Points")
        const averagePoints = getLeaders(playerStats, "Average Points")

        const teamCounts = getTeamRecordCounts(matchResults)
        const countEntries = Object.entries(teamCounts)

        const wins = getLeadersFromEntries(
          countEntries.map(([name, c]) => ({ name, value: c.wins }))
        )

        const runnerUps = getLeadersFromEntries(
          countEntries.map(([name, c]) => ({ name, value: c.runnerUps }))
        )

        const topThree = getLeadersFromEntries(
          countEntries.map(([name, c]) => ({ name, value: c.topThree }))
        )

        const combined = []

        if (lowestTeamScore) {
          combined.push(lowestTeamScore)
        }

        combined.push(
          {
            Record: "Highest Single Event Points",
            Score: formatScore(highestSingleEvent.value),
            Team: highestSingleEvent.names.join(", "),
          },
          {
            Record: "Most Total Points",
            Score: formatScore(totalPoints.value),
            Team: totalPoints.names.join(", "),
          },
          {
            Record: "Highest Average Points",
            Score: formatScore(averagePoints.value),
            Team: averagePoints.names.join(", "),
          },
          {
            Record: "Most Wins",
            Score: formatScore(wins.value),
            Team: wins.names.join(", "),
          },
          {
            Record: "Most Runner Ups",
            Score: formatScore(runnerUps.value),
            Team: runnerUps.names.join(", "),
          },
          {
            Record: "Most Top 3 Finishes",
            Score: formatScore(topThree.value),
            Team: topThree.names.join(", "),
          }
        )

        setRecords(combined)

      } catch (error) {

        console.error("Stats Error:", error)

      } finally {

        setLoading(false)

      }

    }

    loadRecords()

  }, [])

  return (

    <section className="card">


      <h2>
        Tour Statistics
      </h2>


      {loading && (
        <p>Loading stats...</p>
      )}


      <div className="stats-grid">


        {!loading && records.map((record) => (


          <div
            className="stat-card"
            key={record.Record}
          >


            <h3>
              {record.Record}
            </h3>

            <p className="stat-value">
              {record.Score}
            </p>

            <p className="stat-team">
              {record.Team}
            </p>


          </div>


        ))}


      </div>


    </section>

  )

}


export default Stats
