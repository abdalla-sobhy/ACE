import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Creating Didit session...');
    
    const { firstName, lastName, email } = req.body || {};
    
    const response = await fetch('https://verification.didit.me/v2/session/', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.DIDIT_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow_id: process.env.DIDIT_WORKFLOW_ID,
        callback: `${process.env.NEXT_PUBLIC_APP_URL}/verification-complete`,
        vendor_data: `user-${Date.now()}`,
        metadata: {
          firstName,
          lastName,
          email,
          timestamp: new Date().toISOString()
        },
        contact_details: {
          email: email,
          email_lang: "ar",
          // phone: phoneNumber
        }
      })
    });

    const responseText = await response.text();
    console.log('Didit response status:', response.status);
    
    if (!response.ok) {
      console.error('Didit error:', responseText);
      throw new Error(`Didit API error: ${response.status} - ${responseText}`);
    }

    const session = JSON.parse(responseText);
    console.log('Session created:', session);
    
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
      error: error instanceof Error ? error.message : 'Failed to create verification session' 
    });
  }
}