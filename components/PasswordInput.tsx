'use client';
import { useState } from 'react';

export function PasswordInput({ lang, newPassword }: { lang: 'en' | 'ar'; newPassword?: boolean }) {
  const [show, setShow] = useState(false);
  const ar = lang === 'ar';
  return (
    <span className="pw">
      <input id="password" name="password" type={show ? 'text' : 'password'} required minLength={newPassword ? 8 : 1} autoComplete={newPassword ? 'new-password' : 'current-password'} aria-describedby={newPassword ? 'pw-help' : undefined} />
      <button type="button" className="pw-toggle" aria-pressed={show} aria-controls="password" onClick={() => setShow((s) => !s)}>
        {show ? (ar ? 'إخفاء' : 'Hide') : (ar ? 'إظهار' : 'Show')}<span className="sr-only">{ar ? ' كلمة المرور' : ' password'}</span>
      </button>
    </span>
  );
}
