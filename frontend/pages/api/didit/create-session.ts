import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, userType } = req.body;
    
    // Create vendor data identifier
    const vendorData = `${userType}-${email}-${Date.now()}`;
    
    const response = await fetch('https://verification.didit.me/v2/session/', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.DIDIT_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow_id: process.env.DIDIT_WORKFLOW_ID!,
        callback: `${process.env.NEXT_PUBLIC_APP_URL}/verification-complete`,
        vendor_data: vendorData,
        metadata: {
          firstName,
          lastName,
          email,
          userType,
          timestamp: new Date().toISOString()
        },
        contact_details: {
          email: email,
          email_lang: "ar", // Arabic for Egypt
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Didit API error:', response.status, errorText);
      throw new Error(`Didit API error: ${response.status}`);
    }

    const session = await response.json();
    
    // Store session info in your database for tracking
    // await storeSessionInfo(vendorData, session.session_id);
    
    res.status(200).json({
      success: true,
      sessionId: session.session_id,
      sessionToken: session.session_token,
      sessionNumber: session.session_number,
      verificationUrl: session.url,
      status: session.status
    });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create verification session' 
    });
  }
}