const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchMonthlyGoals() {
  const response = await fetch(
    `${API_BASE_URL}/monthly-goals/`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch monthly goals: ${response.status}`
    );
  }

  return response.json();
}