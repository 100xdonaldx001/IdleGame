async function load(path, id) {
  const html = await fetch(path).then(r => r.text());
  const el = document.getElementById(id);
  if (el) el.outerHTML = html;
}

(async () => {
  await Promise.all([
    load('modules/header.html', 'header'),
    load('modules/aside.html', 'sidebar'),
    load('modules/main.html', 'content')
  ]);
  await import('./main.js');
})();
