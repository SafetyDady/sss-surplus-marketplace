// app/api/auth/line/profile/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { access_token } = await request.json();
    
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });
    
    if (!profileResponse.ok) {
      const errorData = await profileResponse.text();
      console.error('Line profile fetch error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch Line profile' },
        { status: 400 }
      );
    }
    
    const profileData = await profileResponse.json();
    return NextResponse.json(profileData);
    
  } catch (error) {
    console.error('Line profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

