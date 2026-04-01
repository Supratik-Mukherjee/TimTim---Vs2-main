import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  updateProfile,
  signOut
} from 'firebase/auth';
import { useAuth } from '../AuthContext';

export default function Login() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [method, setMethod] = useState('email'); // 'email' | 'phone'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  const recaptchaContainerRef = useRef(null);

  useEffect(() => {
    if (!window.recaptchaVerifier && method === 'phone' && recaptchaContainerRef.current) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, { size: 'normal' });
    }
  }, [method]);

  const showMsg = (text, type = 'error') => setMsg({ text, type });
  const clearMsg = () => setMsg({ text: '', type: '' });

  const handleEmailSubmit = async () => {
    if (!email || !password) return showMsg('Please enter your email and password.');
    setLoading(true);
    clearMsg();
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
      }
      showMsg('Success! Redirecting…', 'success');
      setTimeout(() => navigate('/'), 1000);
    } catch (e) {
      setLoading(false);
      const msgs = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      showMsg(msgs[e.code] || 'Something went wrong. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    clearMsg();
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showMsg('Signed in with Google! Redirecting…', 'success');
      setTimeout(() => navigate('/'), 1000);
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') showMsg('Google sign-in failed. Please try again.');
    }
  };

  const handleSendOTP = async () => {
    if (!phone) return showMsg('Please enter your phone number.');
    setLoading(true);
    clearMsg();
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, { size: 'normal' });
      }
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      showMsg('OTP sent! Check your phone.', 'success');
    } catch (e) {
      showMsg('Failed to send OTP. Check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) return showMsg('Please enter the 6-digit OTP.');
    setLoading(true);
    clearMsg();
    try {
      await confirmationResult.confirm(otp);
      showMsg('Phone verified! Redirecting…', 'success');
      setTimeout(() => navigate('/'), 1000);
    } catch (e) {
      setLoading(false);
      showMsg('Invalid OTP. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="Timtim by Aritri" style={{ height: '72px', borderRadius: '50%', marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
          Timtim <span>by Aritri</span>
        </div>

        {currentUser ? (
          <div className="logged-in-box">
            <div className="user-avatar">👤</div>
            <h3>Welcome back!</h3>
            <p>{currentUser.displayName ? `${currentUser.displayName} · ${currentUser.email || currentUser.phoneNumber}` : (currentUser.email || currentUser.phoneNumber)}</p>
            <button className="auth-btn" style={{ marginBottom: '12px' }} onClick={() => navigate('/')}>Continue Shopping →</button>
            <br />
            <button className="logout-btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div>
            <h2 className="auth-title">Sign <em>in</em></h2>
            <p className="auth-sub">Access your account to save your cart &amp; wishlist</p>

            {msg.text && (
              <div className={`auth-msg ${msg.type}`} style={{ display: 'block' }}>{msg.text}</div>
            )}

            <div className="auth-tabs">
              <button className={`auth-tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => { setMode('signin'); clearMsg(); }}>Sign In</button>
              <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); clearMsg(); }}>Create Account</button>
            </div>

            <div className="method-pills">
              <button className={`method-pill ${method === 'email' ? 'active' : ''}`} onClick={() => { setMethod('email'); clearMsg(); }}>📧 Email</button>
              <button className="method-pill" onClick={handleGoogleSignIn}>🔵 Google</button>
              <button className={`method-pill ${method === 'phone' ? 'active' : ''}`} onClick={() => { setMethod('phone'); clearMsg(); }}>📱 Phone</button>
            </div>

            {method === 'email' && (
              <div className="auth-section show">
                <div className="auth-form-group">
                  <label className="auth-label" htmlFor="auth-email">Email Address</label>
                  <input className="auth-input" id="auth-email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="auth-form-group">
                  <label className="auth-label" htmlFor="auth-password">Password</label>
                  <input className="auth-input" id="auth-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {mode === 'signup' && (
                  <div className="auth-form-group">
                    <label className="auth-label" htmlFor="auth-name">Full Name</label>
                    <input className="auth-input" id="auth-name" type="text" placeholder="Aritri Sharma" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                )}
                <button className="auth-btn" disabled={loading} onClick={handleEmailSubmit}>
                  {loading ? 'Please wait…' : (mode === 'signin' ? 'Sign In →' : 'Create Account →')}
                </button>
              </div>
            )}

            <div style={{ display: method === 'phone' ? 'block' : 'none' }}>
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="auth-phone">Phone Number</label>
                <div className="otp-row">
                  <input className="auth-input" id="auth-phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!!confirmationResult} />
                  <button className="send-otp-btn" onClick={handleSendOTP} disabled={loading || !!confirmationResult}>
                    {loading ? 'Sending…' : 'Send OTP'}
                  </button>
                </div>
              </div>
              {confirmationResult && (
                <div className="auth-form-group">
                  <label className="auth-label" htmlFor="auth-otp">Enter OTP</label>
                  <input className="auth-input" id="auth-otp" type="text" placeholder="6-digit code" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} />
                </div>
              )}
              <div ref={recaptchaContainerRef}></div>
              {confirmationResult && (
                <button className="auth-btn" disabled={loading} onClick={handleVerifyOTP}>
                  {loading ? 'Verifying…' : 'Verify OTP →'}
                </button>
              )}
            </div>
          </div>
        )}

        {!currentUser && (
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--warm-gray)', marginTop: '24px' }}>
            By signing in you agree to our <a href="#" style={{ color: 'var(--amber)' }}>Terms</a> &amp; <a href="#" style={{ color: 'var(--amber)' }}>Privacy Policy</a>
          </p>
        )}
      </div>
    </div>
  );
}
