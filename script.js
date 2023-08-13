async function getMovies(){
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMGU4NmI3NWQyNTJiNzk0MmRmNDcxNGFhMTE3OWNiNSIsInN1YiI6IjY0ZDQyN2U1YjZjMjY0MTE1Njk5ZTU5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Yj2tHXGRMXGrOw-6ZR1CzkSuJAawOnXgeFrW1awCtW8'
    }
  };
  
  try{

    return fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
    .then(response => response.json())

  } catch(error) {
    console.log(error)
  }
  
}

//informações extras
//https://api.themoviedb.org/3/movie/{movie_id}
  async function getMoreInfo(id){
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMGU4NmI3NWQyNTJiNzk0MmRmNDcxNGFhMTE3OWNiNSIsInN1YiI6IjY0ZDQyN2U1YjZjMjY0MTE1Njk5ZTU5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Yj2tHXGRMXGrOw-6ZR1CzkSuJAawOnXgeFrW1awCtW8'
      }
    };
    
    try{
      return fetch('https://api.themoviedb.org/3/movie/' + id, options)
      .then(response => response.json())

    }catch(error){
      console.log(error)
    }

    
  }

//assistir trailer
//https://api.themoviedb.org/3/movie/{movie_id}/videos
  async function watch(e){
    const movie_id = e.currentTarget.dataset.id

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMGU4NmI3NWQyNTJiNzk0MmRmNDcxNGFhMTE3OWNiNSIsInN1YiI6IjY0ZDQyN2U1YjZjMjY0MTE1Njk5ZTU5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Yj2tHXGRMXGrOw-6ZR1CzkSuJAawOnXgeFrW1awCtW8'
      }
    };
    
    try {
      const data = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos`, options)
      .then(response => response.json())

      const {results} = data

      const youtubeVideo = results.find(video => video.type === "Trailer")

      window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, 'blank')

    } catch (error) {
      console.log(error)
    }

    
     
}


  function createMovieLayout({
    id,
    title,
    stars,
    image,
    time,
    year
  }){
    
    return `
    <div class="movie">
            <div class="title">
              <span>${title}</span>
              <div>
                <img src="/assets/icons/Star.svg" alt="" />
                <p>${stars}</p>
              </div>
            </div>

            <div class="poster">
              <img src="https://image.tmdb.org/t/p/w500${image}" alt="Imagem de ${title}" />
            </div>

            <div class="info">
              <div class="duration">
                <img src="assets/icons/Clock.svg" alt="" />

                <span>${time}</span>
              </div>

              <div class="year">
                <img src="/assets/icons/CalendarBlank.svg" alt="" />

                <span>${year}</span>
              </div>
            </div>

            <button onclick="watch(event)" data-id="${id}"/>
              <img src="/assets/icons/Play.svg" alt="Botão de play" />

              <span>Assistir ao trailer</span>
            </button>
          </div>
    `
  }

  function select3Videos(results) {
    const random = ()=> Math.floor(Math.random() * results.length)

    let selectedVideos = new Set()
    while(selectedVideos.size < 3){
      selectedVideos.add(results[random()].id)
    }

    return [...selectedVideos]
  }

  function minutesToHourMinutesAndSeconds(minutes){
    const date = new Date(null)
    date.setMinutes(minutes)
    return date.toISOString().slice(11, 19)
  }

  async function start(){
    //pegar sugestões da API
    const {results} = await getMovies()

    //pegar randomiamente 3 filmes para sugestão
    const best3 = select3Videos(results).map(async movie => {
      //pegar informações extras dos 3 filmes
      const info = await getMoreInfo(movie)
      //organizar os dados
      const props = {
        id: info.id,
        title: info.title,
        stars: Number(info.vote_average).toFixed(1),
        image: info.poster_path,
        time: minutesToHourMinutesAndSeconds(info.runtime),
        year: info.release_date.slice(0, 4)
      }

      return createMovieLayout(props)
    })
    
    const output = await Promise.all(best3)
   
    //substituir o o conteúdo dos movies do html
    document.querySelector('.movies').innerHTML = output.join("")
  }

  start()
