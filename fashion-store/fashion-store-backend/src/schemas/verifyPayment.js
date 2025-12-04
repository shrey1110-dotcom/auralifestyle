// src/schemas/verifyPayment.js
import { z } from 'zod';

/**
 * VerifyPaymentSchema
 * Expected shape:
 * {
 *   razorpay_order_id: string,
 *   razorpay_payment_id: string,
 *   razorpay_signature: string, // or "skip" in dev
 *   meta: {
 *     items: [{ id|sku, title|name, price, qty, size?, color?, image? }],
 *     sub: number,
 *     gst: number,
 *     total: number,
 *     address: { fullName?, email?, phone?, address1?, city?, state?, pincode? },
 *     customerId?: string,
 *     display_order_id?: string,
 *     rzpAmount?: number,
 *     rzpCurrency?: string
 *   }
 * }
 */
const ItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  sku: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  price: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().nonnegative().optional()),
  qty: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().int().positive().optional()),
  size: z.string().optional(),
  color: z.string().optional(),
  image: z.string().optional(),
});

const AddressSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
});

export const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'razorpay_order_id required'),
  razorpay_payment_id: z.string().min(1, 'razorpay_payment_id required'),
  razorpay_signature: z.string().min(1, 'razorpay_signature required'),
  meta: z.object({
    items: z.array(ItemSchema).optional().default([]),
    sub: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().nonnegative().optional()).default(0),
    gst: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().nonnegative().optional()).default(0),
    total: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().nonnegative().optional()).default(0),
    address: AddressSchema.optional().default({}),
    customerId: z.string().optional(),
    display_order_id: z.string().optional(),
    rzpAmount: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional()),
    rzpCurrency: z.string().optional(),
  }).optional().default({}),
});

// export default for compatibility if someone imports default
export default VerifyPaymentSchema;
