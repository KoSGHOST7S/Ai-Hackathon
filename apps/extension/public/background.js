const ALARM_NAME = "poll_analysis";
const POLL_INTERVAL_MINUTES = 5 / 60; // every 5 seconds
const FALLBACK_API_URL = "https://api.assignmint.ai";

// Badge cycle frames shown while analysis is running in the background
const PULSE_FRAMES = ["·", "··", "···", "··"];
let pulseFrame = 0;

function setPendingBadge() {
  pulseFrame = (pulseFrame + 1) % PULSE_FRAMES.length;
  chrome.action.setBadgeText({ text: PULSE_FRAMES[pulseFrame] });
  chrome.action.setBadgeBackgroundColor({ color: "#6366f1" }); // primary
}

function setDoneBadge() {
  chrome.action.setBadgeText({ text: "✓" });
  chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
}

function setErrorBadge() {
  chrome.action.setBadgeText({ text: "!" });
  chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
}

function clearBadge() {
  chrome.action.setBadgeText({ text: "" });
}

function parseAnalyzingJob(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

async function pollOnce() {
  const data = await chrome.storage.local.get("analyzing_assignment");
  const job = parseAnalyzingJob(data.analyzing_assignment);
  if (!job) {
    // Job was cleared by the popup (it finished while popup was open)
    chrome.alarms.clear(ALARM_NAME);
    clearBadge();
    return;
  }

  setPendingBadge();

  try {
    const baseUrl = job.apiUrl ?? FALLBACK_API_URL;
    const res = await fetch(
      `${baseUrl}/assignments/${job.courseId}/${job.assignmentId}/result`,
      { headers: { Authorization: `Bearer ${job.jwt}` } }
    );

    if (res.ok) {
      await chrome.storage.local.remove("analyzing_assignment");
      chrome.alarms.clear(ALARM_NAME);
      setDoneBadge();
    }
    // 404 / other non-ok = still processing, keep polling
  } catch {
    // Network error — keep polling, don't surface as failure yet
  }
}

// Storage change: start or stop polling based on analyzing_assignment presence
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !("analyzing_assignment" in changes)) return;

  const newValue = changes.analyzing_assignment.newValue;

  if (newValue) {
    // Analysis started — begin polling loop
    setPendingBadge();
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: POLL_INTERVAL_MINUTES,
      periodInMinutes: POLL_INTERVAL_MINUTES,
    });
  } else {
    // Cleared by popup (completed/errored while popup was open)
    chrome.alarms.clear(ALARM_NAME);
  }
});

// Alarm fires every 5 seconds while analysis is pending
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    pollOnce();
  }
});

// Re-attach polling on SW restart if a job was in-flight
chrome.runtime.onStartup.addListener(async () => {
  const data = await chrome.storage.local.get("analyzing_assignment");
  if (data.analyzing_assignment) {
    setPendingBadge();
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: POLL_INTERVAL_MINUTES,
      periodInMinutes: POLL_INTERVAL_MINUTES,
    });
  }
});

// openPopup message (existing)
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "openPopup") {
    if (typeof chrome.action.openPopup === "function") {
      chrome.action.openPopup().catch(() => {});
    }
  }
});
