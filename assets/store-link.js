// Turns a disabled "Coming soon" store button into a real link once a URL is set.
// To launch: put the Fourthwall product URL in the button's data-store-url attribute
// (see merch/index.html). Nothing else needs to change.
document.querySelectorAll('button[data-store-url]').forEach(function (btn) {
  var url = (btn.getAttribute('data-store-url') || '').trim();
  if (url.indexOf('https://') !== 0) return;
  var a = document.createElement('a');
  a.className = btn.className;
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = btn.getAttribute('data-store-label') || 'Shop now';
  var sr = document.createElement('span');
  sr.className = 'visually-hidden';
  sr.textContent = ' (opens our Fourthwall store in a new tab)';
  a.appendChild(sr);
  btn.replaceWith(a);
});
