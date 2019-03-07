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
        console.log(reply)
        return reply.json()
    }).then(newCard => {
        console.log(newCard)
        window.location = '/collections/' + collectionId
    })
}
function getDefinitions(word) {
    // takes a word, returns a promise
    cleanWord = word.replace(' ','')
    return fetch('/define/' + word, {
        credentials: 'include'
    })
    .then(res => {
        if (!res.ok) {
            throw Error('"' + word + '" (' + res.status + ': ' + res.statusText + ')')
        }
        res.json()
    })
    .then(definitions => {
        console.log(definitions)
        let row = document.getElementById('card-row')
        let col = row.appendChild(document.createElement('div'))
            col.classList.add('col', 's12')
        let select = makeDefinitionSelect(filterDefinitions(definitions))
            select.id = 'select-definition'
        col.appendChild(select)
        let backText = document.getElementById('back');
        backText.innerText = select.firstElementChild.value
        
        M.FormSelect.init(select.firstElementChild)
        select.firstElementChild.addEventListener('change', e => {
            backText.textContent = e.target.value
        })
    })
    .catch(err => {
        M.toast({html: err.message})
        console.log(err)
    })
}

function filterDefinitions(twinwordsResponseObj) {
    return twinwordsResponseObj.definitions.reduce((acc, next) => {
        if (next.partOfSpeech in acc && acc[next.partOfSpeech].length < 4) {
                (acc[next.partOfSpeech]).push(next.definition)
        } else {
            acc[next.partOfSpeech] = Array.of(next.definition)
        }
        return acc
    }, {})
}

function makeDefinitionSelect(definitions) {
    // make container
    let container = document.createElement('div')
        container.classList.add('input-field')
    // make select
    let select = document.createElement('select')
    container.appendChild(select)
    // loop over parts of speech
    for (partOfSpeech in definitions) {
        // make an option group
        let optGroup = document.createElement('optgroup');
        optGroup.setAttribute('label', partOfSpeech);
        // loop over definitions
        definitions[partOfSpeech].forEach(definition => {
            let option = document.createElement('option')
            option.value = definition
            option.textContent = definition
            optGroup.appendChild(option)
        })
            select.appendChild(optGroup)
    }
    container.querySelector('option').setAttribute('selected', '')
    console.log(container.querySelector('option'))
    console.log('select.value', select.value)
    return container
}

function defineWordsClick(e) {
    let word = document.getElementById('front').innerText
    getDefinitions(word)
}






document.addEventListener('DOMContentLoaded', function(e) {
    // initialize 'select collection' dropdown
    M.FormSelect.init(document.getElementById('collection-picker'))
    document.getElementById('add-card-to-collection-btn')
    .addEventListener('click', addCardHandler)

    // initialize floating action button
    let fab = document.getElementById('settings-fab')
    M.FloatingActionButton.init(fab)

    // initialize tooltips
    fabTooltips = fab.querySelectorAll('.tooltipped')
    M.Tooltip.init(fabTooltips, {position: 'left', enterDelay: 100})

    // initialize dictionary button
    document.getElementById('wordsAPI-btn').addEventListener('click', defineWordsClick)
})