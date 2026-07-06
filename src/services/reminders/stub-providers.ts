import type { NotificationProvider } from "./types";

// Future channels — interface is wired up now so adding a real implementation
// later doesn't require touching the engine or any screen.
function createStubProvider(id: string, name: string): NotificationProvider {
  return {
    id,
    name,
    isAvailable: () => false,
    async send() {
      throw new Error(`${name} provider is not implemented yet.`);
    },
  };
}

export const emailProvider = createStubProvider("email", "Email");
export const whatsappProvider = createStubProvider("whatsapp", "WhatsApp");
export const telegramProvider = createStubProvider("telegram", "Telegram");
export const smsProvider = createStubProvider("sms", "SMS");
export const firebasePushProvider = createStubProvider("firebase_push", "Firebase Push");
