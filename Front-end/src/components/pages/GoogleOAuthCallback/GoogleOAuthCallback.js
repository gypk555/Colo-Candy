import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { exchangeGoogleCode } from '../../../services/authService';
import { userAtom } from '../../../atoms/authAtoms';

const GoogleOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      console.log('🔐 GoogleOAuthCallback component mounted');
      console.log('📝 Code:', code ? 'Received' : 'Not received');
      console.log('❌ Error:', error || 'None');

      if (error) {
        console.error('❌ Google OAuth error from Google:', error);
        const errorMsg = error === 'access_denied'
          ? 'You denied permission to Colo-Candy app'
          : `Google login failed: ${error}`;
        navigate(`/register?error=${encodeURIComponent(errorMsg)}`);
        return;
      }

      if (!code) {
        console.error('❌ No authorization code received');
        navigate('/register?error=No authorization code received');
        return;
      }

      try {
        console.log('🔄 Sending code to backend...');
        // Send code to backend to exchange for user info
        const result = await exchangeGoogleCode(code);

        console.log('✅ Backend response:', result);

        if (result.success) {
          console.log('✅ OAuth successful! User:', result.user?.email);
          // Set user in Jotai atom
          setUser(result.user);

          // Redirect to home page after a short delay
          setTimeout(() => {
            console.log('🏠 Redirecting to home page...');
            navigate('/');
          }, 500);
        } else {
          console.error('❌ Backend returned error:', result.message);
          navigate(`/register?error=${encodeURIComponent(result.message)}`);
        }
      } catch (error) {
        console.error('❌ OAuth callback error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'OAuth failed';
        navigate(`/register?error=${encodeURIComponent(errorMsg)}`);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Signing you in...</h2>
        <p className="text-gray-600 mb-8">Please wait while we complete your authentication</p>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500">This may take a few seconds</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
