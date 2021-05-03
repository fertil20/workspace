import {API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN} from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then((res) => {
            if(!res.ok) {
                return Promise.reject(res);
            }
            return res.text()})
        .then((text) => text.length ? JSON.parse(text) : {})
};

export function newUser(newUserRequest){
    return request({
        url: API_BASE_URL + "/newUser",
        method: 'POST',
        body: JSON.stringify(newUserRequest)
    });
}

export function getRoleUsers(roleName){
    return request({
        url: API_BASE_URL + "/roles/" + roleName,
        method: 'GET',
    });
}

export function addUserToRole(roleName, username){
    return request({
        url: API_BASE_URL + "/roles/" + roleName+ "/addUser/" + username,
        method: 'POST',
    });
}

export function getUsersWithoutRole(roleName){
    return request({
        url: API_BASE_URL + "/roles/" + roleName + "/addUser",
        method: 'GET',
    });
}

export function getAllRoles(){
    return request({
        url: API_BASE_URL + "/roles",
        method: 'GET'
    })
}

export function addNewRole(addNewRoleRequest){
    return request({
        url: API_BASE_URL + "/roles",
        method: 'POST',
        body: JSON.stringify(addNewRoleRequest)
    });
}

export function forgotPassword(forgotPasswordRequest){
    return request({
        url: API_BASE_URL + "/auth/forgotPassword",
        method: 'POST',
        body: JSON.stringify(forgotPasswordRequest)
    });
}

export function forgotPasswordResetGet(token){ //GET token запрос
    return request({
        url: API_BASE_URL + "/auth/resetPassword?token=" + token,
        method: 'GET'
    });
}

export function forgotPasswordResetPost(password, token){ //Возвращает пароль и токен todo сделать GET token запрос
    return request({
        url: API_BASE_URL + "/auth/resetPassword?token=" + token,
        method: 'POST',
        body: password
    });
}

export function deleteUser(deleteUserRequest){ // Возвращает ID пользователя
    return request({
        url: API_BASE_URL + "/deleteUsers/" + deleteUserRequest,
        method: 'POST'
    });
}

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function createPoll(pollData) {
    return request({
        url: API_BASE_URL + "/polls",
        method: 'POST',
        body: JSON.stringify(pollData)         
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signing",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function profileEdit(profileEditRequest, username){
    return request({
        url: API_BASE_URL + "/users/" + username + "/edit",
        method: 'POST',
        body: JSON.stringify(profileEditRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/me",
        method: 'GET'
    });
}

export function getAllUsers(){
    return request({
        url: API_BASE_URL + "/users",
        method: 'GET'
    })
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}