import { useState } from 'react';


export default function AuthPage() {
  const [tab, setTab] = useState('login');
  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left">
        <div className="auth-logo">A/K</div>
        <div>
          <div className="auth-welcome-title">We Welcome You For The BEST!</div>
          <div className="auth-welcome-desc">Resume Builder helps, boost and redefine your career</div>
        </div>
      </div>
      {/* Right Side (Form) */}
      <div className="auth-form-wrapper">
        <div className="auth-tabs">
          <button 
            className={`auth-tab-btn${tab === 'login' ? ' active' : ''}`} 
            onClick={() => setTab('login')}
          >Login</button>
          <button 
            className={`auth-tab-btn${tab === 'register' ? ' active' : ''}`}
            onClick={() => setTab('register')}
          >Register</button>
        </div>
        {tab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

function LoginForm() {
  return (
    <form>
      <input className="auth-input" type="email" placeholder="Please enter your email" required />
      <input className="auth-input" type="password" placeholder="Please enter your password" required />
      <div className="auth-options-row">
        <label className="auth-checkbox-label">
          <input type="checkbox" /> Remember Me
        </label>
        <a href="#" className="auth-forgot">Forgot password?</a>
      </div>
      <div className="auth-form-title">Login</div>
      <div className="auth-or-row">
        <hr /><span className="auth-or-text">OR</span><hr />
      </div>
      <button className="auth-google-btn" type="button">
        
        <span style={{marginRight:8}}> 
          
        </span>
        Sign in with Google
      </button>
    </form>
  );
}

function RegisterForm() {
  return (
    <form>
      <input className="auth-input" type="text" placeholder="Name" required />
      <input className="auth-input" type="email" placeholder="Email" required />
      <input className="auth-input" type="password" placeholder="Password" required />
      <button className="auth-google-btn" type="submit" style={{marginTop: '18px', background: '#816cf7', color:'#fff'}}>Register</button>
    </form>
  );
}
