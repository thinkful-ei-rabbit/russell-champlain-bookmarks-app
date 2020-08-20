import $ from 'jquery';
import store from './store';
import api from './api';

const generateBookmarkElement = function (bookmark) {
    let bookmarkTitle = ""; //html not finished
};

const generateBookmarkString = function (bookmarkList) {
    const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
};

const generateError = function (message) {
    return //html not finished
};

const renderError = function () {
    if (store.error) {
        const el = generateError(store.error);
        $('.error-container').html(el);
    } else {
        $('.error-container').empty();
    }
};

const handleCloseError = function () {
    $('.error-container').on('click', '#cancel-error', () => {
        store.setError(null);
        renderError();
    });
};

const render = function () {
    renderError();
    let bookmarks = [...store.bookmarks];
    //might need an if statement
    const bookmarkListString = generateBookmarkString(bookmarks);
    $('.js-bookmark-list').html(bookmarkListString);
};

const handleNewBookmarkSubmit = function () {
    $('#js-bookmark-list-form').submit(function (event) {
        event.preventDefault();
        const newBookmarkName = $('.js-bookmark-list-entry').val();
        $('.js-bookmark-list-entry').val('');
        api.createBookmark(newBookmarkName)
            .then((newBookmark) => {
                store.addBookmark(newBookmark);
                render();
            })
            .catch((error) => {
                store.setError(error.message);
                renderError();
            });
    });
};

const getIdFromElement = function (bookmark) {
    return $(bookmark)
    .closest('.js-bookmark-element')
    .data('bookmark-id');
};

const handleDeleteBookmarkClicked = function () {
    $('.js-bookmark-list').on('click', '.js-bookmark-delete', event => {
        const id = getIdFromElement(event.currentTarget);
        api.deleteBookmark(id)
            .then(() => {
                store.findAndDelete(id);
                render();
            })
            .catch((error) => {
                console.log(error);
                store.setError(error.message);
                renderError();
            });
    });
};



const bindEventListeners = function () {

};

export default {
    render,
    bindEventListeners
};