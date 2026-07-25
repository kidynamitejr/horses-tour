import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getNews } from "../data/googleSheets"

function Article() {
  const { id } = useParams()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadArticle() {
      const data = await getNews()

      const found = data.find(
        (a) => String(a["Article ID"]) === String(id)
      )

      setArticle(found)
      setLoading(false)
    }

    loadArticle()
  }, [id])

  if (loading) {
    return (
      <section className="card">
        <h2>Loading...</h2>
      </section>
    )
  }

  if (!article) {
    return (
      <section className="card">
        <h2>Article not found.</h2>

        <Link to="/news">
          ← Back to News
        </Link>
      </section>
    )
  }

  return (
    <section className="card">
      <Link
        className="button"
        to="/news"
      >
        ← Back to News
      </Link>

      <br />
      <br />

      <img
        src={article.Image}
        alt={article.Headline}
        style={{
          width: "100%",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      />

      <small>{article.Date}</small>

      <h1>{article.Headline}</h1>

      <p
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.8",
        }}
      >
        {article.Article}
      </p>
    </section>
  )
}

export default Article