const ALARM_NAME = "poll_analysis";
const POLL_INTERVAL_MINUTES = 5 / 60; // every 5 seconds
const FALLBACK_API_URL = "https://api.assignmint.ai";
const ext = typeof browser !== "undefined" ? browser : chrome;

// Badge cycle frames shown while analysis is running in the background
const PULSE_FRAMES = ["·", "··", "···", "··"];
let pulseFrame = 0;

function setPendingBadge() {
  pulseFrame = (pulseFrame + 1) % PULSE_FRAMES.length;
  ext.action.setBadgeText({ text: PULSE_FRAMES[pulseFrame] });
  ext.action.setBadgeBackgroundColor({ color: "#6366f1" }); // primary
}

function setDoneBadge() {
  ext.action.setBadgeText({ text: "✓" });
  ext.action.setBadgeBackgroundColor({ color: "#22c55e" });
}

function setErrorBadge() {
  ext.action.setBadgeText({ text: "!" });
  ext.action.setBadgeBackgroundColor({ color: "#ef4444" });
}

function clearBadge() {
  ext.action.setBadgeText({ text: "" });
}

function openExtensionPageInTab(windowId) {
  const createOptions = { url: ext.runtime.getURL("index.html") };
  if (typeof windowId === "number" && windowId >= 0) {
    createOptions.windowId = windowId;
  }
  ext.tabs.create(createOptions);
}

async function openPopupOrFallback(windowId) {
  if (typeof ext.action.openPopup === "function") {
    try {
      await ext.action.openPopup();
      return;
    } catch {
      // Firefox and some Chrome contexts can reject this outside explicit action flow
    }
  }
  openExtensionPageInTab(windowId);
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
  const data = await ext.storage.local.get("analyzing_assignment");
  const job = parseAnalyzingJob(data.analyzing_assignment);
  if (!job) {
    // Job was cleared by the popup (it finished while popup was open)
    ext.alarms.clear(ALARM_NAME);
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
      await ext.storage.local.remove("analyzing_assignment");
      ext.alarms.clear(ALARM_NAME);
      setDoneBadge();
    }
    // 404 / other non-ok = still processing, keep polling
  } catch {
    // Network error — keep polling, don't surface as failure yet
  }
}

// Storage change: start or stop polling based on analyzing_assignment presence
ext.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !("analyzing_assignment" in changes)) return;

  const newValue = changes.analyzing_assignment.newValue;

  if (newValue) {
    // Analysis started — begin polling loop
    setPendingBadge();
    ext.alarms.create(ALARM_NAME, {
      delayInMinutes: POLL_INTERVAL_MINUTES,
      periodInMinutes: POLL_INTERVAL_MINUTES,
    });
  } else {
    // Cleared by popup (completed/errored while popup was open)
    ext.alarms.clear(ALARM_NAME);
  }
});

// Alarm fires every 5 seconds while analysis is pending
ext.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    pollOnce();
  }
});

// Re-attach polling on SW restart if a job was in-flight
ext.runtime.onStartup.addListener(async () => {
  const data = await ext.storage.local.get("analyzing_assignment");
  if (data.analyzing_assignment) {
    setPendingBadge();
    ext.alarms.create(ALARM_NAME, {
      delayInMinutes: POLL_INTERVAL_MINUTES,
      periodInMinutes: POLL_INTERVAL_MINUTES,
    });
  }
});

// openPopup message (existing)
ext.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "openPopup") {
    void openPopupOrFallback(sender?.tab?.windowId);
  }
});
