"use strict";
exports.__esModule = true;
var toast_min_1 = require("./toast.min");
(function () {
    var endpoints = {
        getAllUsers: 'https://jsonplaceholder.typicode.com/users',
        getUserPosts: 'https://jsonplaceholder.typicode.com/posts?userId=',
        getPostComments: 'https://jsonplaceholder.typicode.com/comments?postId='
    };
    var getAllUsersButton = document.getElementById('get-all-users');
    var allUsers = document.getElementById('all-users');
    var userPostsList = document.getElementById('user-posts');
    var postCommentsList = document.getElementById('post-comments');
    getAllUsersButton.addEventListener('click', function (e) {
        serverCall(endpoints.getAllUsers)
            .then(function (response) {
            var users = JSON.parse(response);
            createList(allUsers, users, 'user');
        }, function (error) { return console.log(error); });
        e.preventDefault();
    });
    document.addEventListener('click', function (e) {
        if (e.target && e.target.className === 'list-group-item user') {
            var users = document.getElementsByClassName('user');
            var userId = e.target.getAttribute('data-id');
            e.target.classList.add('active');
            removeActiveClass(users, e.target);
            serverCall(endpoints.getUserPosts + userId)
                .then(function (response) {
                var userPosts = JSON.parse(response);
                createList(userPostsList, userPosts, 'post');
                userPosts.forEach(function (post) {
                    var userPost = document.querySelectorAll('.post[data-id="' + post.id + '"]')[0];
                    var spinner = document.createElement('div');
                    spinner.className = 'spin';
                    userPost.appendChild(spinner);
                    serverCall(endpoints.getPostComments + post.id)
                        .then(function (success) {
                        var serverResponse = JSON.parse(success);
                        var postsCount = serverResponse.length;
                        var postItem = document.querySelectorAll('.post[data-id="' + serverResponse[0].postId + '"]')[0];
                        var badge = document.createElement('span');
                        badge.className = 'badge badge-pill badge-dark';
                        badge.innerText = postsCount;
                        postItem.appendChild(badge);
                    }, function (error) { return console.log(error); });
                });
            }, function (error) { return console.log(error); });
        }
        else if (e.target && e.target.className === 'list-group-item post') {
            var posts = document.getElementsByClassName('post');
            var postId = e.target.getAttribute('data-id');
            e.target.classList.add('active');
            removeActiveClass(posts, e.target);
            serverCall(endpoints.getPostComments + postId)
                .then(function (response) {
                var postComments = JSON.parse(response);
                createList(postCommentsList, postComments, 'comment');
            }, function (error) { return console.log(error); });
        }
    });
    function serverCall(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function () {
                if (this.status === 200) {
                    new toast_min_1["default"]({
                        message: 'Success!',
                        type: 'success'
                    });
                    resolve(this.response);
                }
                else {
                    var error = new Error(this.statusText);
                    error.code = this.status;
                    new toast_min_1["default"]({
                        message: 'Something went wrong, try again later',
                        type: 'danger'
                    });
                    reject(error);
                }
            };
            xhr.onerror = function () {
                reject(new Error('Network Error'));
            };
            xhr.send();
        });
    }
    function createList(elementsList, data, type) {
        var className;
        switch (type) {
            case 'user':
                className = 'list-group-item user';
                break;
            case 'post':
                className = 'list-group-item post';
                break;
            default:
                className = 'list-group-item comment';
                break;
        }
        elementsList.innerHTML = '';
        data.forEach(function (element) {
            var listElement = document.createElement('li');
            listElement.className = className;
            listElement.innerText = type === 'post' ? element.title : element.name;
            listElement.setAttribute('data-id', element.id);
            elementsList.append(listElement);
        });
    }
    function removeActiveClass(elementsList, currentElement) {
        for (var i = 0; i < elementsList.length; i++) {
            if (elementsList[i] !== currentElement) {
                elementsList[i].classList.remove('active');
            }
        }
    }
})();
