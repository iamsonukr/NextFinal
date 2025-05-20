// src/app/auth/signin/page.js
import SignInForm from '@/src/components/auth/SignInForm'

export const metadata = {
  title: 'Sign In - E-Commerce',
  description: 'Sign in to your account'
}

export default function SignInPage() {
  return <SignInForm />
}