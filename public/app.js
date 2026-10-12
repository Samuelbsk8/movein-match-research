const { useState } = React;

const choices = {
  budget: ["Low", "Medium", "High"],
  cleanliness: ["1", "2", "3", "4", "5"],
  sleep: ["Early", "Late"],
  guests: ["Rarely", "Sometimes", "Often"]
};

const startingPreferences = {
  budget: "Medium",
  cleanliness: "3",
  sleep: "Early",
  guests: "Sometimes"
};

function PreferenceForm({ title, preferences, setPreferences }) {
  function updatePreference(event) {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.value
    });
  }

  return (
    <section className="preference-card">
      <h2>{title}</h2>

      <label>
        Budget
        <select name="budget" value={preferences.budget} onChange={updatePreference}>
          {choices.budget.map((choice) => <option key={choice}>{choice}</option>)}
        </select>
      </label>

      <label>
        Cleanliness Level
        <select name="cleanliness" value={preferences.cleanliness} onChange={updatePreference}>
          {choices.cleanliness.map((choice) => <option key={choice}>{choice}</option>)}
        </select>
      </label>

      <label>
        Sleep Schedule
        <select name="sleep" value={preferences.sleep} onChange={updatePreference}>
          {choices.sleep.map((choice) => <option key={choice}>{choice}</option>)}
        </select>
      </label>

      <label>
        Guest Preference
        <select name="guests" value={preferences.guests} onChange={updatePreference}>
          {choices.guests.map((choice) => <option key={choice}>{choice}</option>)}
        </select>
      </label>
    </section>
  );
}

function App() {
  const [you, setYou] = useState(startingPreferences);
  const [roommate, setRoommate] = useState(startingPreferences);
  const [result, setResult] = useState(null);

  async function calculateMatch() {
    const response = await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ you, roommate })
    });

    const data = await response.json();
    setResult(data);
  }

  return (
    <main>
      <h1>MoveIn Match</h1>
      <p className="subtitle">Research Demo: Find a basic roommate compatibility score.</p>

      <div className="forms">
        <PreferenceForm title="Your Preferences" preferences={you} setPreferences={setYou} />
        <PreferenceForm title="Sample Roommate Preferences" preferences={roommate} setPreferences={setRoommate} />
      </div>

      <button onClick={calculateMatch}>Calculate Match</button>

      {result && (
        <section className="result">
          <h2>Compatibility Score: {result.score}%</h2>
          <p>{result.message}</p>
        </section>
      )}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);