import { useEffect, useState } from "react";
import { getExtensionApi, hasBrowserNamespace, isPromiseLike } from "@/lib/extensionApi";

interface CanvasAssignmentInfo {
  courseId: string;
  assignmentId: string;
}

export function useCanvasUrl() {
  const [assignmentInfo, setAssignmentInfo] = useState<CanvasAssignmentInfo | null>(null);

  useEffect(() => {
    const canvasBaseUrl = localStorage.getItem("canvasBaseUrl");
    if (!canvasBaseUrl) return;

    const extensionApi = getExtensionApi();
    const queryTabs = extensionApi?.tabs?.query;

    if (queryTabs) {
      if (hasBrowserNamespace()) {
        const maybePromise = queryTabs({ active: true, currentWindow: true });
        if (isPromiseLike<Array<{ url?: string }>>(maybePromise)) {
          void maybePromise
            .then((tabs) => {
              const activeTab = tabs[0];
              if (activeTab?.url) {
                checkUrl(activeTab.url, canvasBaseUrl);
                return;
              }
              checkUrl(window.location.href, canvasBaseUrl);
            })
            .catch(() => {
              // ignore and fallback below
              checkUrl(window.location.href, canvasBaseUrl);
            });
          return;
        }
      }

      queryTabs({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs?.[0];
        if (activeTab?.url) {
          checkUrl(activeTab.url, canvasBaseUrl);
          return;
        }
        checkUrl(window.location.href, canvasBaseUrl);
      });
      return;
    }

    // Fallback for local development
    checkUrl(window.location.href, canvasBaseUrl);
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
