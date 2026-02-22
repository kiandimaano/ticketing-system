const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getRole() {
    return localStorage.getItem(ROLE_KEY) || 'user';
}

export function setRole(role) {
    if (role) localStorage.setItem(ROLE_KEY, role);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
}
