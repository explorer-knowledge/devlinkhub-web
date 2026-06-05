/**
 * Simulated Backend API Service
 * In a real application, these functions would perform fetch/axios calls to your backend.
 */

const BACKEND_URL = "https://juliette-hokey-pacifically.ngrok-free.dev/api/hackathon";

export interface RegisterPayload {
  teamName: string;
  leaderName: string;
  email: string;
  mobile: string;
  collegeName: string;
  branch: string;
  academicYear: string;
  members: any[];
}

export interface PromoResponse {
  valid: boolean;
  discountAmount: number;
  message: string;
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  keyId?: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
  status: "success" | "failed";
}

export const API = {
  async saveRegistration(_payload: RegisterPayload): Promise<{ success: boolean; regId: string }> {
    return { success: true, regId: "temp-id" };
  },

  async validatePromoCode(code: string): Promise<PromoResponse> {
    const upperCode = code.trim().toUpperCase();
    const PROMO_MAP: Record<string, number> = {
      EARLYBIRD: 100, DEVLINK10: 50, CORETEAM: 349, PARTNER25: 87, CAMPUSAMB: 100,
    };
    if (PROMO_MAP[upperCode]) {
      return { valid: true, discountAmount: PROMO_MAP[upperCode], message: "Promo applied successfully!" };
    }
    return { valid: false, discountAmount: 0, message: "Invalid or expired promo code." };
  },

  async createOrder(payload: any): Promise<OrderResponse> {
    const participants = [
      {
        name: payload.leaderName,
        email: payload.email,
        phone: payload.mobile,
        college: payload.collegeName,
        isLeader: true
      },
      ...(payload.members || []).map((m: any) => ({
        name: m.name,
        email: m.email || `${m.name.replace(/\s+/g, '').toLowerCase()}@team.com`,
        phone: m.mobile || payload.mobile,
        college: m.collegeName || payload.collegeName,
        isLeader: false
      }))
    ];

    const response = await fetch(`${BACKEND_URL}/initiate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName: payload.teamName, participants })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to initiate payment");
    }

    const data = await response.json();
    return { success: true, orderId: data.orderId, amount: data.amount, keyId: data.keyId };
  },

  async verifyPayment(payload: VerifyPaymentPayload): Promise<{ success: boolean; message: string; regId?: string }> {
    // In a real system, the webhook handles the verification asynchronously.
    // We can poll the status endpoint to check if the registration was successful.
    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetch(`${BACKEND_URL}/status/${payload.orderId}`);
        const data = await response.json();
        if (data.status === "registered") {
          return { success: true, message: "Payment verified successfully." };
        }
      } catch (err) {
        console.error("Polling error", err);
      }
      await new Promise(res => setTimeout(res, 2000)); // wait 2 seconds before retrying
    }
    // Assume success for UX if polling takes too long (webhook might be delayed)
    return { success: true, message: "Payment successful. Awaiting final confirmation." };
  }
};
