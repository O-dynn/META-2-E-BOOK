const form = document.getElementById('leadForm');
const successCard = document.getElementById('successCard');
const downloadPanel = document.querySelector('.download-panel');
const downloadButton = document.getElementById('downloadButton');
const resetButton = document.getElementById('resetForm');
const leadName = document.getElementById('leadName');
const toast = document.getElementById('toast');
const submitButton = form.querySelector('button[type="submit"]');

const fields = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  profession: document.getElementById('profession'),
  consent: document.getElementById('consent')
};

const messages = {
  name: 'Informe seu nome completo.',
  email: 'Informe um e-mail válido.',
  profession: 'Selecione sua área de atuação.',
  consent: 'Você precisa aceitar para continuar.'
};

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(fieldName, hasError) {
  const field = fields[fieldName];

  if (fieldName === 'consent') {
    const consentError = document.querySelector('.consent-error');
    consentError.textContent = hasError ? messages[fieldName] : '';
    return;
  }

  const group = field.closest('.field-group');
  const error = group.querySelector('.error-message');
  group.classList.toggle('invalid', hasError);
  error.textContent = hasError ? messages[fieldName] : '';
}

function validateForm() {
  const state = {
    name: fields.name.value.trim().length >= 3,
    email: validateEmail(fields.email.value.trim()),
    profession: Boolean(fields.profession.value),
    consent: fields.consent.checked
  };

  Object.entries(state).forEach(([key, valid]) => setError(key, !valid));
  return Object.values(state).every(Boolean);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3200);
}

function saveLead(data) {
  // Demonstração local. Para armazenar leads de verdade, conecte este ponto
  // ao Mailchimp, RD Station, Google Sheets ou a um backend seguro.
  const leads = JSON.parse(localStorage.getItem('meta2EbookLeads') || '[]');
  leads.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem('meta2EbookLeads', JSON.stringify(leads));
}

/**
 * Aceita tanto o link normal de compartilhamento do Google Drive quanto
 * um link direto. Quando encontra o ID do arquivo, cria uma URL própria
 * para download, mantendo o PDF fora do GitHub Pages.
 */
function createDriveDownloadUrl(sharedUrl) {
  if (!sharedUrl || sharedUrl.includes('COLE_AQUI')) return null;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/
  ];

  const match = patterns.map((pattern) => sharedUrl.match(pattern)).find(Boolean);
  if (!match) return sharedUrl;

  const fileId = match[1];
  return `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`;
}

const configuredDriveUrl = window.META2_CONFIG?.ebookDriveUrl || '';
const ebookDownloadUrl = createDriveDownloadUrl(configuredDriveUrl);

if (ebookDownloadUrl) {
  downloadButton.href = ebookDownloadUrl;
  downloadButton.setAttribute('aria-disabled', 'false');
} else {
  downloadButton.classList.add('is-disabled');
  downloadButton.setAttribute('aria-disabled', 'true');
  downloadButton.title = 'Configure o link do Google Drive no arquivo config.js.';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  submitButton.classList.add('loading');
  submitButton.disabled = true;

  const lead = {
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    profession: fields.profession.value,
    consent: fields.consent.checked
  };

  window.setTimeout(() => {
    saveLead(lead);
    leadName.textContent = lead.name.split(' ')[0];
    downloadPanel.hidden = true;
    successCard.hidden = false;
    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
    showToast('Cadastro concluído. Seu download foi liberado!');
  }, 650);
});

Object.entries(fields).forEach(([key, field]) => {
  const eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
  field.addEventListener(eventName, () => {
    if (key === 'email') setError(key, !validateEmail(field.value.trim()) && field.value.length > 0);
    else if (key === 'name') setError(key, field.value.trim().length < 3 && field.value.length > 0);
    else if (key === 'profession') setError(key, !field.value);
    else setError(key, !field.checked);
  });
});

downloadButton.addEventListener('click', (event) => {
  if (!ebookDownloadUrl) {
    event.preventDefault();
    showToast('O link do Google Drive ainda precisa ser configurado.');
    return;
  }

  showToast('O download será aberto pelo Google Drive.');
});

resetButton.addEventListener('click', () => {
  form.reset();
  successCard.hidden = true;
  downloadPanel.hidden = false;
  downloadPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.getElementById('currentYear').textContent = new Date().getFullYear();
