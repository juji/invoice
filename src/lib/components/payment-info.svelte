<script>
  const {
    singlePaymentUrl,
    subscriptionUrl
  } = $props()
</script>

<div class="payment-info">
  <p><b>Payment(s) can be done with Paypal:</b></p>
  <p>
    <a target="_blank" href={singlePaymentUrl}>Single Payment</a>
    If you want to do a single payment.
  </p>
  <p>
    <a target="_blank" href={subscriptionUrl}>Subscription</a>
    If you whish to subscribe. You can cancel anytime.
  </p>
</div>


<style>
  .payment-info{

    border: 1px solid var(--border-color);
    padding: 1rem;
    font-size: 0.9rem;

    p:first-child{
      margin-top: 0;
    }

    p:last-child{
      margin-bottom: 0;
    }

    a{
      display: block;
      margin-bottom: 0.5rem;
    }
    
  }
</style>