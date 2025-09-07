"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '72px auto', padding: 24 }} className="bg-amber-100 rounded-lg shadow-md">
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Log in</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" style={{ display: 'block', fontWeight: 600 }}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          style={{ width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 6, marginTop: 6, marginBottom: 14 }}
        />

        <label htmlFor="password" style={{ display: 'block', fontWeight: 600 }}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          style={{ width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 6, marginTop: 6, marginBottom: 14 }}
        />

        {error && (
          <p style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 6,
            border: 'none',
            background: loading ? '#9ca3af' : '#111827',
            color: '#fff',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: 14 }}>
        Don’t have an account?{' '}
        <Link href="/signup" style={{ color: '#2563eb', fontWeight: 600 }}>Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;