import { decrypt } from "./crypto";
import { prisma } from "./prisma";

export async function getCanvasCredentials(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.canvasBaseUrl || !user?.canvasToken) return null;
  return { baseUrl: user.canvasBaseUrl, apiKey: decrypt(user.canvasToken) };
}

export async function canvasFetch(baseUrl: string, apiKey: string, path: string) {
  const res = await fetch(`${baseUrl}/api/v1${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Canvas API error: ${res.status}`);
  return res.json();
}
