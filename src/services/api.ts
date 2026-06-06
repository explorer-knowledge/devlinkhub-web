/**
 * Simulated Backend API Service
 * In a real application, these functions would perform fetch/axios calls to your backend.
 */

export const BACKEND_URL = `http://localhost:10003/api/hackathon`;

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
  discountAmount: number;   // discount in paise
  finalAmountPaise?: number; // final amount in paise after discount
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
    const response = await fetch(`${BACKEND_URL}/promo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ promoCode: code.trim().toUpperCase() }),
    });

    if (!response.ok) {
      // Rate limited (429) or server error
      const err = await response.json().catch(() => ({}));
      return { valid: false, discountAmount: 0, message: err.error || "Could not validate code. Try again later." };
    }

    const data = await response.json();
    return {
      valid: data.valid,
      discountAmount: data.valid ? data.finalAmountPaise : 0,  // finalAmountPaise from backend
      message: data.message,
    };
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
      headers: { 
	    "Content-Type": "application/json",
	    "ngrok-skip-browser-warning": "true" 
      },
      body: JSON.stringify({ 
        teamName: payload.teamName, 
        participants,
        promoCode: payload.appliedPromo ?? undefined,
      })

    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to initiate payment");
    }

    const data = await response.json();
    return { success: true, orderId: data.orderId, amount: data.amount, keyId: data.keyId };
  },


  

  async verifyPayment(payload: VerifyPaymentPayload): Promise<{ success: boolean; message: string; regId?: string }> {
    const MAX_POLLS = 20;
    const POLL_INTERVAL = 3000; // 3 seconds

    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise(res => setTimeout(res, POLL_INTERVAL));
      try {
        const response = await fetch(`${BACKEND_URL}/status/${payload.orderId}`, {
          headers: { 
            "ngrok-skip-browser-warning": "true"
          },
        });
        const data = await response.json();
        if (data.status === "registered") {
          return { success: true, message: "Payment verified successfully.", regId: data.team?.id };
        }
        // status === "pending" or "not_found" → keep polling
      } catch (err) {
        console.error("Polling error", err);
      }
    }

    // Webhook did not confirm within 60 seconds
    return { success: false, message: "Payment confirmation timed out. Please contact support with your payment ID and leader details." };
  }

};


