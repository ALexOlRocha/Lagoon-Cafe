let navbar = document.querySelector(".navbar");

document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.toggle("active");
  searchForm.classList.remove("active");
  cartItem.classList.remove("active");
};

let searchForm = document.querySelector(".search-form");

document.querySelector("#search-btn").onclick = () => {
  searchForm.classList.toggle("active");
  navbar.classList.remove("active");
  cartItem.classList.remove("active");
};

let cartItem = document.querySelector(".cart-items-container");

document.querySelector("#cart-btn").onclick = () => {
  cartItem.classList.toggle("active");
  navbar.classList.remove("active");
  searchForm.classList.remove("active");
};

window.onscroll = () => {
  navbar.classList.remove("active");
  searchForm.classList.remove("active");
  cartItem.classList.remove("active");
};
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector("form");
  const searchResultElement = document.getElementById("search-result");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = document.querySelector("input[type='search']").value;

    // Limpar o resultado anterior
    searchResultElement.innerHTML = "";

    // Realize a pesquisa e atualize o elemento de resultado
    searchInBody(searchTerm);
  });

  // Função para realizar a pesquisa no corpo da página
  function searchInBody(searchTerm) {
    const commonElementsWithText = document.querySelectorAll(
      "Home, Sobre, Produtos, Serviços, Planos, Login, Contato, p, a, li"
    );
    const matchingText = [];

    function busca(input_field, div) {
      input_field.onkeyup = function (e) {
        for (di of div.children) {
          r = new RegExp(this.value, "g");
          if (di.getAttribute("nome").toLowerCase().match(r) != null)
            di.style.removeProperty("display");
          else di.style.display = "none";
        }
      };
    }

    commonElementsWithText.forEach(function (element) {
      const elementText = element.textContent;

      if (elementText.includes(searchTerm)) {
        matchingText.push(elementText);
      }
    });

    if (matchingText.length > 0) {
      // Se houver correspondências, exiba o conteúdo completo dos elementos
      searchResultElement.innerHTML = `
	<p>Resultados da pesquisa para "${searchTerm}":</p>
	<ul>
	${matchingText.map((text) => `<li>${text}</li>`).join("")}
	</ul>
	`;
    } else {
      // Se não houver correspondências, exiba uma mensagem de não encontrado
      searchResultElement.innerHTML = `Nenhum resultado encontrado para "${searchTerm}".`;
    }
  }
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const elementsToSearch = document.querySelectorAll("h1, p");

    searchResults.innerHTML = "";

    elementsToSearch.forEach((element) => {
      const text = element.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        const item = document.createElement("li");
        item.textContent = element.textContent;

        const highlightedText = element.textContent.replace(
          new RegExp(searchTerm, "gi"),
          (match) => {
            return `<span class="highlight">${match}</span>`;
          }
        );
        item.innerHTML = highlightedText;

        searchResults.appendChild(item);
      }
    });
  });
});
