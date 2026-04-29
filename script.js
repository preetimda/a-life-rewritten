try {
        await fetch("https://script.google.com/macros/s/AKfycby65mAzDV14GrkPIChLMYUs2JUOtUhvFLPzcFZ6n-5SPVeVg5S-7Chhryv0cPduyNss/exec", {
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
