function addCollection(e) {
    fetch('/collections', {
        method: "POST",
        credentials: "include"
    }).then(response => {
        return response.json()
    }).then(collection  => {
        let parent = document.getElementById('collections')
        let card = document.createElement('div')
            card.classList.add('card', 'hoverable')

        let cardContent = document.createElement('div')
            cardContent.classList.add('card-content')

        let cardTitle = document.createElement('span')
            cardTitle.classList.add('card-title');
            cardTitle.textContent = collection.name
        
        let cardDesc = document.createElement('p');
            cardDesc.textContent = collection.description
        
        card.appendChild(cardContent)
            .appendChild(cardTitle).parentElement
            .appendChild(cardDesc)
        parent.insertAdjacentElement('afterbegin', card)
    }).catch(error => {
        M.Toast(error.name + ': ' + error.message)
        console.log(error)
    })
}

function mouseDownHandler(e) {
    var MOUSE_IS_DOWN = true
    var TIMER_HANDLE = setInterval(function() {
        if (MOUSE_IS_DOWN) {
            editCollection(e.target)
        }
    }, 500)
}

function mouseUpHandler(e) {

}

function editCollection(e) {

}



document.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById('new-collection-btn')
        .addEventListener('click', addCollection)
})

