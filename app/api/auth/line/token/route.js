// app/api/auth/line/token/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { code, redirect_uri } = await request.json();
    
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
        client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
        client_secret: process.env.LINE_CHANNEL_SECRET,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Line token exchange error:', errorData);
      return NextResponse.json(
        { error: 'Failed to exchange code for token' },
        { status: 400 }
      );
    }
    
    const tokenData = await tokenResponse.json();
    return NextResponse.json(tokenData);
    
  } catch (error) {
    console.error('Line token API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

