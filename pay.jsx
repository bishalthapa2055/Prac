import StripeCheckout from "react-stripe-checkout";

const KEYS =
  "pk_test_51LucPBESSBNdpt0pGLCtGL4nP2sp2gpNeFlUkON05rokvMS9kOkwuq3Z3gZK29ok0xn13EI0pmHFEqvnhwFqHwRi00jKjUUDEN";

const Pay = () => {
  const onToken = (token) => {
    console.log(token);
  };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StripeCheckout
        name="Thapa shop"
        image="https://images.unsplash.com/photo-1585468274952-66591eb14165?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
        billingAddress
        shippingAddress
        description="Your total is $200"
        amount={2000}
        token={onToken}
        stripeKey={KEYS}
      >
        <button
          style={{
            border: "none",
            width: 120,
            borderRadius: 5,
            padding: "20px",
            backgroundColor: "black",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Pay Now
        </button>
      </StripeCheckout>
    </div>
  );
};

export default Pay;
