function Rules() {

  const rules = [

    "All teams must follow official Horses Tour scramble rules.",

    "Each player must track and report their contributions toward the team's score.",

    "Teams must accurately record scores after every event.",

    "Club length forgiveness rules will be determined before each season.",

    "Tournament results are final once verified by tour officials."

  ]


  return (

    <section className="card">

      <h2>
        📜 Rules & Rewards
      </h2>


      <h3>
        Tour Rules
      </h3>


      <ul>

        {rules.map((rule, index) => (

          <li key={index}>
            {rule}
          </li>

        ))}

      </ul>


      <h3>
        🏆 Rewards & Records
      </h3>


      <p>
        Season awards, records, and achievements will be displayed here.
      </p>


    </section>

  )

}


export default Rules