window.addEventListener('scroll', () => {
  document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 10);
});

function openGallery(galleryId) {
  const gallery = document.getElementById(galleryId);
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  
  lightboxContent.innerHTML = gallery.innerHTML;
  lightbox.classList.add('active');
}

function closeGallery() {
  document.getElementById('lightbox').classList.remove('active');
}

// Close on ESC key
document.addEventListener('keydown', function(e) {
  if(e.key === 'Escape') closeGallery();
});

let currentImages = [];
let currentIndex = 0;

function openGallery(galleryId) {
  const gallery = document.getElementById(galleryId);
  const mainImg = gallery.parentElement.querySelector('.main-img');
  const hiddenImgs = gallery.querySelectorAll('img');

  currentImages = [mainImg,...hiddenImgs].map(img => img.src);
  currentIndex = 0;

  updateLightbox();
  document.getElementById('lightbox').classList.add('active');
}

function updateLightbox() {
  document.getElementById('lightbox-img').src = currentImages[currentIndex];
  document.getElementById('image-counter').textContent = `${currentIndex + 1} / ${currentImages.length}`;
}

function closeGallery(e) {
  if(e.target.id === 'lightbox' || e.target.classList.contains('close-btn')) {
    document.getElementById('lightbox').classList.remove('active');
  }
}

function nextImage(e) {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightbox();
}

function prevImage(e) {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightbox();
}

// Keyboard controls
document.addEventListener('keydown', function(e) {
  if(document.getElementById('lightbox').classList.contains('active')) {
    if(e.key === 'ArrowRight') nextImage(e);
    if(e.key === 'ArrowLeft') prevImage(e);
    if(e.key === 'Escape') closeGallery({target: document.getElementById('lightbox')});
  }
});

//Order
const form = document.getElementById('orderForm');
const qty5 = document.getElementById('qty5');
const qty6 = document.getElementById('qty6');
const totalDisplay = document.getElementById('total-display');
const errorMsg = document.getElementById('error-msg');

const PRICE_5W = 70;
const PRICE_6W = 85;
const MIN_QTY = 100;
const COMPANY_EMAIL = 'gasawinnyspfgw@gmail.com';

function updateTotal() {
  const q5 = parseInt(qty5.value) || 0;
  const q6 = parseInt(qty6.value) || 0;
  const totalQty = q5 + q6;
  const totalAmount = (q5 * PRICE_5W) + (q6 * PRICE_6W);
  
  totalDisplay.textContent = `Total chickens: ${totalQty} | Total amount: R${totalAmount}`;
  errorMsg.textContent = '';
}

qty5.addEventListener('input', updateTotal);
qty6.addEventListener('input', updateTotal);

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const surname = document.getElementById('surname').value.trim();
  const cell = document.getElementById('cell').value.trim();
  const location = document.getElementById('location').value.trim();
  const q5 = parseInt(qty5.value) || 0;
  const q6 = parseInt(qty6.value) || 0;
  const totalQty = q5 + q6;
  const totalAmount = (q5 * PRICE_5W) + (q6 * PRICE_6W);

  // Validation
  if(totalQty < MIN_QTY) {
    errorMsg.textContent = `Minimum order is ${MIN_QTY} chickens for free delivery. You selected ${totalQty}.`;
    return;
  }
  if(q5 === 0 && q6 === 0) {
    errorMsg.textContent = 'Please select quantity for 5 weeks or 6 weeks chickens.';
    return;
  }
  if(!/^[0-9]{10}$/.test(cell)) {
    errorMsg.textContent = 'Enter a valid 10 digit cell number. Example: 0712345678';
    return;
  }

  // Build email body
  const emailBody = `Name: ${name}
Surname: ${surname}
Cell Number: ${cell}
Location: ${location}
5 Weeks Qua: ${q5}
6 Weeks Qua: ${q6}

Total amount: R${totalAmount}
Total chickens: ${totalQty}`;

  const subject = encodeURIComponent(`New Order - ${name} ${surname}`);
  const body = encodeURIComponent(emailBody);
  const mailtoLink = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;

  window.location.href = mailtoLink;
});