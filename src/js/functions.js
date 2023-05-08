import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './refs';
import { renderGalleryMarkup } from './card';
import { fetchImages } from './pixabay';

Notiflix.Notify.init({
 width: '290px',
 position: 'right-top',
 cssAnimationStyle: 'zoom',
 cssAnimationDuration: 450,
 distance: '10px',
 opacity: 0.9,
});

const lightbox = new SimpleLightbox('.gallery a');

const hideBtnLoadMore = () => (refs.loadMoreBtn.style.display = 'none');
const showBtnLoadMore = () => (refs.loadMoreBtn.style.display = 'block');


let page = 1;
let perPage = 40;

hideBtnLoadMore();

export async function onFormSubmit(e) {
  e.preventDefault();

  let request = refs.form.elements.searchQuery.value.trim();
  page = 1;
  cleanGallery();

  if (request === '') {
    hideBtnLoadMore();
    return Notiflix.Notify.failure( 'Oops... The field cannot be empty.');
  }

  try {
    const gallery = await fetchImages(request, page);
    let totalPages = gallery.data.totalHits;

    if (gallery.data.hits.length === 0) {
      cleanGallery();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (totalPages > 40) {
      showBtnLoadMore();
      Notiflix.Notify.success(`Hooray! We found ${totalPages} image.`);
    } else if (totalPages >= 1 && totalPages < 40) {
      hideBtnLoadMore();
      Notiflix.Notify.success(`Hooray! We found ${totalPages} image.`);
    }
    renderGalleryMarkup(gallery.data.hits);

    lightbox.refresh();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  lightbox.refresh();
}

export async function onClickBtnLoadMore() {
  page += 1;
  let request = refs.form.elements.searchQuery.value.trim();

  try {
    const gallery = await fetchImages(request, page);
    let showPages = gallery.data.totalHits / perPage;

    if (showPages <= page) {
      hideBtnLoadMore();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }

    renderGalleryMarkup(gallery.data.hits);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  lightbox.refresh();
}

function cleanGallery() {
  refs.gallery.innerHTML = '';
  page = 1;
  hideBtnLoadMore();
}