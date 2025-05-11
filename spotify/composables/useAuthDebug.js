// Debugging utility for tracking authentication issues
let logs = []

export function logAuthEvent(eventName, details = null) {
  const timestamp = new Date().toISOString()
  const entry = {
    timestamp,
    event: eventName,
    details: details || {}
  }
  
  logs.push(entry)
  console.log(`[AUTH DEBUG] ${eventName}`, details || '')
  
  // Limit log size to prevent memory issues
  if (logs.length > 100) {
    logs.shift() // Remove oldest entry
  }
  
  // Store in session storage for debugging
  if (process.client) {
    try {
      sessionStorage.setItem('auth_debug_logs', JSON.stringify(logs))
    } catch (e) {
      // Ignore errors (like if sessionStorage isn't available)
    }
  }
}

export function clearAuthLogs() {
  logs = []
  if (process.client) {
    try {
      sessionStorage.removeItem('auth_debug_logs')
    } catch (e) {
      // Ignore
    }
  }
}

export function getAuthLogs() {
  return logs
}
