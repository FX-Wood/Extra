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
    let row = document.createElement('div')
    row.classList.add('row')
    row.id = 'row-' + ++NUM
    row.innerHTML += '<div class="col s12 m6"><div class="card-front card card-large valign-wrapper"><div class="card-content valign-wrapper"><span contenteditable class="front-text card-title"> Front of card </span></div></div></div><div class="col s12 m6"><div class="card card-large valign-wrapper"><div class="card-content valign-wrapper"><span contenteditable class="center-align back-text"> Back of card</span></div></div>'
    document.getElementById('house-of-cards').insertAdjacentElement('afterbegin', row)
    return 'row-' + NUM
}

function addMinimalCard() {
    // makes a new card with no content and returns the id of its container
    let row = document.createElement('div');
    row.id = 'row-' + ++NUM
    row.classList.add('row');
    row.innerHTML = `<div class="col s12 m6"><div class="card card-large valign-wrapper"></div></div><div class="col s12 m6"><div class="card card-large valign-wrapper"></div></div>`
    document.getElementById('house-of-cards').insertAdjacentElement('afterbegin', row)
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

function saveCards(e) {
    let cards = []
    let collectionId = document.getElementById('collection-picker').value
    let fronts = Array.from(document.querySelectorAll('.front-text')).map(el => el.innerText)
    let backs = Array.from(document.querySelectorAll('.back-text')).map(el => el.innerText)
    for (let i = 0; i < fronts.length; i++) {
        cards.push({front: fronts[i], back: backs[i]})
    }
    fronts = Array.from(document.querySelectorAll('.rendered-md-front')).map(el => el.innerHTML)
    backs = Array.from(document.querySelectorAll('.rendered-md-back')).map(el => el.innerHTML)
    for (let i = 0; i < fronts.length; i++) {
        cards.push({front: fronts[i], back: backs[i]})
    }
    console.log('sending', JSON.stringify({cards, collectionId}))
    fetch('/cards', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({cards, collectionId})
    }).then(reply => {
        window.location = '/collections/'+ collectionId
    })
}

/*
The following section includes:
    getDefinitions(): gets twinword api from extra server

    filterDefinitions(): sorts definitions by part of speech and limits their number

    makeDefinitionSelect(): creates and initializes the select element that holds the definitions

    defineWordsClick(): the click handler that kicks off the functions in this section
*/


function filterDefinitions(twinwordsResponseObj) {
    // makes a definitions object containing
    // {
    // key: part of speech
    // value: [array of definitions]
    // }
    return twinwordsResponseObj.definitions.reduce((acc, next) => {
        if (next.partOfSpeech in acc && acc[next.partOfSpeech].length < 4) {
                (acc[next.partOfSpeech]).push(next.definition)
        } else {
            acc[next.partOfSpeech] = Array.of(next.definition)
        }
        return acc
    }, {})
}

function makeOptions(definitions) {
    let node = document.createDocumentFragment()
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
            node.appendChild(optGroup)
    }
    return node
}

function getDefinitions(word) {
    // takes a word, returns a promise
    return fetch('/define/' + word, {
        credentials: 'include'
    })
    .then(res => {
        // catch any errors in fetch
        if (!res.ok) {throw Error('"' + word + '" (' + res.status + ': ' + res.statusText + ')')}
        return res.json()
    })
}


function refreshDefinitionsClick(e) {
    let word = document.getElementById(e.currentTarget.dataset.sourceID).querySelector('.card-title').innerText
    // replace trailing whitespace
    word = word.replace(/\s+$/gm, '')
    // replace leading whitespace
    word = word.replace(/^\s+/gm, '')
    if (!word.match(/^[a-zA-z]+$/)) {
        M.toast({html:'Try a different word'})
        throw new Error('Word is not alphanumeric')
    }
    console.log(e.currentTarget.dataset.selectID)
    let select = document.getElementById(e.currentTarget.dataset.selectID)
    getDefinitions(word)
    .then(defs => {
        select.innerHTML = ''
        let options = makeOptions(filterDefinitions(defs))
        select.appendChild(options)
        M.FormSelect.init(select)
    })
    .catch(err => {
        M.toast({html: err.message})
        console.log(err)
    })
}

function newVocabularyCard(e) {
    e.stopPropagation()
    // make new blank cards
    let parent = document.getElementById(addCard())
    let backText = parent.querySelector('.back-text')
    // create a new row
    let row = document.createElement('div')
        row.classList.add('row')
    parent.appendChild(row);
    // make a select
    let selectCol = document.createElement('div');
        selectCol.classList.add('col', 's11')
    row.appendChild(selectCol)
    let select = document.createElement('select')
        select.id = parent.id + '-select'
        select.addEventListener('change', function updateCard(e) {
            console.log('select value', e.target.value)
            console.log(backText)
            backText.textContent = e.target.value
        })
    selectCol.appendChild(select)
    // make a button to refresh the select
    let btnCol = document.createElement('div')
        btnCol.classList.add('col', 's1')
    row.appendChild(btnCol)
    let refreshBtn = document.createElement('a')
        refreshBtn.dataset.sourceID = parent.id
        refreshBtn.dataset.selectID = parent.id  + '-select'
        refreshBtn.classList.add('btn-flat', 'waves-effect', 'waves-orange')
        // styling on mouseover
        refreshBtn.addEventListener('mouseover', function refreshMouseover(e) {
            e.currentTarget.classList.add('btn', 'orange')
        })
        refreshBtn.addEventListener('mouseout', function refreshMouseout(e) {
            e.currentTarget.classList.remove('btn', 'orange')
        })
        refreshBtn.addEventListener('click', refreshDefinitionsClick)
    btnCol.appendChild(refreshBtn)
    let refreshIcon = document.createElement('i')
        refreshIcon.classList.add('material-icons')
        refreshIcon.textContent = 'refresh'
    refreshBtn.appendChild(refreshIcon)

    M.FormSelect.init(select)
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
    let md = source.firstElementChild.value
    console.log(JSON.stringify({md}))
    fetch('/parsemd', {
        method: 'POST',
        credentials: 'include',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({md})
    }).then(reply => {
        return reply.text()
    }).then(data => {
        data = data.replace('<pre><code', '<?prettify?><pre><code')
        source.nextElementSibling.innerHTML = data
        PR.prettyPrint();
    }).catch(err => M.toast({html:err}))
}

function createMarkdownEditor(target, id) {
    // make containers
    let row = document.createElement('div');
        row.classList.add('row');
    let col = document.createElement('div');
        col.classList.add('col', 's12');
    row.appendChild(col);
    // make tab list
    let ul = document.createElement('ul');
        ul.id = id + '-ul'
        ul.classList.add('tabs');
    col.appendChild(ul)
    let tabA = document.createElement('li');
        tabA.classList.add('tab', 'col', 's6');
    let linkA = document.createElement('a');
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
        linkB.dataset.source = id + '-md';
        linkB.addEventListener('click', handleMarkdown)
    let iconB = document.createElement('i')
        iconB.classList.add('material-icons')
        iconB.textContent = 'visibility'
    linkB.insertAdjacentElement('afterbegin', iconB)
    tabB.insertAdjacentElement('afterbegin', linkB)
    ul.appendChild(tabB)
    // make tab content for markdown entry tab
    let markdown = document.createElement('div');
        markdown.id = id + '-md'
        markdown.classList.add('col', 's12', 'md-wrap')
    let mdText = document.createElement('textarea')
        mdText.classList.add('mdText')
        mdText.id = id + 'text'
        mdText.value = id[id.length - 1] == 0 ? '#### Front of card' : '#### Back of card'
    markdown.appendChild(mdText)
    target.appendChild(markdown)
    // make tab content for preview tab
    let preview = document.createElement('div');
        preview.id = id + '-preview'
        preview.classList.add('col', 's12', 'preview-wrap')
        preview.className += id[id.length - 1] == 0 ? ' rendered-md-front' : ' rendered-md-back'
    target.appendChild(preview)
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
    // makes clicks in textarea container give focus to textarea
    target.addEventListener('click', function focusTextarea(e) {
        if (mdText.parentElement.style.display !== 'none') {
            mdText.focus()
        }
        // else do nothing
    })
    TABS_ELS.push(ul)
    TABS_INSTANCES.push(M.Tabs.init(ul))
    handleMarkdown({currentTarget: linkB})
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
    document.getElementById('vocabulary-btn').addEventListener('click', newVocabularyCard)

    // initialize 'make a markdown' button
    document.getElementById('markdown-btn')
    .addEventListener('click', newMDCard)
})