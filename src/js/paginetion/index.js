const API_KEY = 'e25e680121e89083bb4ba7c0772c65fc';
const BASE_URL_TRENDING = 'https://api.themoviedb.org/3/trending/all/day';
const BASE_URL_SEARCH = 'https://api.themoviedb.org/3/search/movie';
const BASE_URL_MOVIEID = 'https://api.themoviedb.org/3/movie';
const POSTER_URL = 'https://themoviedb.org/t/p/w220_and_h330_face';

import movieCard from '../../templates/movieCard.hbs';
import btnPagination from '../../templates/btnPagination.hbs';
import refs from '../refs';

const api = {
  fetchPopular(page = '') {
    const url = `${BASE_URL_TRENDING}?api_key=${API_KEY}&page=${page}`;
    return fetch(url).then(rawData => rawData.json());
  },
};

export default class MoviePagination {
  #movies = [];
  #delta = 2;

  constructor(selector, selectorBtn) {
    this.element = document.querySelector(selector);
    this.elementBtn = document.querySelector(selectorBtn);
    this.#movies = [];
    this.currentPage = 1;
    this.totalPagas = 0;
    this.goToPrevPage = this.goToPrevPage.bind(this);
    this.goToNextPage = this.goToNextPage.bind(this);
    this.objectBtn = [];
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
    this.renderBntMovies();
    // console.log(this.elementBtn);
    console.log(this.objectBtn);
    this.addClassActiveParent(`pagination_${this.currentPage}`);
    // this.addClassActive('.pagination_1');Город
  }

  fetchPopularMoviesList() {
    return api.fetchPopular(this.currentPage).then(result => {
      const { results, total_pages } = result;

      this.totalPagas = total_pages;
      console.log(`привет из фетч: ${this.totalPagas}`);
      this.movies = results.map(movie => this.movieAdapter(movie));
    });
  }

  renderMovieCards() {
    this.element.innerHTML = movieCard(this.movies);
  }
  renderBntMovies() {
    let pag = this.pagination(this.currentPage, this.totalPagas);
    console.log(pag.indexArray);

    document.querySelector('#pagination_controls').innerHTML = pag.code;

    let self = this;
    for (let i of pag.indexArray) {
      document
        .querySelector('#pagination_' + i)
        .addEventListener('click', function () {
          self.goToPage(i);
        });
    }
    this.pagination(this.currentPage, this.totalPagas);
    this.elementBtn.innerHTML = btnPagination(this.objectBtn);
  }

  ///////////////

  addClassActiveParent(ID) {
    const a = document.getElementById(ID);
    const b = a.parentNode;
    b.classList.add('active');
  }

  pagination(current, last) {
    let code = this.addButtonWithIndex(1),
      indexArray = [1];

    if (current - this.#delta > 0) code += '...';

    for (let i = current - this.#delta; i <= current + this.#delta; i++) {
      if (i > 1 && i < last) {
        code += this.addButtonWithIndex(i);
        indexArray.push(i);
      }
    }

    if (current + this.#delta < last - 1) {
      code += '...';
    }
    // if (current + this.#delta < last - 1) {
    //   indexArray.push('');
    // }

    // code += this.addButtonWithIndex(last - 1);
    code += this.addButtonWithIndex(last);
    indexArray.push(last);

    ///////////

    // const qwe = this.newArrayObjects(indexArray);
    // console.log(qwe);
    this.objectBtn = indexArray.map(num => {
      return {
        key: `${num}`,
      };
    });
    return { code, indexArray };
  }

  addButtonWithIndex(index) {
    return `<button id='pagination_${index}' type='button'>${index}</button>`;
  }

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

  updateCurrentPage(index) {
    console.log(this.currentPage);
    this.currentPage = index;
    this.#movies = [];
    this.fetchPopularMoviesList();
  }

  goToPage(index) {
    if (index < 1 || index >= this.totalPagas) {
      return;
    }
    this.updateCurrentPage(index);
  }

  goToPrevPage() {
    if (this.currentPage === 1) {
      return;
    }
    // this.updateCurrentPage(this.currentPage - 1);
    this.currentPage -= 1;
    this.#movies = [];
    this.fetchPopularMoviesList();
  }

  goToNextPage() {
    if (this.currentPage === this.totalPagas + 1) {
      return;
    }
    // this.updateCurrentPage(this.currentPage + 1);
    this.currentPage += 1;
    this.#movies = [];
    this.fetchPopularMoviesList();
  }
}
