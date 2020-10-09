const diceStacks = [
    QS(document, `#diceStack1`),
    QS(document, `#diceStack2`)
]

const diceStackIDs = {
    "1":`#diceStack1`,
    "2":`#diceStack2`
}

function QS(element,target) {

    return element.querySelector(target)

}

function QSA(element,target) {

    return element.querySelectorAll(target)
    
}

function cloneTemplate(templateID, templateContent) {
    let template = QS(document,templateID)    
    let clone = template.content.cloneNode(true)

    return QS(clone,templateContent)

}

function newDie(e) {
    const li = cloneTemplate(`#dieTemplate`, `.die`)

    let stackID = e.target.parentElement.getAttribute(`data-stack`)
    let stack = QS(document, diceStackIDs[stackID])

    stack.prepend(li)

}

function generateNewDieButton(_load) {
    let buttons = []

    let buttonOne = cloneTemplate(`#addDieButtonTemplate`, `.addDie`)
    
    let buttonTwo = buttonOne.cloneNode(true)
        
    buttons.push(buttonOne)
    buttons.push(buttonTwo)
    
    for (let i = 0; i < buttons.length; i++) {
        
        buttons[i].setAttribute(`data-stack`, `${i+1}`)
        
        QS(buttons[i], `button`).addEventListener(`click`, newDie)
        
    }
    
    for (let i = 0; i < diceStacks.length; i++) {

        diceStacks[i].appendChild(buttons[i])

    }

}

// console.log(`dicestackone`)
// console.log(diceStackOne)
// console.log(`dicestacktwo`)
// console.log(diceStackTwo)

generateNewDieButton()