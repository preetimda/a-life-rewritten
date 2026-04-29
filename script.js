const pricePerBook = 1;

const qtyInput = document.getElementById("qty");
const totalPrice = document.getElementById("totalPrice");
const payBtn = document.getElementById("payBtn");
const successMsg = document.getElementById("successMsg");

/* ---------- INITIAL TOTAL ---------- */
updateTotal();

/* ---------- UPDATE TOTAL ---------- */
qtyInput.addEventListener("input", updateTotal);

function updateTotal() {
  let qty = parseInt(qtyInput.value);

  if (isNaN(qty) || qty < 1) qty = 1;

  qtyInput.value = qty;
  totalPrice.textContent = qty * pricePerBook;
}

/* ---------- MODAL FUNCTIONS ---------- */
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

/* Close modal when clicking outside */
window.addEventListener("click", function (e) {
  document.querySelectorAll(".modal").forEach(function (modal) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

/* ---------- VALIDATION ---------- */
function validateForm() {
  const name = document.getElementById("custName").value.trim();
  const email = document.getElementById("custEmail").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const qty = parseInt(document.getElementById("qty").value) || 1;

  const termsChecked = document.getElementById("termsCheck").checked;
  const refundChecked = document.getElementById("refundCheck").checked;

  if (!name || !email || !phone || !address || !pincode) {
    alert("Please fill all details.");
    return false;
  }

  if (name.length < 3) {
    alert("Please enter a valid full name.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return false;
  }

  const pinRegex = /^\d{6}$/;
  if (!pinRegex.test(pincode)) {
    alert("Please enter a valid 6-digit pin code.");
    return false;
  }

  if (address.length < 10) {
    alert("Please enter complete address.");
    return false;
  }

  if (!termsChecked || !refundChecked) {
    alert("Please accept Terms & Conditions and Cancellation Policy.");
    return false;
  }

  return {
    name,
    email,
    phone,
    address,
    pincode,
    qty
  };
}

/* ---------- PAYMENT ---------- */
payBtn.addEventListener("click", function () {
  const formData = validateForm();

  if (!formData) return;

  const total = formData.qty * pricePerBook;

  const options = {
    key: "rzp_live_SjM4kEL82emOz7", // replace with live key later
    amount: total * 100,
    currency: "INR",
    name: "Preeti Maurya",
    description: "Signed Copy Order",

    method: {
      upi: true,
      card: true,
      netbanking: true,
      wallet: true
    },

    prefill: {
      name: formData.name,
      email: formData.email,
      contact: formData.phone
    },

    theme: {
      color: "#d4a24d"
    },

    handler: async function (response) {
      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        pincode: formData.pincode,
        qty: formData.qty,
        total: total,
        paymentId: response.razorpay_payment_id,
        paymentStatus: "Paid"
      };

      try {
        await fetch("https://script.google.com/macros/s/AKfycbxJmkBw6Cr9Kg2Tqu08OnGxO10nKMg_0k6-o1c7FgTAPIzMnV3wD5EC4-kakNEbGebZ/exec", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(orderData)
        });

        successMsg.innerHTML = `
          ✨ Payment Successful! <br>
          Your signed copy is being prepared with love. ♡
        `;

        document.getElementById("custName").value = "";
        document.getElementById("custEmail").value = "";
        document.getElementById("custPhone").value = "";
        document.getElementById("custAddress").value = "";
        document.getElementById("pincode").value = "";
        document.getElementById("qty").value = 1;
        document.getElementById("termsCheck").checked = false;
        document.getElementById("refundCheck").checked = false;

        updateTotal();

      } catch (error) {
        alert("Payment successful, but order saving failed.");
        console.error(error);
      }
    },

    modal: {
      ondismiss: function () {
        console.log("Payment popup closed.");
      }
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});


Integrate Razorpay Standard Web Checkout into this codebase.

=== CREDENTIALS ===

RAZORPAY_KEY_ID: rzp_test_SjLrl5m8k5MLrp
RAZORPAY_KEY_SECRET: suCvset9wROF64mZUym0UwH8

=== TASK ===

Detect the project stack and implement Razorpay Standard Checkout with:
1. Backend endpoint to create orders
2. Frontend checkout button with payment modal
3. Backend endpoint to verify payment signature

=== IMPLEMENTATION DETAILS ===

STEP 1: BACKEND - Create Order
- Endpoint: POST /api/create-order (or framework equivalent)
- Call Razorpay API: POST https://api.razorpay.com/v1/orders
- Request: { amount (paise), currency, receipt }
- Return: { order_id, amount, currency }
- Minimum amount: 100 paise

STEP 2: FRONTEND - Checkout
- Script: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
- On button click: call create-order, then open Razorpay modal with order_id
- On success: receive razorpay_payment_id, razorpay_order_id, razorpay_signature
- Send all three to verify endpoint

STEP 3: BACKEND - Verify Signature
- Endpoint: POST /api/verify-payment (or framework equivalent)
- Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
- Compare generated signature with razorpay_signature
- Return success only if signatures match

=== ENVIRONMENT SETUP ===

Create .env file:
RAZORPAY_KEY_ID=rzp_test_SjLrl5m8k5MLrp
RAZORPAY_KEY_SECRET=suCvset9wROF64mZUym0UwH8

Frontend framework prefixes (KEY_ID only, never KEY_SECRET):
- Next.js: NEXT_PUBLIC_RAZORPAY_KEY_ID
- Vite: VITE_RAZORPAY_KEY_ID
- CRA: REACT_APP_RAZORPAY_KEY_ID

Add .env to .gitignore.

=== SDK INSTALLATION ===

Node.js: npm install razorpay
Python: pip install razorpay
PHP: composer require razorpay/razorpay
Ruby: gem install razorpay
Go: go get github.com/razorpay/razorpay-go

=== OPERATION ORDER ===

Execute in this sequence:
1. Install dependencies first
2. Create .env file
3. Create or modify code files
4. Verify setup

=== ERROR HANDLING ===

Backend - Create Order:
- Validate amount >= 100 paise
- Handle Razorpay API errors (return 500)
- Handle auth failures (return 401)

Backend - Verify Signature:
- Signature mismatch: return 400, do NOT mark as paid
- Missing fields: return 400

Frontend:
- Handle modal dismiss (user cancelled)
- Handle payment.failed event
- Show error messages to user

=== EDGE CASES ===

If no backend framework detected:
- Stop and explain that Razorpay requires a backend for order creation
- Suggest serverless functions (Vercel/Netlify) or Razorpay Payment Links

If Razorpay already integrated:
- Do not duplicate code
- Only fix or complete missing parts

If static site only:
- Suggest adding serverless API routes
- Or suggest Razorpay Payment Links as alternative

=== REQUIREMENTS ===

- Never hardcode credentials in source files
- KEY_SECRET must never reach frontend code
- Use environment variables everywhere
- Follow existing code style in the project
- Do not create database tables unless project already has a database

=== REFERENCE ===

Documentation: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/

=== OUTPUT ===

After completing integration:
1. List files created or modified
2. Explain how to test (e.g., start server, click pay button)
3. Note any manual steps required

Begin integration now.
