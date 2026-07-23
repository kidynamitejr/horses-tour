function News() {


  const articles = [

    {
      title: "Horses Tour Announces 2026 Season",
      date: "July 2026",
      image: "/images/news/news1.jpg",
      description:
        "The Horses Tour prepares for another exciting season of competitive scramble golf."
    },


    {
      title: "New Records Expected This Season",
      date: "July 2026",
      image: "/images/news/news2.jpg",
      description:
        "Players are preparing to chase records and compete for the championship."
    }


  ]


  return (

    <section className="card">


      <h2>
        📰 Latest News
      </h2>



      <div className="news-grid">


        {articles.map((article) => (


          <div 
            className="news-card" 
            key={article.title}
          >


            <img
              src={article.image}
              alt={article.title}
            />


            <h3>
              {article.title}
            </h3>


            <small>
              {article.date}
            </small>


            <p>
              {article.description}
            </p>


          </div>


        ))}


      </div>


    </section>

  )

}


export default News