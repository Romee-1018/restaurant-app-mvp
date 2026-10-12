// The ONLY place where the server address is written.
// Use your laptop's IPv4 address (run `ipconfig`). Android emulator: http://10.0.2.2:5000
   export const BASE_URL = "http://192.168.1.7:5000";

let authToken = null;

// AuthContext calls this after login/logout so every request carries the token
export const setAuthToken = (token) => {
  authToken = token;
};

/**
 * @param {string} path
 * @param {{ method?: string, body?: any }} [options]
 */
export async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error(
      "Cannot reach the server. Check Wi-Fi, server and BASE_URL."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}