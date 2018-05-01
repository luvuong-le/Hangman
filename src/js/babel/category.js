"use strict";

var categoryManager = {
    e: {
        categories: document.querySelectorAll('.category')
    },

    setListeners: function setListeners() {
        var _loop = function _loop(category) {
            category.addEventListener("click", function () {
                localStorage.setItem("category", category.innerHTML);
            });
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.e.categories[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var category = _step.value;

                _loop(category);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
};

categoryManager.setListeners();