import { auth } from 'src/auth/lucia';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  console.log('logout request');
  const authRequest = auth.handleRequest({ request, cookies });
  // check if user is authenticated
  const session = await authRequest.validate();
  console.log('session logout', session);
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);
  // delete session cookie
  authRequest.setSession(null);
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/login', // redirect to login page
    },
  });
};
