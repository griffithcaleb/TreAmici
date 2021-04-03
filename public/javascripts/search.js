const searchBar = document.forms["search-recipe"].querySelector('input');
searchBar.addEventListener('keyup', function(e){
    const term = e.target.value.toLowerCase();
    const recipes = document.getElementsByClassName("info");
    Array.from(recipes).forEach(function(recipe){
        const title = recipe.textContent;
        if(title.toLowerCase().indexOf(term) != -1){
            recipe.style.display = 'block';
        }else {
            recipe.style.display = 'none';
        }
    })
})


// const list = document.querySelector('#mine');

// const searchBar = document.forms["search-recipe"].querySelector('input');
// searchBar.addEventListener('keyup', function(e){
//     const term = e.target.value.toLowerCase();
    // const recipes = document.getElementsByTagName("small")    ;
    // Array.from(recipes).forEach(function(recipe){
    //     const title = recipe.textContent;
    //     if(title.toLowerCase().indexOf(derm) != -1){
    //         recipe.style.display = 'block';
    //     }else {
    //         recipe.style.display = 'none';
    //     }
    // })
// })