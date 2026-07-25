import { useEffect, useState } from "react"
import { getGallery } from "../data/googleSheets"

function Gallery() {

  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadGallery() {

      try {

        const data = await getGallery()

        setPhotos(data)

      } catch (error) {

        console.error("Gallery Error:", error)

      } finally {

        setLoading(false)

      }

    }

    loadGallery()

  }, [])

  return (

    <section className="card">


      <h2>
        Gallery
      </h2>


      {loading && (
        <p>Loading gallery...</p>
      )}


      <div className="gallery-grid">


        {!loading && photos.map((photo) => (


          <div
            className="gallery-card"
            key={photo["Photo ID"]}
          >


            <img
              src={photo.Image}
              alt={photo.Caption}
            />


            <p>
              {photo.Caption}
            </p>


          </div>


        ))}


      </div>


    </section>

  )

}


export default Gallery
