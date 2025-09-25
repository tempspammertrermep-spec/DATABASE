const consoleDiv = document.getElementById("result-console");

function logMessage(message) {
  consoleDiv.innerText += message + "\n";
  consoleDiv.scrollTop = consoleDiv.scrollHeight; // auto scroll
}

document.getElementById("submitKey").addEventListener("click", async () => {
  const key = document.getElementById("keyInput").value.trim();

  if (!key) {
    logMessage("ERROR: Please enter a key.");
    return;
  }

  logMessage(`Validating key: ${key} ...`);

  try {
    const res = await fetch("/.netlify/functions/validateKey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key })
    });

    let data;
    try {
      data = await res.json(); // always expect JSON
    } catch (err) {
      logMessage("ERROR: Invalid server response");
      return;
    }

    if (data.valid === false) {
      logMessage(`ERROR: ${data.message}`);
      return;
    }

    // Key valid → save and redirect
    logMessage("SUCCESS: Key accepted. Redirecting...");
    localStorage.setItem("userKey", key);

    setTimeout(() => {
      window.location.href = "/main.html";
    }, 1000);

  } catch (err) {
    logMessage(`ERROR: Server error - ${err.message}`);
  }
});