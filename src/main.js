(function () {
  const form = document.getElementById('transactionForm');
  const messageEl = document.getElementById('formMessage');

  const errors = {
    buyerName: document.getElementById('buyerNameError'),
    buyerEmail: document.getElementById('buyerEmailError'),
    buyerPhone: document.getElementById('buyerPhoneError'),
    propertyAddress: document.getElementById('propertyAddressError'),
    postalCode: document.getElementById('postalCodeError'),
    salePrice: document.getElementById('salePriceError'),
    ownershipDocument: document.getElementById('ownershipDocumentError'),
  };

  function clearErrors() {
    Object.values(errors).forEach((el) => (el.textContent = ''));
    messageEl.textContent = '';
    messageEl.className = 'form-message';
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateSingaporePhone(phone) {
    const re = /^[89]\d{7}$/; // 8 digits, starts with 8 or 9
    return re.test(phone);
  }

  function validatePostalCode(code) {
    const re = /^\d{6}$/;
    return re.test(code);
  }

  function validateFile(file) {
    if (!file) return { valid: false, message: 'Ownership document is required.' };

    const maxBytes = 10 * 1024 * 1024; // 10MB
    const isPdf =
      file.type === 'application/pdf' || (file.name && file.name.toLowerCase().endsWith('.pdf'));

    if (!isPdf) {
      return { valid: false, message: 'File must be a PDF.' };
    }
    if (file.size > maxBytes) {
      return { valid: false, message: 'File size must not exceed 10MB.' };
    }
    return { valid: true, message: '' };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const buyerName = document.getElementById('buyerName').value.trim();
    const buyerEmail = document.getElementById('buyerEmail').value.trim();
    const buyerPhone = document.getElementById('buyerPhone').value.trim();
    const propertyAddress = document.getElementById('propertyAddress').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const salePriceStr = document.getElementById('salePrice').value.trim();
    const salePrice = Number(salePriceStr);
    const ownershipInput = document.getElementById('ownershipDocument');
    const file = ownershipInput.files[0];

    let hasError = false;

    if (!buyerName) {
      errors.buyerName.textContent = 'Buyer name is required.';
      hasError = true;
    }

    if (!buyerEmail) {
      errors.buyerEmail.textContent = 'Buyer email is required.';
      hasError = true;
    } else if (!validateEmail(buyerEmail)) {
      errors.buyerEmail.textContent = 'Invalid email format.';
      hasError = true;
    }

    if (!buyerPhone) {
      errors.buyerPhone.textContent = 'Buyer phone is required.';
      hasError = true;
    } else if (!validateSingaporePhone(buyerPhone)) {
      errors.buyerPhone.textContent = 'Phone must be 8 digits, starting with 8 or 9.';
      hasError = true;
    }

    if (!propertyAddress) {
      errors.propertyAddress.textContent = 'Property address is required.';
      hasError = true;
    }

    if (!postalCode) {
      errors.postalCode.textContent = 'Postal code is required.';
      hasError = true;
    } else if (!validatePostalCode(postalCode)) {
      errors.postalCode.textContent = 'Postal code must be 6 digits.';
      hasError = true;
    }

    if (!salePriceStr) {
      errors.salePrice.textContent = 'Sale price is required.';
      hasError = true;
    } else if (Number.isNaN(salePrice) || salePrice <= 0) {
      errors.salePrice.textContent = 'Sale price must be a positive number.';
      hasError = true;
    }

    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      errors.ownershipDocument.textContent = fileValidation.message;
      hasError = true;
    }

    if (hasError) {
      messageEl.textContent = 'Please fix the errors above and resubmit.';
      messageEl.className = 'form-message error';
      return;
    }

    const transactionId = `TX-${Date.now()}`;

    const data = {
      transactionId,
      buyerName,
      buyerEmail,
      buyerPhone,
      propertyAddress,
      postalCode,
      salePrice: salePrice.toFixed(0),
      ownershipDocumentName: file ? file.name : '',
    };

    sessionStorage.setItem('transactionData', JSON.stringify(data));
    window.location.href = 'summary.html';
  });
})();
