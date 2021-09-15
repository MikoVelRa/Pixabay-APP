const formulario = document.querySelector("#form");
const RESULTS_PER_PAGE = 40;
const results = document.querySelector("#resultado");
const pager = document.querySelector("#pager");

let page = 1;

formulario.addEventListener("submit", validarFormulario);

document.addEventListener("click", e => {
   if(e.target.classList.contains("font-extrabold")){
    page = e.target.dataset.id;
    validarFormulario(e)
  }
});

function validarFormulario(e) {
  e.preventDefault();
  const inputSearchDefinition = document.querySelector('#txtCity').value;

  if (inputSearchDefinition === "") {
    //Mostrar mensaje de error clásico
    displayErrorMessage("Por favor, inserte un término de búsqueda");
    return;
  }

  // console.log(page);

  //Hacemos llamada a API
  fetch(
    `https://pixabay.com/api?key=23372427-06f5e9450609522e9c228fdcb&q=${inputSearchDefinition}&per_page=${RESULTS_PER_PAGE}&page=${page}`
  )
    .then((response) => response.json())
    .then((resultado) => {
      cleanResult(results);
      cleanResult(pager);
      if(resultado.totalHits === 0) {
        displayErrorMessage("Sin resultados");
        return;
      }
      displayImgs(resultado);
      generatePager(resultado.totalHits);
    });
}

function displayImgs(arrImgs) {

  arrImgs.hits.forEach((imagen) => {
    // console.log(imagen);
    createElement(imagen);
  });
}

function createElement(imagen) {
  const fragment = document.createDocumentFragment();
  let { previewHeight, previewWidth, likes, pageURL, previewURL, comments } =
    imagen;
  //console.log({previewHeight, previewWidth, likes, pageURL, previewURL, comments})

  const divContainer = document.createElement("div"),
    divCard = document.createElement("div"),
    image = document.createElement("img"),
    info = document.createElement("div"),
    textInfo = document.createElement("p");

  divContainer.classList.add("w-1/4", "px-auto", "py-auto");
  divCard.classList.add("bg-white", "mx-2");
  image.classList.add("w-full");
  info.classList.add("p-4");
  textInfo.classList.add("text-center", "text-sm");

  image.style.width = previewWidth;
  image.style.height = previewHeight;
  image.src = previewURL;

  divContainer.appendChild(divCard);
  divCard.appendChild(image);
  divCard.appendChild(info);
  info.appendChild(textInfo);

  textInfo.textContent = `Likes: ${likes} - Comentarios: ${comments}`;

  fragment.appendChild(divContainer);

  results.append(fragment);
}

function* generateNumPages(numResultados) {
  const numPages = Math.ceil(numResultados / RESULTS_PER_PAGE);  

  for (let i = 1; i <= numPages; i++) {
    yield i;
  }

}

function generatePager(numResultados){

  const generador = generateNumPages(numResultados);

  while(true){
    const {value, done} = generador.next();

    if(done) return;
    const page = document.createElement("button");
    page.textContent = value;    
    page.dataset.id = value;
    page.classList.add("w-8", "h-8", "bg-yellow-400", "text-center", "font-extrabold");

    pager.appendChild(page);
  }

}


function cleanResult(father) {
  while (father.firstChild) {
    father.removeChild(father.firstChild);
  }
}

function displayErrorMessage(message) {
  const mensaje = document.createElement("div");

  mensaje.textContent = message;
  mensaje.classList.add(
    "bg-red-600",
    "p-3",
    "mt-5",
    "text-white",
    "w-1/2",
    "mx-auto"
  );

  formulario.insertAdjacentElement("afterend", mensaje);

  document.querySelector("#btnSubmit").disabled = true;

  setTimeout(() => {
    mensaje.remove();
    document.querySelector("#btnSubmit").disabled = false;
  }, 3000);
}
