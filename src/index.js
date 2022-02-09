let addToy = false;
const toyCollection = document.getElementById('toy-collection');
const form = document.querySelector('.add-toy-form');

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
});

function getToys() {
  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(toys => toys.map(toy => makeCard(toy)));
}
getToys();

function makeCard(toy) {
  let toyDiv = document.createElement('div');
  toyDiv.classList.add('card');
  let toyName = document.createElement('h2');
  toyName.textContent = toy.name;
  let toyImg = document.createElement('img');
  toyImg.src = toy.image;
  toyImg.classList.add('toy-avatar');
  let toyLikes = document.createElement('p');
  toyLikes.textContent = `${toy.likes} Likes`
  let toyButton = document.createElement('button');
  toyButton.classList.add('like-btn');
  toyButton.id = toy.id;
  toyButton.textContent = 'Like';

  toyDiv.appendChild(toyName);
  toyDiv.appendChild(toyImg);
  toyDiv.appendChild(toyLikes);
  toyDiv.appendChild(toyButton);

  toyCollection.appendChild(toyDiv);

  toyButton.addEventListener('click', () => {
    ++toy.likes;
    toyLikes.textContent = `${toy.likes} Likes`;
    patchLikes(toy, toy.likes);
  });
}

form.addEventListener('submit', function(e){
  e.preventDefault();
  let newToyName = (e.target.name.value);
  let newToyImg = (e.target.image.value);
  fetch('http://localhost:3000/toys',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      'name': newToyName,
      'image': newToyImg,
      'likes': 0
    })
  })
  .then(resp => resp.json())
  .then(toy => makeCard(toy));
})

function patchLikes(toy,likes) {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      'likes': likes
    })
  })
  .then(resp => resp.json())
  .then(card => console.log(card));
}