const API_BASE_URL = "http://localhost:8000/reports";

export async function fetchReport() {
    const response = await fetch(`${API_BASE_URL}/report`);
    if (!response.ok) {
        throw new Error("Failed to fetch report");
    }
    return await response.json();
}

export async function createReport(reportData) {
    const response = await fetch(`${API_BASE_URL}/report`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
    });
    if (!response.ok) {
        throw new Error("Failed to create report");
    }
    return await response.json();
}
