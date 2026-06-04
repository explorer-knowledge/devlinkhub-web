/**
 * Simulated Backend API Service
 * In a real application, these functions would perform fetch/axios calls to your backend.
 */

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
  status: "success" | "failed"; // For simulation purposes
}

export const API = {
  /**
   * Simulates saving registration data and returning a temporary registration ID
   */
  async saveRegistration(payload: RegisterPayload): Promise<{ success: boolean; regId: string }> {
    await delay(1200); // Simulate network latency
    const regId = `DLH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    return { success: true, regId };
  },

  /**
   * Simulates validating a promo code
   */
  async validatePromoCode(code: string): Promise<PromoResponse> {
    await delay(800);
    const upperCode = code.trim().toUpperCase();
    
    const PROMO_MAP: Record<string, number> = {
      EARLYBIRD: 100,
      DEVLINK10: 50,
      CORETEAM: 349,
      PARTNER25: 87,
      CAMPUSAMB: 100,
    };

    if (PROMO_MAP[upperCode]) {
      return { valid: true, discountAmount: PROMO_MAP[upperCode], message: "Promo applied successfully!" };
    }
    return { valid: false, discountAmount: 0, message: "Invalid or expired promo code." };
  },

  /**
   * Simulates creating an order on the backend (e.g., Razorpay Order API)
   */
  async createOrder(amount: number, regId: string): Promise<OrderResponse> {
    await delay(1000);
    const orderId = `order_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    return { success: true, orderId, amount };
  },

  /**
   * Simulates verifying the Razorpay payment signature on the backend
   */
  async verifyPayment(payload: VerifyPaymentPayload): Promise<{ success: boolean; message: string }> {
    await delay(1500);
    
    // In our simulation, if the status passed is 'failed', we reject it
    if (payload.status === "failed") {
      return { success: false, message: "Payment verification failed or was cancelled." };
    }

    return { success: true, message: "Payment verified successfully." };
  }
};
