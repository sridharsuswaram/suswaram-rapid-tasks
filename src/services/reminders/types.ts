export interface NotificationMessage {
  taskId: string;
  title: string;
  body: string;
}

// Any future channel (Email, WhatsApp, Telegram, SMS, Firebase Push) implements
// this same shape — the engine doesn't need to change to support a new one.
export interface NotificationProvider {
  readonly id: string;
  readonly name: string;
  isAvailable(): boolean;
  requestPermission?(): Promise<boolean>;
  send(message: NotificationMessage): Promise<void>;
}

export interface ReminderEngine {
  start(): void;
  stop(): void;
}
