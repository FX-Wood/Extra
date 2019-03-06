function addCardHandler(e) {
    console.log('here')
    let front = document.getElementById('front').innerText
    let back = document.getElementById('back').innerText
    let collectionId = M.FormSelect.getInstance(document.getElementById('collection-picker')).getSelectedValues()[0]
    fetch('/cards', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({front, back, collectionId})
    }).then(reply => {
        return reply.json()
    }).then(newCard => {
        console.log(newCard)
        window.location = '/collections/' + collectionId
    })
}

document.addEventListener('DOMContentLoaded', function(e) {
    M.FormSelect.init(document.getElementById('collection-picker'))
    document.getElementById('add-card-to-collection-btn')
    .addEventListener('click', addCardHandler)
})