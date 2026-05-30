// src/lib/sms.ts
export async function sendTermiiSms(phoneNumber: string, message: string) {
  const response = await fetch("https://api.termii.com/api/sms/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.TERMII_API_KEY}`,
    },
    body: JSON.stringify({
      to: phoneNumber,
      from: "HillCity", 
      sms: message,
      type: "plain",
      channel: "dnd", 
      api_key: process.env.TERMII_API_KEY,
    }),
  });

  return await response.json();
}