import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    console.log('Checking session decision for:', sessionId);
    
    const response = await fetch(`https://verification.didit.me/v2/session/${sessionId}/decision/`, {
      method: 'GET',
      headers: {
        'X-Api-Key': process.env.DIDIT_API_KEY!,
        'Accept': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('Didit response status:', response.status);
    console.log('Didit response:', responseText);

    if (!response.ok) {
      console.error('Didit API error:', response.status, responseText);
      
      if (response.status === 404) {
        return res.status(404).json({ 
          error: 'Session not found',
          status: 'unknown'
        });
      }
      
      throw new Error(`Didit API error: ${response.status} - ${responseText}`);
    }

    let decision;
    try {
      decision = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error('Invalid response from Didit API');
    }
    
    console.log('Session decision:', decision);
    
    res.status(200).json({
      status: decision.status,
      result: decision.result,
      sessionId: sessionId,
      decision: decision
    });

  } catch (error) {
    console.error('Session decision error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get verification status',
      details: error instanceof Error ? error.stack : undefined
    });
  }
}