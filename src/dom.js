// Yurguen: helper mínimo para armar el DOM (compartido entre páginas).
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  children.flat().forEach((c) => {
    if (c != null) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}
