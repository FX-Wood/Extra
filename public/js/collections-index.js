function addCollection(e) {
    fetch('/collections', {
        method: "POST",
        credentials: "include"
    }).then(response => {
        return response.json()
    }).then(collection  => {
        let parent = document.getElementById('collections')
        let card = document.createElement('div')
            card.classList.add('card', 'hoverable', 'waves-effect')

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
        card.addEventListener('mousedown', mouseDownEditCheck)
    }).catch(error => {
        M.Toast(error.name + ': ' + error.message)
        console.log(error)
    })
}

function mouseDownEditCheck(e) {
    let target = e.currentTarget
    console.log('mousedown')
    console.log('currentTarget', target)
    let timer = setTimeout(() => {
        console.log('timeout')
        editCollection(target)
    }, 1100)
    window.addEventListener('mouseup', (e) => {
        console.log('mouseup')
        clearTimeout(timer)
    }, {once: true})
}

function editCollection(target) {
    console.log('editing');
    console.log('target', target);
    // remove edit-triggering event listener
    target.removeEventListener('mousedown', mouseDownEditCheck)
    target.classList.remove('waves-effect');
    // make the content editable
    Array.from(target.firstElementChild.children).forEach(child => {
        child.contentEditable = true;
    })
    // create a 'done' button
    let done = document.createElement('button');
        done.classList.add('btn', 'right');
        done.addEventListener('click', doneClick);
        done.textContent = "Done editing";
    let icon = document.createElement('i')
        icon.textContent = 'check';
        icon.classList.add('material-icons','left');
        done.appendChild(icon)

    target.firstElementChild.insertAdjacentElement('afterbegin', done)
}

function doneClick(e) {
    let card = e.target.parentElement.parentElement
    // remove button
    e.currentTarget.parentElement.removeChild(e.currentTarget)
    // make content uneditable
    Array.from(card.firstElementChild.children).forEach(child => {
        child.contentEditable = false;
    })
    // reset classes
    card.classList.add('waves-effect')
    card.addEventListener('mousedown', mouseDownEditCheck)
    // collect string data
    let id = card.id.slice(3)
    let title = card.querySelector('.card-title').innerText
    let description = card.querySelector('.collection-description').innerText
    console.log(JSON.stringify({title,description}))
    
    fetch('/collections/' + id, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({title, description})
    }).then(reply => {
        console.log('got a reply, parsing')
        return reply.json()
    }).then(collection => {
        console.log('this is what you got back:', collection)
        
    }).catch(error => {
        console.log(error, error.message)
    })
}

document.addEventListener('DOMContentLoaded', (e) => {
    // set listener for 'new collection button'
    document.getElementById('new-collection-btn')
        .addEventListener('click', addCollection);
    // set listeners for collection editing 'mousehold'
    Array.from(document.getElementById('collections').children)
        .forEach(child => {
            child.addEventListener('mousedown', mouseDownEditCheck)
        })
})

