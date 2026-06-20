"use server";

/**
 * Sends an SMS using the Termii API.
 * Ensure TERMII_API_KEY and TERMII_SENDER_ID are defined in your .env file.
 */
export async function sendSms(phoneNumber: string, message: string) {
  // 1. DEVELOPMENT SAFETY: Log to console instead of sending real money/messages
  if (process.env.NODE_ENV === 'development') {
    console.log("--- [DEV MODE] SMS SIMULATED ---");
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    return { success: true, status: "SIMULATED" };
  }

  // 2. PRODUCTION: Call Termii API
  const apiKey = process.env.TERMII_API_KEY;
  const senderId = process.env.TERMII_SENDER_ID || "HillCity";

  if (!apiKey) {
    console.error("SMS Error: Missing TERMII_API_KEY");
    return { success: false, error: "Configuration error" };
  }

  try {
    const response = await fetch("https://api.termii.com/api/sms/send", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json" 
      },
      body: JSON.stringify({
        api_key: apiKey,
        to: phoneNumber,
        from: senderId,
        sms: message,
        type: "plain",
        channel: "generic",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Termii API Error:", data);
      return { success: false, error: data.message || "Failed to send SMS" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("SMS Network Error:", error);
    return { success: false, error: "Network failure" };
  }
}