const API_BASE_URL = "http://127.0.0.1:8000/api";

const ACCESS_TOKEN_KEY = "tsuki-run-access-token";
const REFRESH_TOKEN_KEY = "tsuki-run-refresh-token";

async function parseError(response, fallbackMessage) {
  const errorData = await response.json().catch(() => null);

  if (!errorData) {
    return fallbackMessage;
  }

  if (errorData.detail) {
    return errorData.detail;
  }

  return JSON.stringify(errorData);
}

export async function register(username, email, password) {
  const response = await fetch(`${API_BASE_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const message = await parseError(
      response,
      "Unable to create your account."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password.");
  }

  const tokens = await response.json();

  setTokens(tokens);

  return tokens;
}

export function setTokens(tokens) {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    tokens.access
  );

  localStorage.setItem(
    REFRESH_TOKEN_KEY,
    tokens.refresh
  );
}

export function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken() && getRefreshToken());
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    logout();
    return null;
  }

  const response = await fetch(
    `${API_BASE_URL}/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    }
  );

  if (!response.ok) {
    logout();
    return null;
  }

  const data = await response.json();

  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    data.access
  );

  return data.access;
}

export async function authFetch(url, options = {}) {
  const accessToken = getAccessToken();

  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let response = await fetch(url, requestOptions);

  if (response.status !== 401) {
    return response;
  }

  const newAccessToken = await refreshAccessToken();

  if (!newAccessToken) {
    window.dispatchEvent(
      new CustomEvent("tsuki-auth-expired")
    );

    return response;
  }

  response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${newAccessToken}`,
    },
  });

  return response;
}