const API_KEY = 'e25e680121e89083bb4ba7c0772c65fc';
const BASE_URL_TRENDING = 'https://api.themoviedb.org/3/trending/all/day';
const BASE_URL_SEARCH = 'https://api.themoviedb.org/3/search/movie';
const BASE_URL_MOVIEID = 'https://api.themoviedb.org/3/movie';
const POSTER_URL = 'https://themoviedb.org/t/p/w220_and_h330_face';

import movieCard from '../../templates/movieCard.hbs';
import refs from '../refs';

const api = {
  fetchPopular(page = '') {
    const url = `${BASE_URL_TRENDING}?api_key=${API_KEY}&page=${page}`;
    return fetch(url).then(rawData => rawData.json());
  },
};
export default class MoviePagination {
  #movies = [];
  constructor(selector) {
    this.element = document.querySelector(selector);
    this.#movies = [];
    this.currentPage = 1;
    this.totalPagas = 0;
    this.goToRerevPage = this.goToRerevPage.bind(this);
    this.goToNextPage = this.goToNextPage.bind(this);
  }

  get movies() {
    return this.#movies;
  }
  set movies(movieList) {
    if (!movieList) {
      console.error('Нет массивов фильмов');
    }
    this.#movies = movieList;
    this.renderMovieCards();
  }

  fetchPopularMoviesList() {
    return api.fetchPopular(this.currentPage).then(result => {
      const { results, total_results } = result;

      this.movies = results.map(movie => this.movieAdapter(movie));
      this.totalPagas = total_results;
    });
  }

  renderMovieCards() {
    this.element.innerHTML = movieCard(this.movies);
  }

  ///////////////
  movieAdapter({
    poster_path,
    original_title,
    original_name,
    vote_average,
    release_date,
    first_air_date,
  }) {
    return {
      //имена imgSrc,  title, rating, releaseDate СВЕРИТЬ с именами в ПРАВИЛЬНОМ шаблоне карточки
      imgSrc: this.generatePosterPath(poster_path),
      title: original_title || original_name,
      rating: vote_average,
      releaseDate: release_date || first_air_date,
    };
  }
  generatePosterPath(imageName) {
    return `${POSTER_URL}${imageName}`;
  }
  goToRerevPage() {
    if (this.currentPage === 1) {
      return;
    }
    this.currentPage -= 1;
    this.#movies = [];
    this.fetchPopularMoviesList();
  }
  goToNextPage() {
    if (this.currentPage === this.totalPagas) {
      return;
    }
    this.currentPage += 1;
    this.#movies = [];
    this.fetchPopularMoviesList();
  }
}
