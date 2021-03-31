import './main.scss';
import refs from './js/refs'; /* ждём, пока у нас появятся все нужные имена классов для querySelector */
import ApiService from './js/api';
import MoviePagination from './js/paginetion';

const prev = document.querySelector('#prev');
const next = document.querySelector('#next');

//Проверка работы запроса популярных фильмов и отрисовка галлереи карточек
const Api = new MoviePagination('.movie__list', '.pagination-controls__list');
Api.fetchPopularMoviesList().then(console.log('привет '));

function onSearch(event) {
  event.preventDefault();
}

console.log(prev);

// console.log(Api.goToRerevPage, Api.goToNextPage);
prev.addEventListener('click', Api.goToRerevPage);

next.addEventListener('click', Api.goToNextPage);
