// lib/lineAuth.js
export const LINE_LOGIN_URL = 'https://access.line.me/oauth2/v2.1/authorize';
export const LINE_TOKEN_URL = 'https://api.line.me/oauth2/v2.1/token';
export const LINE_PROFILE_URL = 'https://api.line.me/v2/profile';

export const getLineLoginUrl = () => {
  const channelId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID;
  const redirectUri = `${window.location.origin}/auth/line/callback`;
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state in sessionStorage for verification
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('line_oauth_state', state);
  }
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: channelId,
    redirect_uri: redirectUri,
    state: state,
    scope: 'profile openid email'
  });
  
  return `${LINE_LOGIN_URL}?${params.toString()}`;
};

export const exchangeCodeForToken = async (code, state) => {
  try {
    // Verify state
    const storedState = sessionStorage.getItem('line_oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }
    
    const response = await fetch('/api/auth/line/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: `${window.location.origin}/auth/line/callback`
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

export const getLineProfile = async (accessToken) => {
  try {
    const response = await fetch('/api/auth/line/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get Line profile');
    }
    
    const profile = await response.json();
    return profile;
  } catch (error) {
    console.error('Error getting Line profile:', error);
    throw error;
  }
};

