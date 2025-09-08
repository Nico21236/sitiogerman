document.addEventListener("DOMContentLoaded", () => { 
  /* ===============================
   CARRUSEL DESLIZANTE
  =============================== */
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const dots = Array.from(document.querySelectorAll(".carousel-indicators .dot"));
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  (function() {
  const carru = document.getElementById("carrunintendo");
  if (!carru) return;

  const track = carru.querySelector(".nintendo-track");
  const slides = Array.from(track.children);
  const prevBtn = carru.querySelector(".n-btn.prev");
  const nextBtn = carru.querySelector(".n-btn.next");

  let index = 0;
  let slideWidth = slides[0].getBoundingClientRect().width + 20; // ancho + margen
  let interval;

  function goToSlide(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  function next() { goToSlide(index + 1); }
  function prev() { goToSlide(index - 1); }

  function startAuto() { interval = setInterval(next, 2000); }
  function stopAuto() { clearInterval(interval); }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  carru.addEventListener("mouseenter", stopAuto);
  carru.addEventListener("mouseleave", startAuto);

  startAuto();

  // Eventos de botones
  slides.forEach(slide => {
    const btnCart = slide.querySelector(".btn");
    const btnBuy = slide.querySelector(".btn-buy");

    if (btnCart) {
      btnCart.addEventListener("click", () => {
        const nombre = slide.querySelector("h3")?.innerText;
        const precio = parseInt(btnCart.dataset.precio);
        const imagen = slide.querySelector("img")?.src;

        const existente = carrito.find(p => p.nombre === nombre);
        if (existente) existente.cantidad++;
        else carrito.push({ nombre, precio, imagen, cantidad: 1 });

        guardarYActualizar();
      });
    }

    if (btnBuy) {
      btnBuy.addEventListener("click", () => {
        const nombre = slide.querySelector("h3")?.innerText;
        const precio = parseInt(btnBuy.dataset.precio);
        const imagen = slide.querySelector("img")?.src;

        const existente = carrito.find(p => p.nombre === nombre);
        if (existente) existente.cantidad++;
        else carrito.push({ nombre, precio, imagen, cantidad: 1 });

        guardarYActualizar();
        window.location.href = "pago.html";
      });
    }
  });
})();

  let currentIndex = 0;
  let autoTimer = null;

  function updateSlide() {
    if (!track) return;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (dots.length) {
      dots.forEach((d, idx) => d.classList.toggle("active", idx === currentIndex));
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 2000); // 🔥 cada 2s
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); startAuto(); });

  if (dots.length) {
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSlide();
        startAuto();
      });
    });
  }

  if (track) {
    track.addEventListener("mouseenter", stopAuto);
    track.addEventListener("mouseleave", startAuto);
  }

  updateSlide();
  startAuto();

  /* ===============================
     AYUDA / FAQ
  =============================== */
  const helpBubble = document.getElementById("helpBubble");
  const helpMenu = document.getElementById("helpMenu");

  if (helpBubble && helpMenu) {
    helpBubble.addEventListener("click", () => {
      helpMenu.style.display = (helpMenu.style.display === "block" ? "none" : "block");
    });
  }

  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      if (answer) {
        answer.style.display = (answer.style.display === "block" ? "none" : "block");
      }
    });
  });

  /* ===============================
     MINI CARRITO
  =============================== */
  const cartIcon = document.getElementById("cart-icon");
  const miniCart = document.getElementById("mini-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartSubtotal = document.getElementById("cart-subtotal");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function actualizarMiniCarrito() {
    if (!cartCount) return;

    let total = 0;
    let count = 0;

    if (cartItemsContainer && cartSubtotal) {
      cartItemsContainer.innerHTML = "";
    }

    carrito.forEach((item, i) => {
      total += item.precio * item.cantidad;
      count += item.cantidad;

      if (cartItemsContainer) {
        const row = document.createElement("div");
        row.className = "mini-cart-item";
        row.innerHTML = `
          <img src="${item.imagen}" alt="${item.nombre}">
          <span>${item.nombre}</span>
          <span>
            <button class="btn-restar" data-i="${i}">➖</button>
            ${item.cantidad}
            <button class="btn-sumar" data-i="${i}">➕</button>
          </span>
          <span>$${(item.precio * item.cantidad).toLocaleString("es-CL")}</span>
        `;
        cartItemsContainer.appendChild(row);
      }
    });

    cartCount.textContent = count;
    if (cartSubtotal) cartSubtotal.textContent = `Subtotal: $${total.toLocaleString("es-CL")}`;

    if (cartItemsContainer) {
      cartItemsContainer.querySelectorAll(".btn-sumar").forEach(b => {
        b.addEventListener("click", () => {
          const i = +b.dataset.i;
          carrito[i].cantidad++;
          guardarYActualizar();
        });
      });
      cartItemsContainer.querySelectorAll(".btn-restar").forEach(b => {
        b.addEventListener("click", () => {
          const i = +b.dataset.i;
          carrito[i].cantidad--;
          if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
          guardarYActualizar();
        });
      });
    }
  }

  function guardarYActualizar() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarMiniCarrito();
    actualizarCarritoPagina();
  }

  if (cartIcon && miniCart) {
    cartIcon.addEventListener("click", () => miniCart.classList.toggle("show"));
  }

document.querySelectorAll(".producto .btn, .f-card .btn, .n-card .btn, .p-card .btn, .x-card .btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const card = e.target.closest(".producto, .f-card, .n-card, .p-card, .x-card");
    if (!card) return;

    const nombre = card.querySelector("h3")?.textContent || "Producto";
    const precio = parseInt(btn.getAttribute("data-precio") || "0", 10);
    const imagen = card.querySelector("img")?.src || "";

    const existente = carrito.find(p => p.nombre === nombre);
    if (existente) existente.cantidad++;
    else carrito.push({ nombre, precio, imagen, cantidad: 1 });

    guardarYActualizar();
  });
});


  /* ===============================
     BOTÓN COMPRAR AHORA (normal + carrusel)
  =============================== */
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-buy")) {
      const card = e.target.closest(".producto, .f-card, .n-card, .p-card, .x-card");
      if (!card) return;

      const nombre = card.querySelector("h3")?.textContent || "Producto";
      const precio = parseInt(e.target.getAttribute("data-precio") || "0", 10);
      const imagen = card.querySelector("img")?.src || "";

      const existente = carrito.find(p => p.nombre === nombre);
      if (existente) existente.cantidad++;
      else carrito.push({ nombre, precio, imagen, cantidad: 1 });

      guardarYActualizar();
      window.location.href = "pago.html";
    }
  });

  /* ===============================
     PRODUCTOS DISPONIBLES
  =============================== */
  const productos = [
    { nombre: "Playstation 4 Slim", precio: 299990, imagen: "img/ps4.png" },
    { nombre: "Control PS4", precio: 45990, imagen: "img/controlps4.png" },
    { nombre: "Grand Theft Auto V (PS4)", precio: 25000, imagen: "img/gta5ps4.webp" },
    { nombre: "Watch Dogs (PS4)", precio: 35000, imagen: "img/Watchdogs.webp" },
    { nombre: "Playstation 5", precio: 569990, imagen: "img/Ps5.avif" },
    { nombre: "Xbox Series X", precio: 589999, imagen: "img/Xbox serie X White.webp" },
    { nombre: "Far Cry 5 (Xbox Series X)", precio: 40000, imagen: "img/farcry5.jpg" },
    { nombre: "Nintendo Switch", precio: 414990, imagen: "img/Nintendo Switch1.jfif" },
    { nombre: "Nintendo 3DS", precio: 220000, imagen: "img/nintendo3ds.avif" },
    { nombre: "Mario Kart 8 Deluxe", precio: 60000, imagen: "img/mariokart8.webp" },
    { nombre: "Mortal Kombat 1 (Nintendo Switch)", precio: 39000, imagen: "img/mortalkombat1.webp" },
    { nombre: "Mortal Kombat 11 Ultimate (Nintendo Switch)", precio: 60000, imagen: "img/mortalkombat11.jfif" }
  ];

  /* ===============================
     BUSCADOR -> Redirige a busqueda.html
  =============================== */
  const input = document.getElementById("searchInput");
  const btnBuscar = document.getElementById("searchBtn");

  if (input && btnBuscar) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        window.location.href = `busqueda.html?q=${encodeURIComponent(input.value)}`;
      }
    });
    btnBuscar.addEventListener("click", () => {
      window.location.href = `busqueda.html?q=${encodeURIComponent(input.value)}`;
    });
  }

  /* ===============================
   PÁGINA DE RESULTADOS (busqueda.html)
  =============================== */
  if (window.location.pathname.includes("busqueda.html")) {
    const resultadosWrap = document.getElementById("busqueda-resultados");
    const params = new URLSearchParams(window.location.search);
    const term = (params.get("q") || "").trim().toLowerCase();

    if (resultadosWrap) {
      resultadosWrap.innerHTML = "";
      resultadosWrap.className = "productos";

      if (!term) {
        resultadosWrap.innerHTML = `<p>Escribe algo para buscar.</p>`;
      } else {
        let resultados = productos.filter(p => p.nombre.toLowerCase().includes(term));

        if (resultados.length > 0) {
          resultados.forEach(p => {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
              <a href="producto.html?nombre=${encodeURIComponent(p.nombre)}&precio=${p.precio}&img=${encodeURIComponent(p.imagen)}">
                <img src="${p.imagen}" alt="${p.nombre}">
              </a>
              <h3>${p.nombre}</h3>
              <p class="precio">$${p.precio.toLocaleString("es-CL")}</p>
              <button class="btn" data-nombre="${p.nombre}" data-precio="${p.precio}" data-imagen="${p.imagen}">Agregar al carrito</button>
              <button class="btn-buy" data-nombre="${p.nombre}" data-precio="${p.precio}" data-imagen="${p.imagen}">Comprar ahora</button>
            `;
            resultadosWrap.appendChild(div);
          });

          // 🔹 Conectar eventos a los botones generados dinámicamente
          resultadosWrap.querySelectorAll(".btn").forEach(btn => {
            btn.addEventListener("click", () => {
              const nombre = btn.dataset.nombre;
              const precio = parseInt(btn.dataset.precio, 10);
              const imagen = btn.dataset.imagen;

              const existente = carrito.find(p => p.nombre === nombre);
              if (existente) existente.cantidad++;
              else carrito.push({ nombre, precio, imagen, cantidad: 1 });

              guardarYActualizar();
            });
          });

          resultadosWrap.querySelectorAll(".btn-buy").forEach(btn => {
            btn.addEventListener("click", () => {
              const nombre = btn.dataset.nombre;
              const precio = parseInt(btn.dataset.precio, 10);
              const imagen = btn.dataset.imagen;

              const existente = carrito.find(p => p.nombre === nombre);
              if (existente) existente.cantidad++;
              else carrito.push({ nombre, precio, imagen, cantidad: 1 });

              guardarYActualizar();
              window.location.href = "pago.html";
            });
          });
        } else {
          resultadosWrap.innerHTML = `<p>No se encontraron productos para "${term}"</p>`;
        }
      }
    }
  }

  /* ===============================
     BOTONES DEL MINI-CARRITO
  =============================== */
  const btnCarrito = document.querySelector(".btn-cart");
  if (btnCarrito) {
    btnCarrito.addEventListener("click", () => {
      window.location.href = "carrito.html";
    });
  }

  const btnCheckout = document.querySelector(".btn-checkout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      window.location.href = "pago.html";
    });
  }

  /* ===============================
     CARRITO EN carrito.html
  =============================== */
  const cartPageItems = document.getElementById("cart-page-items");
  const cartPageSubtotal = document.getElementById("cart-page-subtotal");
  const cartPageTotal = document.getElementById("cart-page-total");
  const btnPagar = document.getElementById("btnPagar");

  function actualizarCarritoPagina() {
    if (!cartPageItems) return;

    cartPageItems.innerHTML = "";
    let subtotal = 0;

    if (carrito.length === 0) {
      const fila = document.createElement("tr");
      fila.innerHTML = `<td colspan="4" style="text-align:center; padding:20px;">Tu carrito está vacío 😢</td>`;
      cartPageItems.appendChild(fila);
    } else {
      carrito.forEach((item, i) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td><img src="${item.imagen}" width="50"> ${item.nombre}</td>
          <td>$${item.precio.toLocaleString("es-CL")}</td>
          <td>
            <button class="btn-restar" data-i="${i}">➖</button>
            ${item.cantidad}
            <button class="btn-sumar" data-i="${i}">➕</button>
          </td>
          <td>$${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
        `;
        cartPageItems.appendChild(fila);
        subtotal += item.precio * item.cantidad;
      });
    }

    if (cartPageSubtotal) cartPageSubtotal.textContent = `Subtotal: $${subtotal.toLocaleString("es-CL")}`;
    if (cartPageTotal) cartPageTotal.textContent = `Total: $${subtotal.toLocaleString("es-CL")}`;

    cartPageItems.querySelectorAll(".btn-sumar").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = +btn.dataset.i;
        carrito[i].cantidad++;
        guardarYActualizar();
      });
    });
    cartPageItems.querySelectorAll(".btn-restar").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = +btn.dataset.i;
        carrito[i].cantidad--;
        if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
        guardarYActualizar();
      });
    });

    if (btnPagar) {
      if (carrito.length === 0) {
        btnPagar.disabled = true;
        btnPagar.style.opacity = "0.5";
        btnPagar.style.cursor = "not-allowed";
      } else {
        btnPagar.disabled = false;
        btnPagar.style.opacity = "1";
        btnPagar.style.cursor = "pointer";
      }
    }
  }

  /* ===============================
     DETALLE DEL PRODUCTO
  =============================== */
  if (window.location.pathname.includes("producto.html")) {
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get("nombre");
    const precio = params.get("precio");
    const imagen = params.get("img");

    if (nombre && precio && imagen) {
      document.getElementById("detalleNombre").textContent = nombre;
      document.getElementById("detallePrecio").textContent = `$${parseInt(precio, 10).toLocaleString("es-CL")}`;
      document.getElementById("detalleImagen").src = imagen;

      document.getElementById("btnAgregar").addEventListener("click", () => {
        const existente = carrito.find(p => p.nombre === nombre);
        if (existente) {
          existente.cantidad++;
        } else {
          carrito.push({ nombre, precio: parseInt(precio, 10), imagen, cantidad: 1 });
        }
        guardarYActualizar();
      });

      document.getElementById("btnComprar").addEventListener("click", () => {
        const existente = carrito.find(p => p.nombre === nombre);
        if (existente) {
          existente.cantidad++;
        } else {
          carrito.push({ nombre, precio: parseInt(precio, 10), imagen, cantidad: 1 });
        }
        guardarYActualizar();
        window.location.href = "pago.html";
      });
    } else {
      document.querySelector("main").innerHTML = "<p>Producto no encontrado 😢</p>";
    }
  }

  actualizarMiniCarrito();
  actualizarCarritoPagina();
});
/* ============================
   PRODUCTOS DESTACADOS (id="featured")
   Loop infinito + puntitos
============================ */
(() => {
  const getCols = () =>
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cols')) || 5;

  const carousel = document.getElementById('featured');
  if (!carousel) return;

  const viewport = carousel.querySelector('.featured-viewport');
  const track    = carousel.querySelector('.featured-track');
  const prevBtn  = carousel.querySelector('.f-btn.prev');
  const nextBtn  = carousel.querySelector('.f-btn.next');
  const indicators = carousel.querySelector('#dots-destacados') ||
                     carousel.querySelector('.carousel-indicators');

  const GAP = 16;
  const originals = Array.from(track.children); // tarjetas originales

  // --- Crear puntitos: 1 por cada tarjeta original
  if (indicators) {
    indicators.innerHTML = '';
    originals.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        goTo(cols + i); // saltar al "slot" lógico (después de los clones de cola)
      });
      indicators.appendChild(dot);
    });
  }
  const dots = indicators ? Array.from(indicators.querySelectorAll('.dot')) : [];

  // --- Clones para loop infinito (mismo patrón que ya usabas)
  let cols = getCols();
  const clonesHead  = originals.slice(0, cols).map(n => n.cloneNode(true));
  const clonesTail  = originals.slice(-cols).map(n => n.cloneNode(true));
  clonesTail.forEach(n => track.insertBefore(n, track.firstChild));
  clonesHead.forEach(n => track.appendChild(n));

  let index = cols;  // empezamos tras los clones de cola
  let cardWidth = 0;
  let timer = null;

  function measure() {
    cols = getCols();
    const visible = viewport.clientWidth;
    cardWidth = (visible - GAP * (cols - 1)) / cols + GAP;
    jumpTo(index, false);
    paintDots();
  }

  function jumpTo(i, animate = true) {
    track.style.transition = animate ? 'transform .5s ease' : 'none';
    track.style.transform  = `translateX(-${i * cardWidth}px)`;
  }

  function normalize() {
    const total = track.children.length;

    // Si nos pasamos al bloque de clones del final: volvemos al primer real
    if (index >= total - cols) {
      index = cols;
      jumpTo(index, false);
    }
    // Si retrocedemos a los clones del principio: volvemos al último real
    if (index < cols) {
      index = total - cols - 1;
      jumpTo(index, false);
    }
  }

  function logicalIndex() {
    // índice lógico (0..originals.length-1), corrigiendo clones de cola
    const li = (index - cols) % originals.length;
    return li < 0 ? li + originals.length : li;
  }

  function paintDots() {
    if (!dots.length) return;
    const li = logicalIndex();
    dots.forEach((d, i) => d.classList.toggle('active', i === li));
  }

  function next() {
    index++;
    jumpTo(index, true);
    setTimeout(() => { normalize(); paintDots(); }, 510);
  }

  function prev() {
    index--;
    jumpTo(index, true);
    setTimeout(() => { normalize(); paintDots(); }, 510);
  }

  function goTo(i) {
    index = i;
    jumpTo(index, true);
    setTimeout(() => { normalize(); paintDots(); }, 510);
  }

  function startAuto() { stopAuto(); timer = setInterval(next, 2000); }
  function stopAuto()  { if (timer) { clearInterval(timer); timer = null; } }

  // eventos
  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  window.addEventListener('resize', measure);

  // arranque
  requestAnimationFrame(() => {
    measure();
    jumpTo(index, false);
    paintDots();
    startAuto();
  });
})();

/* ============================
   CARRUSEL NINTENDO (loop infinito con puntitos)
============================ */
(function () {
  const carru = document.getElementById("carrunintendo");
  if (!carru) return;

  const viewport = carru.querySelector(".nintendo-viewport"); // 🔥 contenedor visible
  const track    = carru.querySelector(".nintendo-track");
  const slides   = Array.from(track.children);
  const prevBtn  = carru.querySelector(".n-btn.prev");
  const nextBtn  = carru.querySelector(".n-btn.next");
  const indicators = carru.querySelector(".carousel-indicators");

  const GAP = 16;
  let index;
  let slideWidth;
  let interval;

  // Clonar inicio y fin para loop
  const clonesHead = slides.map(s => s.cloneNode(true));
  const clonesTail = slides.map(s => s.cloneNode(true));
  clonesHead.forEach(s => track.appendChild(s));
  clonesTail.reverse().forEach(s => track.insertBefore(s, track.firstChild));

  index = slides.length; // empezamos después de los clones de cola

  // Crear puntitos
  indicators.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i + slides.length)); // 🔥 ajuste por clones
    indicators.appendChild(dot);
  });
  const dots = indicators.querySelectorAll(".dot");

  function paintDots() {
    dots.forEach((d, i) => d.classList.toggle("active", i === (index % slides.length)));
  }

  function measure() {
    slideWidth = slides[0].getBoundingClientRect().width + GAP;
    jumpTo(index, false);
  }

  function jumpTo(i, animate = true) {
    track.style.transition = animate ? "transform .5s ease" : "none";
    track.style.transform  = `translateX(-${i * slideWidth}px)`;
  }

  function normalize() {
    const total = track.children.length;
    if (index >= total - slides.length) {
      index = slides.length; // vuelve al inicio real
      jumpTo(index, false);
    }
    if (index < slides.length) {
      index = total - slides.length * 2; // vuelve al final real
      jumpTo(index, false);
    }
    paintDots();
  }

  function goToSlide(i) {
    index = i;
    jumpTo(index);
    setTimeout(normalize, 510);
  }

  function next() { goToSlide(index + 1); }
  function prev() { goToSlide(index - 1); }

  function startAuto() { stopAuto(); interval = setInterval(next, 2000); }
  function stopAuto() { if (interval) clearInterval(interval); }

  // eventos
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  carru.addEventListener("mouseenter", stopAuto);
  carru.addEventListener("mouseleave", startAuto);
  window.addEventListener("resize", measure);

  // arranque
  measure();
  jumpTo(index, false);
  startAuto();
})();
/* =========================
   Carrusel PlayStation (loop infinito con puntitos)
========================= */
(function () {
  const carru = document.getElementById("carruplay");
  if (!carru) return;

  const viewport = carru.querySelector(".play-viewport");
  const track    = carru.querySelector(".play-track");
  const slides   = Array.from(track.children);
  const prevBtn  = carru.querySelector(".p-btn.prev");
  const nextBtn  = carru.querySelector(".p-btn.next");
  const indicators = carru.querySelector("#dots-play");

  const GAP = 16;
  let index;
  let slideWidth;
  let interval;

  // Clonar inicio y fin para loop
  const clonesHead = slides.map(s => s.cloneNode(true));
  const clonesTail = slides.map(s => s.cloneNode(true));
  clonesHead.forEach(s => track.appendChild(s));
  clonesTail.reverse().forEach(s => track.insertBefore(s, track.firstChild));

  index = slides.length; // empezamos después de los clones

  // Crear puntitos
  indicators.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i + slides.length));
    indicators.appendChild(dot);
  });
  const dots = indicators.querySelectorAll(".dot");

  function paintDots() {
    dots.forEach((d, i) => d.classList.toggle("active", i === (index % slides.length)));
  }

  function measure() {
    slideWidth = slides[0].getBoundingClientRect().width + GAP;
    jumpTo(index, false);
  }

  function jumpTo(i, animate = true) {
    track.style.transition = animate ? "transform .5s ease" : "none";
    track.style.transform  = `translateX(-${i * slideWidth}px)`;
  }

  function normalize() {
    const total = track.children.length;
    if (index >= total - slides.length) {
      index = slides.length;
      jumpTo(index, false);
    }
    if (index < slides.length) {
      index = total - slides.length * 2;
      jumpTo(index, false);
    }
    paintDots();
  }

  function goToSlide(i) {
    index = i;
    jumpTo(index);
    setTimeout(normalize, 510);
  }

  function next() { goToSlide(index + 1); }
  function prev() { goToSlide(index - 1); }

  function startAuto() { stopAuto(); interval = setInterval(next, 2000); }
  function stopAuto() { if (interval) clearInterval(interval); }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  carru.addEventListener("mouseenter", stopAuto);
  carru.addEventListener("mouseleave", startAuto);
  window.addEventListener("resize", measure);

  measure();
  jumpTo(index, false);
  startAuto();
})();

/* =========================
   Carrusel Xbox (loop infinito con puntitos)
========================= */
(function () {
  const carru = document.getElementById("carruxbox");
  if (!carru) return;

  const viewport = carru.querySelector(".xbox-viewport");
  const track    = carru.querySelector(".xbox-track");
  const slides   = Array.from(track.children);
  const prevBtn  = carru.querySelector(".x-btn.prev");
  const nextBtn  = carru.querySelector(".x-btn.next");
  const indicators = carru.querySelector("#dots-xbox");

  const GAP = 16;
  let index;
  let slideWidth;
  let interval;

  // Clonar inicio y fin para loop
  const clonesHead = slides.map(s => s.cloneNode(true));
  const clonesTail = slides.map(s => s.cloneNode(true));
  clonesHead.forEach(s => track.appendChild(s));
  clonesTail.reverse().forEach(s => track.insertBefore(s, track.firstChild));

  index = slides.length;

  // Crear puntitos
  indicators.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i + slides.length));
    indicators.appendChild(dot);
  });
  const dots = indicators.querySelectorAll(".dot");

  function paintDots() {
    dots.forEach((d, i) => d.classList.toggle("active", i === (index % slides.length)));
  }

  function measure() {
    slideWidth = slides[0].getBoundingClientRect().width + GAP;
    jumpTo(index, false);
  }

  function jumpTo(i, animate = true) {
    track.style.transition = animate ? "transform .5s ease" : "none";
    track.style.transform  = `translateX(-${i * slideWidth}px)`;
  }

  function normalize() {
    const total = track.children.length;
    if (index >= total - slides.length) {
      index = slides.length;
      jumpTo(index, false);
    }
    if (index < slides.length) {
      index = total - slides.length * 2;
      jumpTo(index, false);
    }
    paintDots();
  }

  function goToSlide(i) {
    index = i;
    jumpTo(index);
    setTimeout(normalize, 510);
  }

  function next() { goToSlide(index + 1); }
  function prev() { goToSlide(index - 1); }

  function startAuto() { stopAuto(); interval = setInterval(next, 2000); }
  function stopAuto() { if (interval) clearInterval(interval); }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  carru.addEventListener("mouseenter", stopAuto);
  carru.addEventListener("mouseleave", startAuto);
  window.addEventListener("resize", measure);

  measure();
  jumpTo(index, false);
  startAuto();
})();
document.getElementById("searchBtn").addEventListener("click", buscar);
document.getElementById("searchInput").addEventListener("keypress", e => {
  if (e.key === "Enter") buscar();
});

function buscar() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  window.location.href = "categoria.html?q=" + encodeURIComponent(query);
}



