import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Checkout from './Checkout';

function Payment() {
    const stripe = loadStripe(
        "pk_test_51OTjURBQWp069pqTmqhKZHNNd3kMf9TTynJtLJQIJDOSYcGM7xz3DabzCzE7bTxvuYMY0IX96OHBjsysHEKIrwCK006Mu7mKw8"
      );
  return (
    <Elements stripe={stripe}>
        <Checkout />
      </Elements>
  )
}

export default Payment