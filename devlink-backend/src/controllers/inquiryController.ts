import { Request, Response } from "express";
import prisma from "../db/prismaInstance.js";

// ─── GET /api/inquiries ──────────────────────────────────────────────────────

export const getInquiries = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dbInquiries = await prisma.inquiry.findMany({
      include: { replies: true },
      orderBy: { timestamp: "desc" },
    });
    res.json(dbInquiries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/inquiries/:id ──────────────────────────────────────────────────

export const getInquiryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: req.params.id },
      include: { replies: true },
    });
    if (!inquiry) {
      res.status(404).json({ error: "Inquiry not found" });
      return;
    }
    res.json(inquiry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/inquiries ─────────────────────────────────────────────────────

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, category, subject, message, organization } = req.body;
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        category: category.toUpperCase(),
        subject: subject || `${category} Inquiry`,
        message,
        organization: organization || "",
        status: "New",
      },
    });
    res.status(201).json(inquiry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/inquiries/:id/status ──────────────────────────────────────────

export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const inquiry = await prisma.inquiry.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(inquiry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/inquiries/:id/reply ──────────────────────────────────────────

export const replyToInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sender, text } = req.body;
    const reply = await prisma.inquiryReply.create({
      data: { inquiryId: req.params.id, sender, text },
    });
    res.status(201).json(reply);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── DELETE /api/inquiries/:id ───────────────────────────────────────────────

export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.inquiry.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
