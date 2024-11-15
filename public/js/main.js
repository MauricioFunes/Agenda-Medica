// Selecciona todos los elementos de enlace en la barra de navegación
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    // Si el enlace coincide con la URL actual, agrega la clase 'active'
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mouseover", () => {
      card.classList.add("shadow-lg");
    });
    card.addEventListener("mouseout", () => {
      card.classList.remove("shadow-lg");
    });
  });
});
