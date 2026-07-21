// src/serviceFunctions/navigation.js
let _navigate = null;

export function setNavigator(navigate) {
  _navigate = navigate;
}

export function navigateTo(path) {
  if (_navigate) {
    _navigate(path);
  }
}