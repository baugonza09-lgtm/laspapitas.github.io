// ⚙️ CONFIGURACIÓN: cambiá por tu usuario real de Instagram (sin @)
const IG_USER = "laspapitass_";

const PRODUCTS = [
  {id:1,e:"🍟",n:"Papas fritas caseras",d:"Cortadas a mano, crocantes y doradas.",p:3500},
  {id:2,e:"🧀",n:"Papas con cheddar y panceta",d:"Bañadas en cheddar con panceta crocante.",p:5800},
  {id:3,e:"🥔",n:"Papas rústicas al horno",d:"Con piel, romero y ajo.",p:4200},
  {id:4,e:"🥣",n:"Puré de papas cremoso",d:"Con manteca y un toque de nuez moscada.",p:3200},
  {id:5,e:"🍝",n:"Ñoquis de papa (500 g)",d:"Suaves, hechos en el día.",p:4800},
  {id:6,e:"🍳",n:"Tortilla de papa",d:"Jugosa, con o sin cebolla.",p:6500},
  {id:7,e:"🟡",n:"Croquetas de papa",d:"Docena rellena de queso.",p:5200},
  {id:8,e:"🥧",n:"Pastel de papa individual",d:"Carne, puré gratinado y mucho sabor.",p:6200}
];
const fmt = n => "$" + n.toLocaleString("es-AR");
let cart = {};
try { cart = JSON.parse(localStorage.getItem("papitas-cart")) || {}; } catch(e){ cart = {}; }
const $ = id => document.getElementById(id);

function save(){ try{ localStorage.setItem("papitas-cart", JSON.stringify(cart)); }catch(e){} }
function toast(msg){ const t=$("toast"); t.textContent=msg; t.classList.add("on"); setTimeout(()=>t.classList.remove("on"),3500); }

function renderGrid(){
  $("grid").innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <div class="thumb">${p.e}</div>
      <h3>${p.n}</h3><p>${p.d}</p>
      <div class="row"><span class="price">${fmt(p.p)}</span>
      <button class="add" data-id="${p.id}">Agregar</button></div>
    </article>`).join("");
}

function renderCart(){
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  let total = 0, count = 0;
  $("items").innerHTML = ids.length ? ids.map(id => {
    const p = PRODUCTS.find(x => x.id == id), q = cart[id];
    total += p.p * q; count += q;
    return `<div class="item"><div class="e">${p.e}</div>
      <div class="n">${p.n}<small>${fmt(p.p)} c/u</small></div>
      <div class="qty"><button data-m="${id}">−</button><b>${q}</b><button data-a="${id}">+</button></div></div>`;
  }).join("") : `<div class="empty">Tu carrito está vacío 🥔<br>¡Agregá algo rico!</div>`;
  $("total").textContent = fmt(total);
  $("count").textContent = count;
  $("send").disabled = !ids.length;
  save();
}

function change(id, d){
  cart[id] = Math.max(0, (cart[id] || 0) + d);
  if (!cart[id]) delete cart[id];
  renderCart();
}
function drawer(on){ $("drawer").classList.toggle("on", on); $("ov").classList.toggle("on", on); }

$("grid").addEventListener("click", e => {
  const id = e.target.dataset.id;
  if (id){ change(id, 1); toast("Agregado al carrito 🛒"); }
});
$("items").addEventListener("click", e => {
  if (e.target.dataset.a) change(e.target.dataset.a, 1);
  if (e.target.dataset.m) change(e.target.dataset.m, -1);
});
$("open").onclick = () => drawer(true);
$("close").onclick = $("ov").onclick = () => drawer(false);

$("send").onclick = async () => {
  const lines = Object.keys(cart).map(id => {
    const p = PRODUCTS.find(x => x.id == id);
    return `• ${cart[id]} x ${p.n} — ${fmt(p.p * cart[id])}`;
  });
  const total = Object.keys(cart).reduce((s,id) => s + PRODUCTS.find(x => x.id == id).p * cart[id], 0);
  const name = $("name").value.trim(), notes = $("notes").value.trim();
  const msg = `¡Hola Las Papitas! 🥔 Quiero hacer un pedido:\n\n${lines.join("\n")}\n\nTotal: ${fmt(total)}`
    + (name ? `\nNombre: ${name}` : "") + (notes ? `\nNotas: ${notes}` : "");
  let copied = false;
  try { await navigator.clipboard.writeText(msg); copied = true; } catch(e){}
  toast(copied ? "¡Pedido copiado! Pegalo en el chat de Instagram 💌" : "Abrí el chat y escribí tu pedido 💌");
  window.open(`https://ig.me/m/${IG_USER}`, "_blank", "noopener");
};

$("iglink").href = `https://instagram.com/${IG_USER}`;
$("iglink").textContent = "@" + IG_USER;
renderGrid(); renderCart();
