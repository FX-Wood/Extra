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

/*
The following section includes:
    getDefinitions(): gets twinword api from extra server

    filterDefinitions(): sorts definitions by part of speech and limits their number

    makeDefinitionSelect(): creates and initializes the select element that holds the definitions

    defineWordsClick(): the click handler that kicks off the functions in this section
*/

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

/*

This section will include:

button in fab menu

put 2 tabs on cards

switch cards to text inputs

make ajax request for parsing

render reply

toast any errors

*/
function handleMarkdown(e) {
    console.log('detecting markdown event')
    console.log('target', e.target)
    let md = e.target.value
    console.log('fetching rendered markdown')
    console.log(JSON.stringify({md}))
    fetch('/parsemd', {
        method: 'POST',
        credentials: 'include',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({md})
    }).then(reply => {
        console.log('reply', reply)
        console.log('reply.body', reply.body)
        return reply.text()
    }).then(data => {
        console.log('data', data)
        e.target.parentElement.nextElementSibling.innerHTML = data
    }).catch(err => M.toast({html:err}))
}

function createMarkdownEditor(target, id) {
    let row = document.createElement('div');
        row.classList.add('row');
    let col = document.createElement('div');
        col.classList.add('col', 's12');
    row.appendChild(col);

    let ul = document.createElement('ul');
        ul.classList.add('tabs');
    col.appendChild(ul)
    
    let tabA = document.createElement('li');
        tabA.classList.add('tab', 'col', 's6');
    let linkA = document.createElement('a');
        linkA.classList.add('active')
        linkA.textContent = 'markdown'
        linkA.href = '#' + id + '-md'
    let iconA = document.createElement('i')
        iconA.classList.add('material-icons')
        iconA.textContent = 'edit'
    linkA.insertAdjacentElement('afterbegin', iconA)
    tabA.insertAdjacentElement('afterbegin', linkA)
    ul.appendChild(tabA)

    let tabB = document.createElement('li');
        tabB.classList.add('tab', 'col', 's6');
    let linkB = document.createElement('a');
        linkB.textContent = 'preview'
        linkB.href = '#' + id + '-preview'
        linkB.addEventListener('click', PR.prettyPrint)
    let iconB = document.createElement('i')
        iconB.classList.add('material-icons')
        iconB.textContent = 'visibility'
    linkB.insertAdjacentElement('afterbegin', iconB)
    tabB.insertAdjacentElement('afterbegin', linkB)
    ul.appendChild(tabB)

    let markdown = document.createElement('div');
        markdown.id = id + '-md'
        markdown.classList.add('col', 's12', 'md-wrap')
    let mdText = document.createElement('textarea')
        mdText.classList.add('mdText')
        mdText.addEventListener('input', handleMarkdown)
    markdown.appendChild(mdText)
    target.appendChild(markdown)

    let preview = document.createElement('div');
        preview.id = id + '-preview'
        preview.classList.add('col', 's12', 'preview-wrap')
    target.appendChild(preview)
    console.log(target)
    target.insertAdjacentElement('beforebegin', row)

    // resizes text area for given input
    mdText.setAttribute('style', 'height:' + (mdText.scrollHeight) + 'px;overflow-y:hidden;');
    mdText.addEventListener("input", resizeTextarea, false);

    function resizeTextarea() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    }
    // makes tab key indent on textarea
    mdText.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
            e.preventDefault()
            let text = e.target.value
            let start = text.substring(0, e.target.selectionStart)
            let end = text.substring(e.target.selectionEnd, text.length);
            e.target.value = start + '\t' + end
        }
    })
    return M.Tabs.init(ul)
}




function mutateCards() {
    console.log('mutating cards')
    let cards = Array.from(document.getElementsByClassName('card'))
    cards.forEach((card, i) => {
        console.log('working on this card:', card)
        while(card.firstElementChild) {
            card.removeChild(card.firstElementChild)
        }
        createMarkdownEditor(card, i)
    })
}

function markdownHandler(e) {

}

document.addEventListener('DOMContentLoaded', function(e) {
    // initialize 'select collection' dropdown
    M.FormSelect.init(document.getElementById('collection-picker'))
    document.getElementById('add-card-to-collection-btn')
    .addEventListener('click', addCardHandler)

    // initialize 'make a markdown' button
    document.getElementById('markdown-btn')
    .addEventListener('click', mutateCards)
    // initialize floating action button
    let fab = document.getElementById('settings-fab')
    M.FloatingActionButton.init(fab)

    // initialize tooltips
    fabTooltips = fab.querySelectorAll('.tooltipped')
    M.Tooltip.init(fabTooltips, {position: 'left', enterDelay: 100})

    // initialize dictionary button
    document.getElementById('wordsAPI-btn').addEventListener('click', defineWordsClick)
})