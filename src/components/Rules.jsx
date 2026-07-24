import { useEffect, useState } from "react"
import { getRules } from "../data/googleSheets"

function Rules() {

  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadRules() {

      try {

        const data = await getRules()

        const sorted = data.sort(
          (a, b) => Number(a["Rule #"]) - Number(b["Rule #"])
        )

        setRules(sorted)

      } catch (error) {

        console.error("Rules Error:", error)

      } finally {

        setLoading(false)

      }

    }

    loadRules()

  }, [])

  const categories = []

  rules.forEach((rule) => {
    if (!categories.includes(rule.Category)) {
      categories.push(rule.Category)
    }
  })

  return (

    <section className="card">

      <h2>
        Rules & Rewards
      </h2>


      <h3>
        Tour Rules
      </h3>

      {loading && (
        <p>Loading rules...</p>
      )}

      {!loading && categories.map((category) => (

        <div key={category} className="rules-category">

          <h4>
            {category}
          </h4>

          <ul className="rules-list">

            {rules
              .filter((rule) => rule.Category === category)
              .map((rule) => (
                <li key={rule["Rule #"]} className="rules-list-item">
                  <span className="rule-number">
                    {rule["Rule #"]}.
                  </span>

                  <span>
                    {rule.Rule}
                  </span>
                </li>
              ))}

          </ul>

        </div>

      ))}


      <h3>
        Rewards & Records
      </h3>


      <p>
        Season awards, records, and achievements will be displayed here.
      </p>


    </section>

  )

}


export default Rules