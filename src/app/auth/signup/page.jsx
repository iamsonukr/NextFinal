// src/app/auth/signup/page.js
import SignUpForm from '@/src/components/auth/SignUpForm'

export const metadata = {
  title: 'Sign Up - E-Commerce',
  description: 'Create a new account'
}

export default function SignUpPage() {
  return <SignUpForm />
}