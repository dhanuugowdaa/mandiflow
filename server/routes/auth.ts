import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { sendKisanOtpSms } from '../services/sms';
import { store } from '../store';
import { UserRole, UserSession } from '../../src/types';

export const authRouter = Router();

// In-memory OTP storage: phone -> { code, expiresAt }
const activeOtps: Map<string, { code: string; expiresAt: number }> = new Map();

authRouter.post('/login', (req: Request, res: Response) => {
  const { role, customName } = req.body as { role: UserRole; customName?: string };

  if (!role) {
    return res.status(400).json({ error: 'Role is required' });
  }

  const generatedToken = 'dpdp_' + crypto.randomBytes(16).toString('hex');

  const roleProfiles: Record<UserRole, Omit<UserSession, 'tokenSha256'>> = {
    farmer: {
      role: 'farmer',
      name: customName || 'Rameshwar Patil',
      userId: 'MH-NSK-FARM-442',
      organization: 'Pimpalgaon Farmer Cooperative',
      location: 'Nashik, Maharashtra',
      phone: '+91 98231 44021',
      avatarColor: '#10b981',
      clearanceLevel: 'LEVEL_1_FARMER',
      permittedDashboards: ['farmer'],
    },
    fpo: {
      role: 'fpo',
      name: customName || 'Sachin Rao',
      userId: 'MH-FPO-DIR-102',
      organization: 'Sahyadri Farmers Producer Co.',
      location: 'Dindori Cluster, Maharashtra',
      phone: '+91 94222 18903',
      avatarColor: '#38bdf8',
      clearanceLevel: 'LEVEL_2_FPO',
      permittedDashboards: ['fpo'],
    },
    enam: {
      role: 'enam',
      name: customName || 'S. K. Gupta',
      userId: 'ENAM-TRD-DEL-891',
      organization: 'National Agriculture Market Trading Desk',
      location: 'New Delhi Hub',
      phone: '+91 98110 33491',
      avatarColor: '#fbbf24',
      clearanceLevel: 'LEVEL_3_ENAM',
      permittedDashboards: ['enam'],
    },
    mandi: {
      role: 'mandi',
      name: customName || 'Sandeep Jadhav',
      userId: 'APMC-AZD-WB-04',
      organization: 'Azadpur APMC Mandi Board',
      location: 'Azadpur Mandi Gate 4, Delhi',
      phone: '+91 97180 55412',
      avatarColor: '#f43f5e',
      clearanceLevel: 'LEVEL_3_MANDI',
      permittedDashboards: ['mandi'],
    },
    truck: {
      role: 'truck',
      name: customName || 'Sukhdev Singh',
      userId: 'KSR-LOG-DRV-771',
      organization: 'Navdurga Cold Freight Lines',
      location: 'Enroute NH-48 Corridor',
      phone: '+91 98201 99014',
      avatarColor: '#a78bfa',
      clearanceLevel: 'LEVEL_2_TRUCK',
      permittedDashboards: ['truck'],
    },
    admin: {
      role: 'admin',
      name: customName || 'Dr. Ananya Sen',
      userId: 'APEX-AUD-IND-001',
      organization: 'Directorate of Marketing & Inspection (Govt of India)',
      location: 'Krishi Bhawan, New Delhi',
      phone: '+91 98100 00192',
      avatarColor: '#f59e0b',
      clearanceLevel: 'LEVEL_4_APEX_ADMIN',
      permittedDashboards: ['admin'],
    },
  };

  const profile = roleProfiles[role];
  if (!profile) {
    return res.status(400).json({ error: 'Unknown role' });
  }

  const session: UserSession = {
    ...profile,
    tokenSha256: generatedToken,
  };

  store.addAuditLog(
    'USER_AUTHENTICATION_SUCCESS',
    `User ${session.name} authenticated as ${role.toUpperCase()} (ID: ${session.userId}) with cryptographic token ${generatedToken.substring(0, 12)}...`,
    'DPDP_ACT_2023',
    session.name,
    role
  );

  return res.json({ success: true, session });
});

authRouter.post('/otp/send', async (req: Request, res: Response) => {
  const { phone } = req.body as { phone: string };
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

  activeOtps.set(cleanPhone, {
    code: otpCode,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  const smsResult = await sendKisanOtpSms(cleanPhone, otpCode);

  return res.json({
    success: true,
    message: smsResult.message,
    provider: smsResult.provider,
    demoOtp: otpCode, // Provided for instant demo testing
  });
});

authRouter.post('/otp/verify', (req: Request, res: Response) => {
  const { phone, otp, role } = req.body as { phone: string; otp: string; role: UserRole };
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);

  // Standard demo code accepts 729104 or actual generated code
  const stored = activeOtps.get(cleanPhone);
  const isValid = otp === '729104' || (stored && stored.code === otp && Date.now() <= stored.expiresAt);

  if (!isValid) {
    return res.status(400).json({ success: false, error: 'Invalid or expired OTP code' });
  }

  // OTP verified, return session
  const generatedToken = 'dpdp_' + crypto.randomBytes(16).toString('hex');
  const session: UserSession = {
    role: role || 'farmer',
    name: 'Authenticated Kisan User',
    userId: `KISAN-${cleanPhone}`,
    organization: 'National APMC Network',
    location: 'India Agri Node',
    phone: `+91 ${cleanPhone}`,
    avatarColor: '#10b981',
    clearanceLevel: 'LEVEL_1_FARMER',
    permittedDashboards: [role || 'farmer'],
    tokenSha256: generatedToken,
  };

  store.addAuditLog(
    'OTP_AUTHENTICATION_SUCCESS',
    `Kisan mobile +91 ${cleanPhone} authenticated via SMS OTP code. Access granted to ${role.toUpperCase()} dashboard.`,
    'DPDP_ACT_2023',
    session.name,
    role
  );

  return res.json({ success: true, session });
});
