import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/razorpay.css";

interface RazorpayModalProps {
  isOpen: boolean;
  amount: number;
  email: string;
  contact: string;
  onSuccess: (paymentId: string, signature: string) => void;
  onClose: () => void;
}

export default function RazorpayModal({ isOpen, amount, email, contact, onSuccess, onClose }: RazorpayModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate gateway processing delay
    setTimeout(() => {
      setIsProcessing(false);
      const fakePaymentId = `pay_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
      const fakeSignature = `sig_${Math.random().toString(36).substring(2, 15)}`;
      onSuccess(fakePaymentId, fakeSignature);
    }, 2500);
  };

  return (
    <div className="rzp-overlay">
      <motion.div 
        className="rzp-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <button className="rzp-close" onClick={onClose} disabled={isProcessing}>&times;</button>
        
        <div className="rzp-header">
          <div className="rzp-header-info">
            <h2>DevLinkHub Ignite 2026</h2>
            <p>{email} | {contact}</p>
          </div>
          <div className="rzp-header-amount">
            ₹{amount}
          </div>
        </div>

        <div className="rzp-body">
          <div className="rzp-test-mode-banner">
            This is a simulated Razorpay Test Environment. No real money will be deducted.
          </div>

          <div className="rzp-input-group">
            <label>Card Number</label>
            <input type="text" className="rzp-input" defaultValue="4111 1111 1111 1111" disabled={isProcessing} />
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <div className="rzp-input-group" style={{ flex: 1 }}>
              <label>Expiry</label>
              <input type="text" className="rzp-input" defaultValue="12/28" disabled={isProcessing} />
            </div>
            <div className="rzp-input-group" style={{ flex: 1 }}>
              <label>CVV</label>
              <input type="password" className="rzp-input" defaultValue="123" disabled={isProcessing} />
            </div>
          </div>
        </div>

        <div className="rzp-footer">
          <button className="rzp-pay-btn" onClick={handlePay} disabled={isProcessing}>
            {isProcessing ? (
              <><span className="rzp-loader"></span> Processing...</>
            ) : (
              `Pay ₹${amount}`
            )}
          </button>
          <div className="rzp-powered">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#3399cc"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            Secured by Simulated Gateway
          </div>
        </div>
      </motion.div>
    </div>
  );
}
