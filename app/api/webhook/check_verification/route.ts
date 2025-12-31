import { NextRequest, NextResponse } from 'next/server';

// Re-export from confirm_verification for backwards compatibility
// This endpoint is just an alias for checking verification status

/**
 * GET /api/webhook/check_verification
 * 
 * Check if a phone number has been verified.
 * This is a convenience endpoint that polls the verification status.
 * 
 * Query parameters:
 * - phone: The phone number to check (with country code)
 * 
 * Response:
 * {
 *   "verified": boolean,
 *   "timestamp": number | null
 * }
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
  
  // Forward to the confirm_verification endpoint
  const confirmUrl = new URL('/api/webhook/confirm_verification', request.url);
  confirmUrl.searchParams.set('phone', phone);
  
  try {
    const response = await fetch(confirmUrl.toString(), {
      method: 'GET',
      headers: request.headers,
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    // If internal fetch fails, return not verified
    return NextResponse.json({
      verified: false,
      timestamp: null,
    });
  }
}
