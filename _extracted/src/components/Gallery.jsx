function Gallery() {


  const photos = [

    {
      image: "/images/gallery/photo1.jpg",
      title: "Tournament Start"
    },


    {
      image: "/images/gallery/photo2.jpg",
      title: "Championship Moment"
    },


    {
      image: "/images/gallery/photo3.jpg",
      title: "Team Photo"
    },


    {
      image: "/images/gallery/photo4.jpg",
      title: "Trophy Presentation"
    }


  ]


  return (

    <section className="card">


      <h2>
        📸 Gallery
      </h2>



      <div className="gallery-grid">


        {photos.map((photo) => (


          <div 
            className="gallery-card"
            key={photo.title}
          >


            <img
              src={photo.image}
              alt={photo.title}
            />


            <p>
              {photo.title}
            </p>


          </div>


        ))}


      </div>


    </section>

  )

}


export default Gallery