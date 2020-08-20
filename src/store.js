const bookmarks = [
    {
        id: '',
        title: '',
        rating: 0,
        url: '',
        description: '',
        expanded: false
    }
];
let adding = false;
let error = null;
let filter = 0;

const findById = function (id) {
    return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
};

const addBookmark = function (bookmark) {
    this.bookmarks.push(bookmark);
};

const findAndDelete = function (id) {
    this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
};

const toggleExpandBookmark = function () {
    this.bookmarks.expanded = !this.bookmarks.expanded;
};

const toggleAdding = function () {
    this.adding = !this.adding;
};

const findAndUpdate = function (id, newData) {
    const currentBookmark = this.findById(id);
    Object.assign(currentBookmark, newData);
};

const setError = function (error) {
    this.error = error;
};

export default {
    bookmarks,
    adding,
    error,
    filter,
    findById,
    addBookmark,
    findAndDelete,
    toggleExpandBookmark,
    toggleAdding,
    findAndUpdate,
    setError
};