import { authFetch } from "./auth";
import { API_BASE_URL } from "./config";

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

export async function generateTrainingGuide(
  guideData
) {
  const response = await authFetch(
    `${API_BASE_URL}/training-guides/generate/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guideData),
    }
  );

  return handleResponse(response);
}

export async function fetchTrainingGuides() {
  const response = await authFetch(
    `${API_BASE_URL}/training-guides/`
  );

  return handleResponse(response);
}