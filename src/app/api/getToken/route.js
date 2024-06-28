// src/app/api/getToken/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const secret = process.env.TABLEAU_SECRET;
    const clientId = process.env.TABLEAU_CLIENT_ID;
    const username = process.env.TABLEAU_USERNAME;

    if (!secret || !clientId || !username) {
      throw new Error('Missing required environment variables');
    }

    const payload = {
      iss: clientId,
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
      jti: Math.random().toString(36).substring(2),
      aud: 'tableau',
      sub: username,
      scp: ['tableau:views:embed'],
    };

    const token = jwt.sign(payload, secret);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}