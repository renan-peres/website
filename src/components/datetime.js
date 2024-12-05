function updateDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  if (document.getElementById('datetime')) {
    document.getElementById('datetime').textContent = now.toLocaleString('en-US', options);
  }
}

// Update every second when the page loads
if (typeof window !== 'undefined') {
  updateDateTime();
  setInterval(updateDateTime, 1000);
}