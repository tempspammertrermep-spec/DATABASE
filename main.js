const savedKey = localStorage.getItem("userKey");

if (!savedKey) {
  // No key stored → redirect back to gate page
  window.location.href = "/";
}

async function downloadAsset(assetFile) {
  const res = await fetch("/.netlify/functions/validateKey", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: savedKey })
  });

  const contentType = res.headers.get("Content-Type");

  if (contentType.includes("application/json")) {
    const data = await res.json();
    alert(data.message); // Shows error if IP changed
  } else {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = assetFile;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Attach to all download buttons
document.querySelectorAll(".download-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const assetFile = btn.dataset.asset;
    downloadAsset(assetFile);
  });
});