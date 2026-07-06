import type { NotificationProvider } from "./types";

export const browserNotificationProvider: NotificationProvider = {
  id: "browser",
  name: "Browser Notification",

  isAvailable() {
    return typeof window !== "undefined" && "Notification" in window;
  },

  async requestPermission() {
    if (!this.isAvailable()) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  },

  async send(message) {
    if (!this.isAvailable() || Notification.permission !== "granted") return;
    new Notification(message.title, { body: message.body, tag: message.taskId });
  },
};
