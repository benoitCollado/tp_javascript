const search_button = document.getElementById("button_search");
const title_input = document.getElementById("title_input");
const film_card_container = document.getElementById("film_card_container");

url = "https://www.omdbapi.com/?";
apikey = "apikey=d041e424";

let title_to_search = "";

search_button.addEventListener("click", async (event)=>{
    event.preventDefault();
    film_card_container.innerHTML = "";
    film = await get_movie_list();
    console.log(film);

    if(film && film.Search){
        film.Search.forEach(async element => {
            movie_data = await get_movie_description(element);
            element.Description = movie_data.Plot
            console.log(element);
            createMovieCard(film_card_container, element);
         });
    }
    else{
        film_card_container.innerHTML="<p> Aucun filme Trouvé </p>";
    }

});

title_input.addEventListener("input",(event)=>{
   title_to_search =  event.target.value;
});

function createMovieCard(container, movie) {

    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title}">
        <div class="movie-content">
            <h3>${movie.Title} (${movie.Year})</h3>
            <p class="movie-description">${movie.Description}</p>
            <button class="btn-more">Voir plus</button>
        </div>
    `;

    const btn = card.querySelector(".btn-more");
    btn.addEventListener("click", () => {
        card.classList.toggle("expanded");

        if (card.classList.contains("expanded")) {
            btn.textContent = "Voir moins";
        } else {
            btn.textContent = "Voir plus";
        }
    });

    container.appendChild(card);
}

async function get_movie_list(){
    url_complet = url + "s="+title_to_search+"&"+apikey;
    result = await fetch(url_complet);
    data = await result.json();
    return data;
}

async function get_movie_description(movie){
    url_complet = url + "i="+movie.imdbID+"&"+apikey;
    result = await fetch(url_complet);
    data = await result.json();
    return data;
}



