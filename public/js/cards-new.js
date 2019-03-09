NUM = 0;
TABS_INSTANCES = [];
TABS_ELS = [];
/*
This section will include:
addCard(): makes a new card template
*/

function addCard() {
    // makes a new card and returns the id of its container
    console.log('adding card')
    document.getElementById('house-of-cards').innerHTML += ('<div id="row-' + ++NUM +'" class="row"><div class="card-row col s12 m6"><div class="card-front card new-card valign-wrapper"><div class="card-content valign-wrapper"><span contenteditable class="card-front card-title"> Front of card </span></div></div></div><div class="col s12 m6"><div class="card new-card valign-wrapper"><div class="card-content valign-wrapper"><span contenteditable class="center-align"> Back of card</span></div></div></div>')    
    return 'row-' + NUM
}

function addMinimalCard() {
    let row = document.createElement('div');
    row.id = 'row-' + ++NUM
    row.classList.add('row');
    row.innerHTML = `<div class="col s12 m6"><div class="card card-large valign-wrapper">Front</div></div><div class="col s12 m6"><div class="card card-large valign-wrapper">Back</div></div>`
    document.getElementById('house-of-cards').append(row)
    return row.id
}

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
    let source = document.getElementById(e.currentTarget.dataset.source)
    console.log('detecting markdown event')
    console.log('etarget', e.target, 'currentTarget', e.currentTarget)
    console.log('target data', e.currentTarget.dataset.source)
    console.log('target', document.getElementById(e.target.dataset.source))
    let md = source.firstElementChild.value
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
        data = data.replace('<pre><code', '<?prettify?><pre><code')
        source.nextElementSibling.innerHTML = data

        PR.prettyPrint();
    }).catch(err => M.toast({html:err}))
}

function createMarkdownEditor(target, id) {
    let row = document.createElement('div');
        row.classList.add('row');
    let col = document.createElement('div');
        col.classList.add('col', 's12');
    row.appendChild(col);
    console.log('making row', row)
    console.log('making col', col)

    let ul = document.createElement('ul');
        ul.id = id + '-ul'
    console.log('setting ul id', ul.id)
        ul.classList.add('tabs');
    col.appendChild(ul)
    console.log('making ul', console.log(ul))
    
    let tabA = document.createElement('li');
        tabA.classList.add('tab', 'col', 's6');
    let linkA = document.createElement('a');
        linkA.textContent = 'markdown'
        linkA.href = '#' + id + '-md'
    console.log('setting linkA href', '#' + id + '-md')
    let iconA = document.createElement('i')
        iconA.classList.add('material-icons')
        iconA.textContent = 'edit'
    linkA.insertAdjacentElement('afterbegin', iconA)
    tabA.insertAdjacentElement('afterbegin', linkA)
    console.log('making tabA', tabA)
    ul.appendChild(tabA)

    let tabB = document.createElement('li');
        tabB.classList.add('tab', 'col', 's6');
    let linkB = document.createElement('a');
        linkB.textContent = 'preview'
        linkB.href = '#' + id + '-preview'
    console.log('assigning linkB href', '#' + id + '-preview')
        linkB.dataset.source = id + '-md';
        linkB.addEventListener('click', handleMarkdown)
    console.log('setting dataset source', linkB.dataset.source)
    let iconB = document.createElement('i')
        iconB.classList.add('material-icons')
        iconB.textContent = 'visibility'
    linkB.insertAdjacentElement('afterbegin', iconB)
    tabB.insertAdjacentElement('afterbegin', linkB)
    console.log('making tabB:', tabB)
    ul.appendChild(tabB)

    let markdown = document.createElement('div');
        markdown.id = id + '-md'
    console.log('setting markdown div id:', id + '-md')
        markdown.classList.add('col', 's12', 'md-wrap')
    let mdText = document.createElement('textarea')
        mdText.classList.add('mdText')
        mdText.id = id + 'text'
    console.log('making textarea', mdText)
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
            console.log({start: text.selectionStart, end: text.selectionEnd,len: text.length })
            let start = text.substring(0, e.target.selectionStart)
            let end = text.substring(e.target.selectionEnd, text.length);
            e.target.value = start + '\t' + end
            e.target.selectionStart = start.length + 1;
            e.target.selectionEnd = text.length - end.length + 1;
        }
    })
    TABS_ELS.push(ul)
    TABS_INSTANCES.push(M.Tabs.init(ul))
    
}

function newMDCard(e) {
    e.stopPropagation()
    console.log('making mdCard')
    let target = document.getElementById(addMinimalCard())
    console.log('target', target)
    let cards = Array.from(target.querySelectorAll('.card'))
    console.log('cards', cards)
    cards.forEach(function(card, i) {
        console.log('working on this card:', card)
        card.innerHTML = '';
        let id = 'row-' + NUM + '-' + 'card' + '-' + i
        createMarkdownEditor(card, id)
    })
    TABS_INSTANCES.forEach(instance => {instance.updateTabIndicator()})
}

document.addEventListener('DOMContentLoaded', function(e) {
    // initialize 'select collection' dropdown
    M.FormSelect.init(document.getElementById('collection-picker'))
    document.getElementById('add-card-to-collection-btn')
    .addEventListener('click', addCardHandler)

    // initialize floating action button
    let fab = document.getElementById('settings-fab')
    M.FloatingActionButton.init(fab)
    fab.addEventListener('click', addCard)

    // initialize tooltips
    fabTooltips = fab.querySelectorAll('.tooltipped')
    M.Tooltip.init(fabTooltips, {position: 'left', enterDelay: 100})

    // initialize dictionary button
    document.getElementById('wordsAPI-btn').addEventListener('click', defineWordsClick)

    // initialize 'make a markdown' button
    document.getElementById('markdown-btn')
    .addEventListener('click', newMDCard)
})