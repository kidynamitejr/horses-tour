import { useEffect, useState } from "react"
import { getTourRecords, getPlayerStats, getMatchResults } from "../data/googleSheets"
import { getTeamRecordCounts } from "../utils/teamRecords"

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
