const API_URL = "http://localhost:8000";

// Timeout for the research pipeline (5 minutes — LLM + scraping takes time)
const PIPELINE_TIMEOUT_MS = 5 * 60 * 1000;

/**
 * Creates a fetch promise that rejects after a given timeout.
 */
function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal }).finally(() =>
        clearTimeout(timer)
    );
}

/**
 * Check if the backend server is reachable.
 */
export async function checkHealth() {
    try {
        const res = await fetch(`${API_URL}/health`);
        return res.ok;
    } catch {
        return false;
    }
}

/**
 * Run the multi-agent research pipeline.
 * Throws an error with a descriptive message on failure.
 */
export async function runResearch(topic) {
    let res;
    try {
        res = await fetchWithTimeout(
            `${API_URL}/research`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            },
            PIPELINE_TIMEOUT_MS
        );
    } catch (err) {
        if (err.name === "AbortError") {
            throw new Error(
                "Request timed out after 5 minutes. The research pipeline is taking too long."
            );
        }
        // Network error — backend is not reachable at all
        throw new Error(
            "Cannot connect to the backend server at http://localhost:8000. " +
            "Make sure it is running: uvicorn main:app --reload --port 8000"
        );
    }

    if (!res.ok) {
        // Try to extract a meaningful error message from the server response
        let serverMessage = `Server error (${res.status})`;
        try {
            const data = await res.json();
            if (data?.detail) {
                serverMessage = typeof data.detail === "string"
                    ? data.detail
                    : JSON.stringify(data.detail);
            }
        } catch {
            // If parsing fails, keep the generic status message
        }
        throw new Error(serverMessage);
    }

    return res.json();
}