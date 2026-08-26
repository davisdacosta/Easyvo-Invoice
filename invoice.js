/* invoice.js - Invoice Generator core functionality
   - Add / remove line items
   - Auto-calculate subtotal, tax, discount, shipping, grand total
   - Update preview from form fields
   - Reset / clear form
   - Print (uses window.print with a printing helper)
*/

document.addEventListener('DOMContentLoaded', function () {
  // Form elements
  const businessNameEl = document.getElementById('business-name');
  const businessAddrEl = document.getElementById('business-address');
  const businessEmailEl = document.getElementById('business-email');
  const businessPhoneEl = document.getElementById('business-phone');

  const clientNameEl = document.getElementById('client-name');
  const clientAddrEl = document.getElementById('client-address');
  const clientEmailEl = document.getElementById('client-email');

  const invoiceNumEl = document.getElementById('invoice-num');
  const issueDateEl = document.getElementById('issue-date');
  const dueDateEl = document.getElementById('due-date');
  const currencyEl = document.getElementById('currency');

  const itemDescEl = document.getElementById('item-desc');
  const itemQtyEl = document.getElementById('item-qty');
  const itemPriceEl = document.getElementById('item-price');
  const addItemBtn = document.getElementById('add-item-btn');

  // Metadata Code for JS.
  const taxRateEl = document.getElementById('tax-rate');
  const discountEl = document.getElementById('discount-rate');
  const shippingEl = document.getElementById('shipping-cost');
  const notesEl = document.getElementById('invoice-notes');

  const generateBtn = document.getElementById('generate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const printBtn = document.getElementById('print-btn');

  // Preview elements
  const previewBizName = document.getElementById('preview-biz-name');
  const previewBizAddr = document.getElementById('preview-biz-addr');
  const previewClientName = document.getElementById('preview-client-name');
  const previewClientAddr = document.getElementById('preview-client-addr');
  const previewInvoiceNum = document.getElementById('preview-invoice-num');
  const previewIssueDate = document.getElementById('preview-issue-date');
  const previewDueDate = document.getElementById('preview-due-date');
  const previewItemsBody = document.getElementById('preview-items-body');
  const previewSubtotal = document.getElementById('preview-subtotal');
  const previewTaxLabel = document.getElementById('preview-tax-label');
  const previewTaxAmount = document.getElementById('preview-tax-amount');
  const previewDiscountLabel = document.getElementById('preview-discount-label');
  const previewDiscountAmount = document.getElementById('preview-discount-amount');
  const previewShipping = document.getElementById('preview-shipping');
  const previewGrandTotal = document.getElementById('preview-grand-total');

  // Data model
  let items = [];

  // --- LOGO Upload Elements ---
  const logoUpload = document.getElementById('logo-upload');
  const previewLogo = document.getElementById('preview-logo');
  const logoPlaceholder = document.getElementById('preview-logo-placeholder');
  const removeLogoBtn = document.getElementById('remove-logo-btn');

  // --- Helper Functions ---
  function formatMoney(value) {
    const symbol = currencyEl ? currencyEl.value : '$';
    return symbol + (Number(value) || 0).toFixed(2);
  }

  function parseNumber(input) {
    const n = parseFloat(input);
    return Number.isFinite(n) ? n : 0;
  }

  // --- Item Management ---
  function addItem() {
    const desc = itemDescEl.value.trim();
    const qty = parseNumber(itemQtyEl.value);
    const price = parseNumber(itemPriceEl.value);

    if (!desc) {
      alert('Please provide an item description.');
      itemDescEl.focus();
      return;
    }

    if (qty <= 0) {
      alert('Quantity must be at least 1.');
      itemQtyEl.focus();
      return;
    }

    if (price < 0) {
      alert('Price cannot be negative.');
      itemPriceEl.focus();
      return;
    }

    items.push({ desc, qty, price });

    
    // clear inputs for next item
    itemDescEl.value = '';
    itemQtyEl.value = '1';
    itemPriceEl.value = '0.00';
    itemDescEl.focus();

    renderPreview();
  }

  function removeItem(index) {
    if (index >= 0 && index < items.length) {
      items.splice(index, 1);
      renderPreview();
    }
  }

  // --- Calculations ---
  function calculateTotals() {
    const subtotal = items.reduce((acc, it) => acc + (it.qty * it.price), 0);
    const taxRate = parseNumber(taxRateEl.value);
    const discountRate = parseNumber(discountEl.value);
    const shipping = parseNumber(shippingEl.value);

    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmount = (subtotal * discountRate) / 100;
    const grandTotal = subtotal + taxAmount + shipping - discountAmount;

    return { subtotal, taxAmount, discountAmount, shipping, grandTotal, taxRate, discountRate };
  }

  // --- Render Preview ---
  function renderPreview() {
    // Business / Client info
    previewBizName.textContent = businessNameEl.value || '-';
    previewBizAddr.textContent = businessAddrEl.value || '';
    previewClientName.textContent = clientNameEl.value || '-';
    previewClientAddr.textContent = clientAddrEl.value || '';

    previewInvoiceNum.textContent = invoiceNumEl.value ? 'Invoice: ' + invoiceNumEl.value : '';
    previewIssueDate.textContent = issueDateEl.value ? 'Issued: ' + issueDateEl.value : '';
    previewDueDate.textContent = dueDateEl.value ? 'Due: ' + dueDateEl.value : '';

    // Items
    previewItemsBody.innerHTML = '';
    items.forEach((it, idx) => {
      const tr = document.createElement('tr');

      const tdDesc = document.createElement('td');
      tdDesc.textContent = it.desc;

      const tdQty = document.createElement('td');
      tdQty.textContent = it.qty;

      const tdPrice = document.createElement('td');
      tdPrice.textContent = formatMoney(it.price);

      const tdTotal = document.createElement('td');
      tdTotal.textContent = formatMoney(it.qty * it.price);

      const tdAction = document.createElement('td');
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✕';
      removeBtn.style.background = 'transparent';
      removeBtn.style.color = '#dc2626';
      removeBtn.style.border = 'none';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.fontWeight = '700';
      removeBtn.style.fontSize = '1rem';
      removeBtn.style.padding = '0.25rem 0.5rem';
      removeBtn.setAttribute('aria-label', 'Remove item');
      removeBtn.addEventListener('click', () => removeItem(idx));

      tdAction.appendChild(removeBtn);
      
      tr.appendChild(tdDesc);
      tr.appendChild(tdQty);
      tr.appendChild(tdPrice);
      tr.appendChild(tdTotal);
      tr.appendChild(tdAction);
      
      previewItemsBody.appendChild(tr);
    });

    // Totals
    const { subtotal, taxAmount, discountAmount, shipping, grandTotal, taxRate, discountRate } = calculateTotals();

    // Get currency symbol
    const symbol = currencyEl ? currencyEl.value : '$';

    
    // Update totals display WITHOUT currency symbol (we'll add it in the next step)
    previewSubtotal.textContent = subtotal.toFixed(2);
    previewTaxLabel.textContent = taxRate.toFixed(1);
    previewTaxAmount.textContent = taxAmount.toFixed(2);
    previewDiscountLabel.textContent = discountRate.toFixed(1);
    previewDiscountAmount.textContent = discountAmount.toFixed(2);
    previewShipping.textContent = shipping.toFixed(2);
    previewGrandTotal.textContent = grandTotal.toFixed(2);

    // Now format ALL monetary values with currency symbol
    previewSubtotal.textContent = symbol + previewSubtotal.textContent;
    previewTaxAmount.textContent = symbol + previewTaxAmount.textContent;
    previewDiscountAmount.textContent = symbol + previewDiscountAmount.textContent;
    previewShipping.textContent = symbol + previewShipping.textContent;
    previewGrandTotal.textContent = symbol + previewGrandTotal.textContent;

    // Notes
    const previewNotes = document.getElementById('preview-notes-display');
    if (previewNotes) {
      previewNotes.textContent = notesEl.value || '';
    }
  }

  // --- Reset Form ---
  function resetForm() {
  // Clear inputs in the form panel
  const formInputs = document.querySelectorAll('.form-panel input, .form-panel textarea, .form-panel select');
    
    formInputs.forEach(input => {
      const type = input.type;
      if (type === 'checkbox' || type === 'radio') {
        input.checked = false;
      } else if (input.id === 'invoice-num') {
        input.value = 'INV-001';
      } else if (input.id === 'item-qty') {
        input.value = '1';
      } else if (input.id === 'item-price') {
        input.value = '0.00';
      } else if (input.id === 'currency') {
        input.value = '$';
      } else if (type === 'file') {
        // Don't reset file inputs automatically
      } else if (input.tagName === 'SELECT') {
        input.selectedIndex = 0;
      } else {
        input.value = '';
      }
    });

    // Reset items
    items = [];

    // Reset dates
    issueDateEl.value = new Date().toISOString().slice(0, 10);
    dueDateEl.value = '';
    
    // Reset logo
    if (previewLogo) {
      previewLogo.src = '';
      previewLogo.style.display = 'none';
      if (logoPlaceholder) logoPlaceholder.style.display = 'block';
      if (removeLogoBtn) removeLogoBtn.style.display = 'none';
      if (logoUpload) logoUpload.value = '';
      localStorage.removeItem('companyLogo');
    }

    renderPreview();
  }

  // --- Print Invoice ---
  function printInvoice() {
    // Add a helper class that hides the form and optimizes preview for printing
    document.body.classList.add('printing');

    // Allow styles to apply then open print dialog
    setTimeout(() => {
      window.print();

      // Remove printing helper after print dialog closes
      setTimeout(() => document.body.classList.remove('printing'), 1200);
    }, 150);
  }

  // --- LOGO Event Handlers ---
  if (logoUpload) {
    logoUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      
      if (file) {
        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
          alert('Please upload a PNG, JPEG, WebP, or SVG file.');
          this.value = '';
          return;
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert('Logo file must be under 2MB.');
          this.value = '';
          return;
        }
        
        // Read and display the image
        const reader = new FileReader();
        reader.onload = function(e) {
          if (previewLogo) {
            previewLogo.src = e.target.result;
            previewLogo.style.display = 'block';
          }
          if (logoPlaceholder) logoPlaceholder.style.display = 'none';
          if (removeLogoBtn) removeLogoBtn.style.display = 'inline-block';
          
          // Save to localStorage for persistence
          localStorage.setItem('companyLogo', e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removeLogoBtn) {
    removeLogoBtn.addEventListener('click', function() {
      if (previewLogo) {
        previewLogo.src = '';
        previewLogo.style.display = 'none';
      }
      if (logoPlaceholder) logoPlaceholder.style.display = 'block';
      this.style.display = 'none';
      if (logoUpload) logoUpload.value = '';
        
      // Remove from localStorage
      localStorage.removeItem('companyLogo');
    });
  }

  // Load saved logo from localStorage on page load
  const savedLogo = localStorage.getItem('companyLogo');
  if (savedLogo && previewLogo) {
    previewLogo.src = savedLogo;
    previewLogo.style.display = 'block';
    if (logoPlaceholder) logoPlaceholder.style.display = 'none';
    if (removeLogoBtn) removeLogoBtn.style.display = 'inline-block';
  }

  // --- Wire up events ---
  if (addItemBtn) {
    addItemBtn.addEventListener('click', function(e) { 
      e.preventDefault(); 
      addItem(); 
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', function(e) { 
      e.preventDefault(); 
      renderPreview(); 
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function(e) { 
      e.preventDefault(); 
      if (confirm('Clear the invoice and reset the form?')) resetForm(); 
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', function(e) { 
      e.preventDefault(); 
      printInvoice(); 
    });
  }

  // Live updates: recalculate when rates or currency change
  [taxRateEl, discountEl, shippingEl, currencyEl].forEach(el => {
    if (el) {
      el.addEventListener('input', renderPreview);
    }
  });

  // Also update preview when core fields change
  [businessNameEl, businessAddrEl, businessEmailEl, businessPhoneEl, clientNameEl, clientAddrEl, clientEmailEl, invoiceNumEl, issueDateEl, dueDateEl, notesEl].forEach(el => {
    if (el) {
      el.addEventListener('input', renderPreview);
    }
  });
  // Allow Enter key to add items
  if (itemDescEl) {
    itemDescEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addItem();
      }
    });
  }

  // Initialize defaults
  if (issueDateEl && !issueDateEl.value) {
    issueDateEl.value = new Date().toISOString().slice(0, 10);
  }
  if (invoiceNumEl && !invoiceNumEl.value) {
    invoiceNumEl.value = 'INV-001';
  }

  renderPreview();
});
