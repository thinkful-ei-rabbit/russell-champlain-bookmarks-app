import $ from 'jquery';
import './index.css';
import api from './api';
import store from './store';
import bookmarkList from './bookmark-list';

const main = function () {
    api.getBookmarks()
        .then((bookmarks) => {
            bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
            bookmarkList.render();
        });

    bookmarkList.bindEventListeners();
    bookmarkList.render();
};

$(main);