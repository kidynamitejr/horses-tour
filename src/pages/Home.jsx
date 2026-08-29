import Dashboard from "../components/Dashboard"
import NextEventFeature from "../components/NextEventFeature"
import LastMatchFeature from "../components/LastMatchFeature"
import News from "../components/News"
import HottestPlayer from "../components/HottestPlayer"

function Home() {
  return (
    <>
      <section className="hero">
        <h1>Welcome to the Horses Tour</h1>

        <p>
          Competitive scramble golf. Track rankings, stats, and history.
        </p>
      </section>

      <NextEventFeature />

      <Dashboard />

      <LastMatchFeature />

      <News />

      <HottestPlayer />

    </>
  )
}

export default Home