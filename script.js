const moviesContainer = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const input = document.querySelector('.input');
const btnTheme = document.querySelector('.btn-theme');

const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImage = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');

const highlightVideoLink = document.querySelector('.highlight__video-link');
const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');

let currentPage = 0;
let currentMovies = [];

const persistedTheme = localStorage.getItem('theme');

let currentTheme = persistedTheme ? persistedTheme : 'light';

function displayDarkTheme() {
  currentTheme = 'dark';
  btnTheme.src = './assets/dark-mode.svg';
  btnPrev.src = './assets/seta-esquerda-branca.svg';
  btnNext.src = './assets/seta-direita-branca.svg';

  body.style.setProperty('--background-color', "#242424");
  body.style.setProperty('--color', "#FFF");
  body.style.setProperty('--input-background-color', "#FFF");
  body.style.setProperty('--shadow-color', "0px 4px 8px rgba(255, 255, 255, 0.15)");
  body.style.setProperty('--highlight-background', "#454545");
  body.style.setProperty('--highlight-color', "rgba(255, 255, 255, 0.7)");
  body.style.setProperty('--highlight-description', "#FFF");
}

function displayLightTheme() {
  currentTheme = 'light';
  btnTheme.src = './assets/light-mode.svg';
  btnPrev.src = './assets/seta-esquerda-preta.svg';
  btnNext.src = './assets/seta-direita-preta.svg';
  
  body.style.setProperty('--background-color', "#FFF");
  body.style.setProperty('--color', "#000");
  body.style.setProperty('--input-background-color', "#979797");
  body.style.setProperty('--highlight-background', "#FFF");
  body.style.setProperty('--highlight-color', "rgba(0, 0, 0, 0.7)");
  body.style.setProperty('--highlight-description', "#000");
}

function toggleTheme() {
  if (currentTheme === 'light') {
    displayDarkTheme();
  } else {
    displayLightTheme();
  }

  localStorage.setItem('theme', currentTheme);
}

if (currentTheme === 'light') {
  displayLightTheme();
} else {
  displayDarkTheme();
}

btnTheme.addEventListener('click', function () {
  toggleTheme();
})

input.addEventListener('keydown', function (event) {
  if (event.key !== 'Enter') {
    return;
  }

  currentPage = 0;

  if (input.value) {
    loadSearchMovies(input.value);
  } else {
    loadMovies();
  }

  input.value = '';
})

btnPrev.addEventListener('click', function () {
  if (currentPage === 0) {
    currentPage = 3;
  } else {
    currentPage--;
  }
  displayMovies();
});

btnNext.addEventListener('click', function () {
  if (currentPage === 3) {
    currentPage = 0;
  } else {
    currentPage++;
  }
  displayMovies();
});

modal.addEventListener('click', closeModal);

modalClose.addEventListener('click', closeModal);

function closeModal() {
  modal.classList.add('hidden');
  body.style.overflow = 'auto';
}

function displayMovies() {
  moviesContainer.textContent = '';

  for (let i = currentPage * 5; i < (currentPage + 1) * 5; i++) {
    const movie = currentMovies[i];

    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie');
    movieContainer.style.backgroundImage = `url('${movie.poster_path}')`;

    movieContainer.addEventListener('click', function () {
      loadMovie(movie.id);
    })

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie__info');
    
    const movieTitle = document.createElement('span');
    movieTitle.classList.add('movie__title');
    movieTitle.textContent = movie.title;
    
    const movieRating = document.createElement('span');
    movieRating.classList.add('movie__rating');

    const star = document.createElement('img');
    star.src = "./assets/estrela.svg";
    star.alt = "Estrela";

    movieRating.append(star, movie.vote_average);
    movieInfo.append(movieTitle, movieRating);
    movieContainer.append(movieInfo);

    moviesContainer.append(movieContainer);
  }
}

function loadSearchMovies(search) {
  const responsePromise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${search}`);

  responsePromise.then(function (response) {
    const bodyPromise = response.json();

    bodyPromise.then(function (body) {
      currentMovies = body.results;
      displayMovies();
    })
  });
}

function loadMovies() {
  const responsePromise = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');

  responsePromise.then(function (response) {
    const bodyPromise = response.json();

    bodyPromise.then(function (body) {
      currentMovies = body.results;
      displayMovies();
    })
  });
}

function loadHighlightMovie() {
  const basePromise = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
  
  basePromise.then(function (response) {
    const bodyPromise = response.json();
    
    bodyPromise.then(function (body) {
      highlightVideo.style.background = `linear-gradient(rgba(0, 0, 0, 0.6) 100%, rgba(0, 0, 0, 0.6) 100%), url('${body.backdrop_path}') no-repeat center / cover`;
      highlightTitle.textContent = body.title;
      highlightRating.textContent = body.vote_average;
      highlightGenres.textContent = body.genres.map(function (genre) {
        return genre.name;
      }).join(', ');
      highlightLaunch.textContent = (new Date(body.release_date)).toLocaleDateString('pt-BR', { year: "numeric", month: "long", day: "numeric" });
      highlightDescription.textContent = body.overview;
    })
  });
  
  const linkPromise = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
  
  linkPromise.then(function (response) {
    const bodyPromise = response.json();
    
    bodyPromise.then(function (body) {
      highlightVideoLink.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
    })
  });
}

function loadMovie(id) {
  modal.classList.remove("hidden");
  body.style.overflow = 'hidden';

  const responsePromise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);

  responsePromise.then(function (response) {
    const bodyPromise = response.json();

    bodyPromise.then(function (body) {
      modalTitle.textContent = body.title;
      modalImage.src = body.backdrop_path;
      modalImage.alt = body.title;
      modalDescription.textContent = body.overview;
      modalAverage.textContent = body.vote_average;

      modalGenres.textContent = '';
      body.genres.forEach(function (genre) {
        const modalGenre = document.createElement('span');
        modalGenre.textContent = genre.name;
        modalGenre.classList.add('modal__genre');

        modalGenres.append(modalGenre);
      })
    })
  });
}

loadMovies();
loadHighlightMovie();