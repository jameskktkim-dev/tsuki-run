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

export async function fetchGoals() {
  const response = await fetch(`${API_BASE_URL}/monthly-goals/`);

  return handleResponse(response);
}

export async function createGoal(goalData) {
  const response = await fetch(`${API_BASE_URL}/monthly-goals/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goalData),
  });

  return handleResponse(response);
}

export async function updateGoal(goalId, goalData) {
  const response = await fetch(
    `${API_BASE_URL}/monthly-goals/${goalId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goalData),
    }
  );

  return handleResponse(response);
}

export async function deleteGoal(goalId) {
  const response = await fetch(
    `${API_BASE_URL}/monthly-goals/${goalId}/`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
}