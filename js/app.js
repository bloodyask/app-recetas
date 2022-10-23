function iniciarApp(){
  const selectCategorias = document.querySelector('#categorias'); 
  const modal = new bootstrap.Modal('#modal',{});

  selectCategorias.addEventListener('change', seleccionarCategoria);

  obtenerCategorias();

  function obtenerCategorias(){
    //1º endpoint obtener categorias de comidas
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    fetch(url)
      .then( respuesta => respuesta.json() )
      .then( categorias => { 
        // console.log(categorias.categories); 
        const { categories } = categorias;
        mostrarCategorias(categories); 
      });
  }

  function mostrarCategorias( categorias ){
    // console.log( categorias );

    categorias.forEach( categoria => {
      const { strCategory } = categoria;
      
      const option = document.createElement('OPTION');
      option.textContent = strCategory;
      option.value = strCategory;
      selectCategorias.appendChild(option);
    });
  }

  async function seleccionarCategoria(e){
      const categoria = e.target.value;
      const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
      const { meals: recetas } = resultado;
      // console.log(recetas);
      mostrarRecetas(recetas);
    }
    
  function mostrarRecetas(recetas){
    const contenedorCard = document.querySelector('#resultado');;

    limpiarHtml(contenedorCard);

    const heading = document.createElement('H2');
    heading.classList.add('text-center', 'text-black', 'my-5');
    heading.textContent = recetas.length ? 'Recetas' : 'No hay Resultados';
    contenedorCard.appendChild(heading);

    // iterar en los resulados:
    recetas.forEach( receta => {
      // console.log(receta);
      const { idMeal, strMeal, strMealThumb } = receta;

      const recetaContenedor = document.createElement('DIV');
      recetaContenedor.classList.add('col-md-4'); 
      
      const recetaCard = document.createElement('DIV');
      recetaCard.classList.add('card', 'mb-4'); 
      
      const recetaImagen = document.createElement('IMG');
      recetaImagen.classList.add('card-img-top');
      recetaImagen.src = `${strMealThumb}`;
      recetaImagen.alt = `Receta de ${strMeal}`;
      
      // console.log(recetaImagen);
      
      const recetaCardBody = document.createElement('DIV');
      recetaCardBody.classList.add('card-body');
      
      const recetaHeading = document.createElement('H3');
      recetaHeading.classList.add('card-title', 'mb-3', 'altura');
      recetaHeading.textContent = strMeal;

      // console.log(recetaHeading);

      const recetaButton = document.createElement('BUTTON');
      recetaButton.classList.add('btn','btn-danger','w-100');
      recetaButton.textContent = 'Ver Receta';

      // inyectar en el DOM
      recetaCardBody.appendChild(recetaHeading);
      recetaCardBody.appendChild(recetaButton);
      
      recetaCard.appendChild(recetaImagen);      
      recetaCard.appendChild(recetaCardBody);

      recetaContenedor.appendChild(recetaCard);
      
      contenedorCard.appendChild(recetaContenedor);

      recetaButton.addEventListener('click', function(e){
        seleccionarReceta(idMeal);
      });
    });
  }

  function limpiarHtml(contenedorCard){
    while(contenedorCard.firstChild){
      contenedorCard.removeChild(contenedorCard.firstChild)
    };
  }

  async function seleccionarReceta(id){
   
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    const respuesta = await fetch(url);
    const data = await respuesta.json();
    mostrarRecetaModal(data.meals[0]);
  }

  function mostrarRecetaModal( receta ){
    console.log(receta);
    const { idMeal, strInstructions, strMeal, strMealThumb } = receta;
    const modalTitle = document.querySelector('.modal .modal-title');
    const modalBody = document.querySelector('.modal .modal-body');
    
    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `
      <img class ="img-fluid img-thumbnail" style="width: 30%; float:right; margin: 0 0 1rem 1rem;" src="${strMealThumb}" alt="Receta ${strMeal}" />
      <div> 
        <h3 class="my-3">Instrucciones</h3>
        <p>${strInstructions}</p>
      </div>
      <h3 class="my-3">Ingredientes y cantidades</h3>
    `;
    // mostrar cantidades e ingredientes
    const listGroup = document.createElement('UL');
    listGroup.classList.add('list-group');
    for(let i=1; i<=20; i++){
      if(receta[`strIngredient${i}`]){
        const ingrediente = receta[`strIngredient${i}`];
        const cantidad = receta[`strMeasure${i}`];
        
        const ingredienteLi = document.createElement('LI');
        ingredienteLi.classList.add('list-group-item');
        ingredienteLi.textContent = ingrediente;
        ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;
        listGroup.appendChild(ingredienteLi);
      }
    }
    modalBody.appendChild(listGroup);

    // mostrar modal
    modal.show();

  }
}

document.addEventListener('DOMContentLoaded', iniciarApp);