const API_BASE_URL = "http://127.0.0.1:8000/api";

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData
        ? JSON.stringify(errorData)
        : `Request failed: ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function fetchEntries() {
  const response = await fetch(`${API_BASE_URL}/entries/`);

  return handleResponse(response);
}

export async function createEntry(entryData) {
  const response = await fetch(`${API_BASE_URL}/entries/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entryData),
  });

  return handleResponse(response);
}

export async function updateEntry(entryId, entryData) {
  const response = await fetch(
    `${API_BASE_URL}/entries/${entryId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entryData),
    }
  );

  return handleResponse(response);
}

export async function deleteEntry(entryId) {
  const response = await fetch(
    `${API_BASE_URL}/entries/${entryId}/`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
}