import { useEffect, useState } from "react";

interface CanvasAssignmentInfo {
  courseId: string;
  assignmentId: string;
}

export function useCanvasUrl() {
  const [assignmentInfo, setAssignmentInfo] = useState<CanvasAssignmentInfo | null>(null);

  useEffect(() => {
    const canvasBaseUrl = localStorage.getItem("canvasBaseUrl");
    if (!canvasBaseUrl) return;

    // We use chrome.tabs to get the active tab's URL
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.url) {
          checkUrl(activeTab.url, canvasBaseUrl);
        }
      });
    } else {
      // Fallback for local development
      checkUrl(window.location.href, canvasBaseUrl);
    }
  }, []);

  const checkUrl = (currentUrl: string, baseUrl: string) => {
    try {
      if (!currentUrl.startsWith(baseUrl)) return;

      const urlObj = new URL(currentUrl);
      
      // Canvas assignment URLs look like: /courses/19394/assignments/239868
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      
      if (
        pathParts.length >= 4 &&
        pathParts[0] === "courses" &&
        pathParts[2] === "assignments"
      ) {
        setAssignmentInfo({
          courseId: pathParts[1],
          assignmentId: pathParts[3],
        });
      }
    } catch (err) {
      console.error("Error parsing URL:", err);
    }
  };

  return { assignmentInfo };
}
