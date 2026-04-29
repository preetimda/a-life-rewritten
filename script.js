const pricePerBook = 2;

const qtyInput = document.getElementById("qty");
const totalPrice = document.getElementById("totalPrice");
const payBtn = document.getElementById("payBtn");
const successMsg = document.getElementById("successMsg");

updateTotal();

qtyInput.addEventListener("input", updateTotal);

function updateTotal() {
  let qty = parseInt(qtyInput.value);
  if (isNaN(qty) || qty < 1) qty = 1;

  qtyInput.value = qty;
  totalPrice.textContent = qty * pricePerBook;
}

function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

window.addEventListener("click", function (e) {
  document.querySelectorAll(".modal").forEach(function (modal) {
    if (e.target === modal) modal.style.display = "none";
  });
});

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

  if (!termsChecked || !refundChecked) {
    alert("Please accept Terms & Conditions and Cancellation Policy.");
    return false;
  }

  return { name, email, phone, address, pincode, qty };
}

payBtn.addEventListener("click", function () {
  const formData = validateForm();
  if (!formData) return;

  const total = formData.qty * pricePerBook;

  const options = {
    key: "rzp_live_SjM4kEL82emOz7",
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
        await fetch("https://script.google.com/macros/s/AKfycbzoq9k_D4K5FVX6vHeG3uhj1EnK_3NyeLhwBEEUnK5AxNFMz_qOhGdi121fCC2sjqHM/exec", {
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
        alert("Payment cancelled.");
      }
    }
  };

  const rzp = new Razorpay(options);

  rzp.on("payment.failed", function (response) {
    alert("Transaction failed. Please try again.");
    console.error(response.error);
  });

  rzp.open();
});
