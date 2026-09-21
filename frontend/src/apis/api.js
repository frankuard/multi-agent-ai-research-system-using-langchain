const API_URL = "http://localhost:8000"

export async function runResearch(topic) {
    
    const res = await fetch(`${API_URL}/research`,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({topic}),
    });

    if (!res.ok)  throw new Error("Research request failed");

    return res.json();
}