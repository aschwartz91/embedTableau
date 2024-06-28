// src/app/api/getToken/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    console.log('API route called');
    
    const secret = process.env.TABLEAU_SECRET;
    const clientId = process.env.TABLEAU_CLIENT_ID;
    const username = 'external\\schwartz@copilot.com';
    const email = 'schwartz@copilot.com';

    console.log('Environment variables:', { 
      secret: secret ? 'Set' : 'Not set',
      clientId: clientId ? 'Set' : 'Not set'
    });

    if (!secret || !clientId) {
      throw new Error('Missing required environment variables');
    }

    const payload = {
      iss: clientId,
      exp: Math.floor(Date.now() / 1000) + 60 * 5,
      jti: Math.random().toString(36).substring(2),
      aud: 'tableau',
      sub: username,
      scp: ['tableau:views:embed', 'tableau:content:read'],
      email: email
    };

    const token = jwt.sign(payload, secret);
    console.log('Token generated successfully');

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate token' }, { status: 500 });
  }
}