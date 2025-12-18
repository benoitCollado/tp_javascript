const search_button = document.getElementById("button_search");
const title_input = document.getElementById("title_input");
const film_card_container = document.getElementById("film_card_container");
const pagination_container = document.getElementById("pagination");
const nb_film_per_page = 10;
let current_page_web = 1;
let number_of_page = 0;

url = "https://www.omdbapi.com/?";
apikey = "apikey=d041e424";

let title_to_search = "";

search_button.addEventListener("click", async (event)=>{
    event.preventDefault();
    film_card_container.innerHTML = "";
    pagination_container.innerHTML="";
    title_to_search = title_input.value;
    current_page_web = 1;
    film = await get_movie_list(current_page_web);

    if(film && film.Search){
        number_of_page = calculate_number_of_page(film.totalResults);
        await append_movies_cards(film_card_container, film);
    }
    else{
        film_card_container.innerHTML="<p> Aucun film Trouvé </p>";
    }

});

function createMovieCard(container, movie) {

    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title}">
        <div class="movie-content">
            <h3>${movie.Title}</h3>
            <h4>(${movie.Year})</h4>
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

async function get_movie_list(page){
    url_complet = url + "s="+title_to_search+"&"+apikey+"&page="+page+"&type=movie";
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

function make_pagination(number_of_page, current_page){
    const previous = document.createElement("button");
    const next = document.createElement("button");
    const numbers = document.createElement("div");
    if(current_page > 1 && current_page < number_of_page){
        previous.classList.add("previous-page");
        previous.classList.add("enabled");
        previous.innerHTML = "<";
        next.classList.add("next-page");
        next.classList.add("enabled");
        next.innerHTML = ">";
        numbers.innerHTML = `<span class='button-page' value="${current_page-1}">${current_page-1}</span>
        <span class='button-page disabled current-page' value="${current_page}">${current_page}</span>
        <span class='button-page' value="${current_page+1}">${current_page+1}</span>`;
    }
    else if (current_page === 1 && number_of_page > 2){
        previous.classList.add("previous-page");
        previous.classList.add("disabled");
        previous.disabled = true;
        previous.innerHTML = "<";
        next.classList.add("next-page");
        next.classList.add("enabled");
        next.innerHTML = ">";
        numbers.innerHTML = `<span class='button-page disabled current-page' value="${current_page}">${current_page}</span>
        <span class='button-page' value="${current_page+1}">${current_page+1}</span>`;
    }
    else if(current_page === number_of_page && number_of_page > 2){
        previous.classList.add("previous-page");
        previous.classList.add("enabled");
        previous.innerHTML = "<";
        next.classList.add("next-page");
        next.classList.add("disabled");
        next.disabled = true
        previous.innerHTML = ">";
        numbers.innerHTML = `<span class='button-page' value="${current_page-1}">${current_page-1}</span>
        <span class='button-page current-page' value="${current_page}">${current_page}</span>`;
    }else{
        previous.classList.add("previous-page");
        previous.classList.add("disabled");
        previous.innerHTML = "<";
        previous.disabled = true;
        next.classList.add("next-page");
        next.classList.add("disabled");
        next.innerHTML = ">";
        next.disabled = true
        numbers.innerHTML = `<span class='button-page disabled current-page' value="${current_page}">${current_page}</span>`;

    }
    pagination_container.appendChild(previous);
    pagination_container.appendChild(numbers);
    pagination_container.appendChild(next);

    previous.addEventListener("click", async (event)=>{
            event.preventDefault();
            film_card_container.innerHTML = "";
            pagination_container.innerHTML="";
            current_page_web--;
            film = await get_movie_list(current_page_web);
            if(film && film.Search){
                await append_movies_cards(film_card_container, film);
            }else{
                film_card_container.innerHTML="<p> Aucun film Trouvé </p>";
            }


    });
        next.addEventListener("click", async (event)=>{
            event.preventDefault();
            film_card_container.innerHTML = "";
            pagination_container.innerHTML="";
            current_page_web++;
            film = await get_movie_list(current_page_web);
            if(film && film.Search){
                await append_movies_cards(film_card_container, film);
            }else{
                film_card_container.innerHTML="<p> Aucun film Trouvé </p>";
            }


    });


}

function calculate_number_of_page(totalResults){
    return Math.ceil(totalResults/nb_film_per_page);
}

async function append_movies_cards(container, film){

        film.Search.forEach(async element => {
            movie_data = await get_movie_description(element);
            element.Description = movie_data.Plot
            console.log(element);
            createMovieCard(container, element);
         });
         
         make_pagination(number_of_page,current_page_web);
}





