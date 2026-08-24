import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getMatchEntry } from "../data/googleSheets"
import { getPlayerSummaries } from "../utils/matchEntry"

function toChartData(summaries, field) {
  return Object.entries(summaries)
    .filter(([name]) => !/\(sub\)/i.test(name))
    .map(([name, s]) => ({ name, value: s[field] }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value)
}

function TourLeaderCharts() {

  const [winsData, setWinsData] = useState([])
  const [runnerUpsData, setRunnerUpsData] = useState([])
  const [topThreeData, setTopThreeData] = useState([])

  useEffect(() => {

    // Wins/Runner Ups/Top 3 come from Match Entry (like the rest of the
    // site) instead of the old Match Results tab, which stopped being
    // updated after the first two events.
    getMatchEntry().then((data) => {

      const summaries = getPlayerSummaries(data)

      setWinsData(toChartData(summaries, "wins"))
      setRunnerUpsData(toChartData(summaries, "runnerUps"))
      setTopThreeData(toChartData(summaries, "topThree"))

    })

  }, [])

  return (

    <section className="card">

      <h2>
        Tour Leaders
      </h2>

      <div className="leaderboard-charts">

        <div className="leaderboard-chart-card">

          <h3>Wins</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={winsData} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={70}
                tick={{ fontSize: 11 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Wins" fill="#c9a227" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="leaderboard-chart-card">

          <h3>Runner Ups</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={runnerUpsData} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={70}
                tick={{ fontSize: 11 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Runner Ups" fill="#003b5c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="leaderboard-chart-card">

          <h3>Top 3 Finishes</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topThreeData} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={70}
                tick={{ fontSize: 11 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Top 3 Finishes" fill="#2d6a4f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </section>

  )

}

export default TourLeaderCharts
