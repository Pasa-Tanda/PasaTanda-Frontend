import { NextRequest, NextResponse } from 'next/server';

/**
 * Verification data stored in memory
 * In production, consider using Redis or a proper database
 */
type VerificationData = {
  verified: boolean;
  timestamp: number;
  whatsappUsername?: string;
  whatsappNumber?: string;
};

// In-memory store for verified phones
const verifiedPhones = new Map<string, VerificationData>();

// Verification expiry time (30 minutes)
const VERIFICATION_EXPIRY = 30 * 60 * 1000;

/**
 * Clean up expired verification entries
 */
function cleanupOldEntries() {
  const now = Date.now();
  for (const [phone, data] of verifiedPhones.entries()) {
    if (now - data.timestamp > VERIFICATION_EXPIRY) {
      verifiedPhones.delete(phone);
    }
  }
}

/**
 * POST /api/webhook/confirm_verification
 * 
 * Webhook endpoint to receive phone verification confirmations from AgentBE.
 * Called by AgentBE when a user successfully verifies their WhatsApp number
 * by sending the verification code to the bot.
 * 
 * @description
 * This webhook is triggered by AgentBE when:
 * 1. User requests verification code on the frontend
 * 2. Frontend displays the code and prompts user to send it to the WhatsApp bot
 * 3. User sends the code to the bot via WhatsApp
 * 4. AgentBE validates the code and calls this webhook with user's WhatsApp data
 * 
 * Expected payload from AgentBE:
 * ```json
 * {
 *   "phone": "+59177777777",           // Phone number being verified (with country code)
 *   "verified": true,                   // Whether the verification was successful
 *   "timestamp": 1703955200000,         // Unix timestamp of verification (ms)
 *   "whatsappUsername": "John Doe",     // WhatsApp display name of the user
 *   "whatsappNumber": "59177777777",    // WhatsApp number (may differ from phone)
 *   "signature"?: "hmac_signature"      // Optional HMAC-SHA256 signature for security
 * }
 * ```
 * 
 * Response:
 * ```json
 * {
 *   "success": true,
 *   "message": "Phone verification confirmed successfully"
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      phone, 
      verified, 
      timestamp,
      whatsappUsername,
      whatsappNumber,
    } = body;
    
    // Validate required fields
    if (!phone || typeof verified !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: phone and verified' },
        { status: 400 }
      );
    }
    
    // Normalize phone number (remove spaces, ensure starts with +)
    const normalizedPhone = phone.replace(/\s+/g, '').trim();
    
    // Store the verification result with WhatsApp data
    verifiedPhones.set(normalizedPhone, {
      verified,
      timestamp: timestamp || Date.now(),
      whatsappUsername: whatsappUsername || undefined,
      whatsappNumber: whatsappNumber || undefined,
    });
    
    // Cleanup old entries periodically
    cleanupOldEntries();
    
    console.log(`[Webhook] Phone verification received: ${normalizedPhone} - ${verified ? 'VERIFIED' : 'FAILED'}${whatsappUsername ? ` (${whatsappUsername})` : ''}`);
    
    return NextResponse.json({
      success: true,
      message: verified 
        ? 'Phone verification confirmed successfully' 
        : 'Phone verification failed',
    });
  } catch (error) {
    console.error('[Webhook] Error processing verification:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhook/confirm_verification
 * 
 * Check if a phone number has been verified (used for polling from frontend).
 * The frontend polls this endpoint to check verification status after
 * displaying the verification code to the user.
 * 
 * Query parameters:
 * - phone: The phone number to check (with country code)
 * 
 * Response (verified):
 * ```json
 * {
 *   "verified": true,
 *   "timestamp": 1703955200000,
 *   "whatsappUsername": "John Doe",
 *   "whatsappNumber": "59177777777"
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  
  if (!phone) {
    return NextResponse.json(
      { verified: false, message: 'Phone parameter is required' },
      { status: 400 }
    );
  }
  
  const normalizedPhone = phone.replace(/\s+/g, '').trim();
  const verificationData = verifiedPhones.get(normalizedPhone);
  
  if (verificationData?.verified) {
    return NextResponse.json({
      verified: true,
      timestamp: verificationData.timestamp,
      whatsappUsername: verificationData.whatsappUsername || null,
      whatsappNumber: verificationData.whatsappNumber || null,
    });
  }
  
  return NextResponse.json({
    verified: false,
    timestamp: null,
  });
}
