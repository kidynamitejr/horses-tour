import Dashboard from "../components/Dashboard"
import Leaderboard from "../components/Leaderboard"
import Schedule from "../components/Schedule"
import News from "../components/News"


function Home() {


  return (

    <>


      <section className="hero">

        <h1>
          Welcome to the Horses Tour
        </h1>


        <p>
          Competitive scramble golf. Track rankings, stats, and history.
        </p>


      </section>



      <Dashboard />


      <Leaderboard />


      <Schedule />


      <News />


    </>

  )

}


export default Home