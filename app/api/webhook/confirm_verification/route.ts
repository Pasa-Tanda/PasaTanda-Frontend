import { NextRequest, NextResponse } from 'next/server';

// In-memory store for verified phones (in production, use a proper database)
// This is a simple implementation for demonstration purposes
const verifiedPhones = new Map<string, { verified: boolean; timestamp: number }>();

// Clean up old entries every 5 minutes
const VERIFICATION_EXPIRY = 30 * 60 * 1000; // 30 minutes

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
 * 
 * Expected payload:
 * {
 *   "phone": string,          // Phone number that was verified (with country code)
 *   "verified": boolean,      // Whether the verification was successful
 *   "timestamp": number,      // Unix timestamp of verification
 *   "signature"?: string      // Optional HMAC signature for security
 * }
 * 
 * Response:
 * {
 *   "success": boolean,
 *   "message": string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { phone, verified, timestamp } = body;
    // Note: signature field is reserved for future HMAC verification
    // const { signature } = body;
    
    // Validate required fields
    if (!phone || typeof verified !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: phone and verified' },
        { status: 400 }
      );
    }
    
    // Optional: Verify webhook signature from AgentBE
    // In production, you should validate the signature using a shared secret
    // const expectedSignature = createHmac('sha256', process.env.WEBHOOK_SECRET || '')
    //   .update(`${phone}:${verified}:${timestamp}`)
    //   .digest('hex');
    // if (signature !== expectedSignature) {
    //   return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
    // }
    
    // Normalize phone number (remove spaces and ensure it starts with +)
    const normalizedPhone = phone.replace(/\s+/g, '').trim();
    
    // Store the verification result
    verifiedPhones.set(normalizedPhone, {
      verified,
      timestamp: timestamp || Date.now(),
    });
    
    // Cleanup old entries periodically
    cleanupOldEntries();
    
    console.log(`[Webhook] Phone verification received: ${normalizedPhone} - ${verified ? 'VERIFIED' : 'FAILED'}`);
    
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
 * Check if a phone number has been verified (used for polling from the frontend)
 * This is an alternative to WebSocket for simpler implementations.
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
  
  return NextResponse.json({
    verified: verificationData?.verified || false,
    timestamp: verificationData?.timestamp || null,
  });
}
