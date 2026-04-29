const pricePerBook = 299;

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
        await fetch("https://script.google.com/macros/s/AKfycbx3pbJZXQbBUVpy1ery1yF_IAg6zWdlIGw9e2wYvaC3YY1ytOKaRkoEt5npx53PkEzN/exec", {
          method: "POST",
          body: JSON.stringify(orderData),
          mode: "no-cors"
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
