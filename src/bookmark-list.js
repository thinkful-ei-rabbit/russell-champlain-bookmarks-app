import $ from 'jquery';
import store from './store';
import api from './api';


const generateError = function (message) {
    return `
        <section class="error-content">
            <button id="cancel-error">X</button>
            <p>${message}</p>
        </section>
        `;
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
    $('.bookmark-list-container').html(bookmarkListString);
};

const generateBookmarkForm = function () {
    return `
    <form id="js-bookmark-list-form">
        <input class="js-bookmark-list-entry" type="text" name="title" placeholder="Bookmark Name" required />
        <input class="js-site-address" type="url" name="url" placeholder="Valid URL" required />
        <textarea name="desc" form="js-bookmark-list-form" placeholder="Enter a short description here..."></textarea>
        <div class="rating-container">
            <label for="rating">Choose a Rating:</label>

            <select name="rating" id="rating">
                <option value="0 Stars">Select One</option>
                <option value="1 Stars">1 Star</option>
                <option value="2 Stars">2 Stars</option>
                <option value="3 Stars">3 Stars</option>
                <option value="4 Stars">4 Stars</option>
                <option value="5 Stars">5 Stars</option>
            </select>
        </div>
        <button type="submit">Create Bookmark</button>
    </form>
    `;
};

const handleNewBookmarkClicked = function () {
    const bookmarkForm = generateBookmarkForm();
    const generateCancel = function () {
        return `
        <button>Cancel</button>
        `;
    };
    $('.button-container').on('click', '.add-bookmark', function () {
        store.toggleAdding();
        if (store.adding === true) {
            $('.form-container').html(bookmarkForm);
            $('.add-bookmark').html(generateCancel());
        } else {
            $('.form-container').empty();
            $('.add-bookmark').html(`
                <button>+ NEW<i id="bkmk-icon" class="fas fa-bookmark"></i></button>`);
        };
    });
};

const generateBookmarkElement = function (bookmark) {
    let bookmarkName = bookmark.title;
    let bookmarkRating = bookmark.rating
    return `
    <ul class="js-bookmark-list">
        <div class="list-element-container"><li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
            ${bookmarkName}
            <div class="rating">${bookmarkRating}</div>
        </li></div>
    </ul>
    `;
};

const generateBookmarkString = function (bookmarkList) {
    const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
};

const handleNewBookmarkSubmit = function () {
    $('.form-container').on('submit', '#js-bookmark-list-form', function (event) {
        event.preventDefault();
        store.toggleAdding();
        if (store.adding === false) {
            $('.form-container').empty();
            $('.add-bookmark').html(`
            <button>+ NEW<i id="bkmk-icon" class="fas fa-bookmark"></i></button>`);
        };
        const newBookmarkName = {
            title: event.target.title.value,
            url: event.target.url.value,
            desc: event.target.desc.value,
            rating: event.target.rating.value,
            expanded: false
        };
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



//===============================================



const getIdFromElement = function (bookmark) {
    return $(bookmark)
        .closest('.js-bookmark-element')
        .data('bookmark-id');
};

const generateExpandView = function (bookmark) {
    let bookmarkName = bookmark.title;
    let bookmarkDesc = bookmark.desc;
    let bookmarkURL = bookmark.url;
    const handleVisitSiteButton = function () {
        // $('.site-button').on('click', ${ bookmarkURL })
    }
    return `
        <li class="js-bookmark-element-expanded" data-bookmark-id="${bookmark.id}">
            <h2>${bookmarkName}</h2>
            <div class="icons"><i id="icon edit" class="fas fa-edit"></i><i id="icon delete" class="fas fa-trash-alt"></i></div>
            <div class="expand-cont">
                    <p class="description">${bookmarkDesc}</p>
                    <button class="site-button" type="button">Visit Site</button>
                </div>
        </li>
            `;
};

const handleBookmarkClicked = function () {
    $('.bookmark-list-container').on('click', '.js-bookmark-element', function (event) {
        const getBookmarkId = getIdFromElement(event.currentTarget);
        let bookmark = '';
        for (let i = 0; i < store.bookmarks.length; i++) {
            if (store.bookmarks[i].id === getBookmarkId) {
                bookmark = store.bookmarks[i];
            }
        }
        const bookmarkName = bookmark.title;
        const bookmarkRating = bookmark.rating;
        const expandedView = generateExpandView(bookmark);
        store.toggleExpandBookmark(bookmark.id);
        if (store.bookmarks.expanded === true) {
            $('.js-bookmark-element').html(expandedView);
        }
    });
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

const generateEditForm = function () {
    return //html form
}

const handleEditBookmarkClicked = function () {
    $('js-bookmark list').on('click', 'js-edit-bookmark', event => {
        //function that renders edit form html
    });
}

const handleEditBookmarkSubmit = function () {
    //dont forget to change these id(s) to match element in html
    $('.js-bookmark-list').on('submit', 'js-edit-bookmark', event => {
        event.preventDefault();
        const id = getIdFromElement(event.currentTarget);
        const bookmarkName = $(event.currentTarget).find('.bookmark').val();

        api.editBookmark(id, { name: bookmarkName })
            .then(() => {
                store.findAndUpdate(id, { name: bookmarkName });
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
    handleCloseError();
    handleNewBookmarkClicked();
    handleNewBookmarkSubmit();
    handleBookmarkClicked();
    handleDeleteBookmarkClicked();
    handleEditBookmarkClicked();
    handleEditBookmarkSubmit();
};

export default {
    render,
    bindEventListeners,
};






//Tried to convert rating value to returning star icons
// const generateStars = function (bookmark) {
//     if (bookmark.rating.value === 1) {
//         return `
//         <i class='fas fa-star'></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>
//         `;
//     }
//     if (bookmark.rating.value === 2) {
//         return `
//         <i class='fas fa-star'></i><i class='fas fa-star'></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>
//         `;
//     }
//     if (bookmark.rating.value === 3) {
//         return `
//         <i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i><i class="far fa-star"></i><i class="far fa-star"></i>
//         `;
//     }
//     if (bookmark.rating.value === 4) {
//         return `
//         <i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i><i class="far fa-star"></i>
//         `;
//     }
//     if (bookmark.rating.value === 5) {
//         return `
//         <i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i>
//         `;
//     } else {
//         return `
//         <i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>
//         `;
//     }
// };