import { loadStripe } from '@stripe/stripe-js'
import React from 'react'
import PaymentForm from './PaymentForm'
import { Elements } from '@stripe/react-stripe-js'

function StripeProvider() {
  // const stripePromice = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh')


  const stripePromice = loadStripe(import.meta.env.VITE_PAYMENT_KEY)
  return (
    <Elements stripe={stripePromice}>
      <PaymentForm />
    </Elements>
  )
}

export default StripeProvider
