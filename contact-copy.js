async function copyContact(button) {
  const value = button.dataset.copy;
  let copied = false;
  try {
    await navigator.clipboard.writeText(value);
    copied = true;
  } catch {
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field);
    field.select();
    copied = document.execCommand('copy');
    field.remove();
    button.focus({preventScroll: true});
  }
  button.textContent = copied ? '已复制' : '复制失败';
  button.setAttribute('aria-label', copied ? '已复制到剪贴板' : '复制失败，请重试');
  clearTimeout(button.copyTimer);
  button.copyTimer = setTimeout(() => {
    button.textContent = '复制';
    button.setAttribute('aria-label', '复制' + value);
  }, 1800);
}
document.querySelectorAll('.copy-contact').forEach(button => {
  button.addEventListener('click', () => copyContact(button));
});