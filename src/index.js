let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyCollection = document.getElementById("toy-collection");
  // Challenge 1
  fetch("http://localhost:3000/toys")
    .then(function(response){
      return response.json();
    })
    .then(function(object) {
      // console.log(object);
      for (key in object) {
        // debugger;
        const toy = object[key];
        toyCollection.innerHTML += `
        <div class="card">
          <h2>${toy.name}</h2>
          <img src=${toy.image} class="toy-avatar" />
          <p>${toy.likes} Likes </p>
          <button class="like-btn">Like <3</button>
        </div> 
        `
      };
    });

  // Challenge 2
  document.body.addEventListener("submit", function(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const imageLink = event.target.elements.image.value;
    // conditionally add toy to page
    toyCollection.innerHTML += `
        <div class="card">
          <h2>${name}</h2>
          <img src=${imageLink} class="toy-avatar" />
          <p>0 Likes </p>
          <button class="like-btn">Like <3</button>
        </div> 
        `
    ;
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: imageLink,
        likes: 0
      })
    })
  });

  // Challenge 3
  toyCollection.addEventListener("click", function(event) {
    if (event.target.nodeName === "BUTTON") {
      // update DOM
      const likes = event.target.parentElement.children[2];
      const likesWords = likes.innerText.split(" ");
      const newLikesNumber = parseInt(likesWords[0]) + 1;
      likesWords[0] = newLikesNumber;
      likes.innerText = likesWords.join(" ");

      // update server
      const toyName = event.target.parentElement.firstElementChild.innerText;
      fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(object => {
        const toyId = object.find(element => element.name === toyName).id;
        fetch(`http://localhost:3000/toys/${toyId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            "likes": newLikesNumber
          })
        })
      })
    }
  });

});
