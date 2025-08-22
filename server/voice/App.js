// App.js (React)
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const askAssistant = async () => {
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div>
      <h1>Arogya Mitra</h1>
      <input
        type="text"
        placeholder="Apna prashn likhiye..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={askAssistant}>Aapka prashn</button>
      <p><b>Assistant:</b> {response}</p>
    </div>
  );
}

export default App;
