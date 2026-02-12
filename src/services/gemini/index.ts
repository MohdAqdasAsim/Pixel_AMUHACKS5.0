export async function generateText(prompt: string): Promise<string> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/generate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_JWT_TOKEN}`
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to generate text");
  }

  const data = await response.json();

  return data.candidates[0].content.parts[0].text as string;
}
