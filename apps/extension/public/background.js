const ALARM_NAME = "poll_analysis";
const POLL_INTERVAL_MINUTES = 5 / 60; // every 5 seconds
const FALLBACK_API_URL = "https://api.assignmint.ai";
const ext =
  typeof browser !== "undefined"
    ? browser
    : typeof chrome !== "undefined"
    ? chrome
    : null;
const action = ext?.action ?? ext?.browserAction;
if (!ext?.alarms || !ext.storage?.local || !action) {
  throw new Error("Extension APIs are unavailable in background context.");
}

// Badge cycle frames shown while analysis is running in the background
const PULSE_FRAMES = ["·", "··", "···", "··"];
let pulseFrame = 0;

function isPromiseLike(value) {
  return !!value && typeof value.then === "function";
}

function storageGetLocal(key) {
  return new Promise((resolve) => {
    try {
      const maybePromise = ext.storage.local.get(key, resolve);
      if (isPromiseLike(maybePromise)) {
        maybePromise.then((result) => resolve(result ?? {})).catch(() => resolve({}));
      }
    } catch {
      resolve({});
    }
  });
}

function storageRemoveLocal(key) {
  return new Promise((resolve) => {
    try {
      const maybePromise = ext.storage.local.remove(key, resolve);
      if (isPromiseLike(maybePromise)) {
        maybePromise.then(() => resolve()).catch(() => resolve());
      }
    } catch {
      resolve();
    }
  });
}

function alarmsGet(name) {
  return new Promise((resolve) => {
    try {
      const maybePromise = ext.alarms.get(name, resolve);
      if (isPromiseLike(maybePromise)) {
        maybePromise.then((alarm) => resolve(alarm ?? null)).catch(() => resolve(null));
      }
    } catch {
      resolve(null);
    }
  });
}

function alarmsClear(name) {
  try {
    const maybePromise = ext.alarms.clear(name);
    if (isPromiseLike(maybePromise)) {
      void maybePromise.catch(() => {});
    }
  } catch {
    // Ignore clear errors.
  }
}

function setPendingBadge() {
  pulseFrame = (pulseFrame + 1) % PULSE_FRAMES.length;
  if (typeof action.setBadgeText === "function") {
    action.setBadgeText({ text: PULSE_FRAMES[pulseFrame] });
  }
  if (typeof action.setBadgeBackgroundColor === "function") {
    action.setBadgeBackgroundColor({ color: "#6366f1" }); // primary
  }
}

function setDoneBadge() {
  if (typeof action.setBadgeText === "function") {
    action.setBadgeText({ text: "✓" });
  }
  if (typeof action.setBadgeBackgroundColor === "function") {
    action.setBadgeBackgroundColor({ color: "#22c55e" });
  }
}

function clearBadge() {
  if (typeof action.setBadgeText === "function") {
    action.setBadgeText({ text: "" });
  }
}

function openExtensionPageInTab(windowId) {
  const createOptions = { url: ext.runtime.getURL("index.html") };
  if (typeof windowId === "number" && windowId >= 0) {
    createOptions.windowId = windowId;
  }
  ext.tabs.create(createOptions);
}

async function openPopupOrFallback(windowId) {
  if (typeof action.openPopup === "function") {
    try {
      await action.openPopup();
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
  const data = await storageGetLocal("analyzing_assignment");
  const job = parseAnalyzingJob(data.analyzing_assignment);
  if (!job) {
    // Job was cleared by the popup (it finished while popup was open)
    alarmsClear(ALARM_NAME);
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
      await storageRemoveLocal("analyzing_assignment");
      alarmsClear(ALARM_NAME);
      setDoneBadge();
    }
    // 404 / other non-ok = still processing, keep polling
  } catch {
    // Network error — keep polling, don't surface as failure yet
  }
}

function ensurePollingAlarm() {
  ext.alarms.create(ALARM_NAME, {
    delayInMinutes: POLL_INTERVAL_MINUTES,
    periodInMinutes: POLL_INTERVAL_MINUTES,
  });
}

async function restorePollingIfNeeded() {
  const data = await storageGetLocal("analyzing_assignment");
  const job = parseAnalyzingJob(data.analyzing_assignment);

  if (!job) {
    clearBadge();
    return;
  }

  setPendingBadge();
  const existingAlarm = await alarmsGet(ALARM_NAME);
  if (!existingAlarm) {
    ensurePollingAlarm();
  }
}

// Storage change: start or stop polling based on analyzing_assignment presence
ext.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !("analyzing_assignment" in changes)) return;

  const newValue = changes.analyzing_assignment.newValue;

  if (newValue) {
    // Analysis started — begin polling loop
    setPendingBadge();
    ensurePollingAlarm();
  } else {
    // Cleared by popup (completed/errored while popup was open)
    alarmsClear(ALARM_NAME);
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
  await restorePollingIfNeeded();
});

void restorePollingIfNeeded();

// openPopup message (existing)
ext.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "openPopup") {
    void openPopupOrFallback(sender?.tab?.windowId);
  }
});
