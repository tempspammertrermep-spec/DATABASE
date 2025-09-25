// Function to validate key and download asset
async function validateAndDownload(key) {
  const res = await fetch("/.netlify/functions/validateKey", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key })
  });

  const contentType = res.headers.get("Content-Type");

  if (contentType.includes("application/json")) {
    const data = await res.json();
    document.getElementById("result").innerHTML = `<p style="color:red;">${data.message}</p>`;
    return false;
  } else {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "unity-asset.zip";
    a.click();
    window.URL.revokeObjectURL(url);
    document.getElementById("result").innerHTML = `<p style="color:green;">Download started!</p>`;
    return true;
  }
}

// Check if user already has a key stored
const savedKey = localStorage.getItem("userKey");
if (savedKey) {
  // Automatically allow downloads without re-entering key
  document.getElementById("keyInput").value = savedKey;
  document.getElementById("submitKey").addEventListener("click", () => {
    validateAndDownload(savedKey);
  });
} else {
  // No key stored, user must enter key
  document.getElementById("submitKey").addEventListener("click", async () => {
    const key = document.getElementById("keyInput").value.trim();
    const success = await validateAndDownload(key);
    if (success) {
      // Store key in localStorage for future downloads
      localStorage.setItem("userKey", key);
    }
  });
}