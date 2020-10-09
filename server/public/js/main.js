/////////////////////////
// basic functionality //
/////////////////////////

// basic test method for testing buttons and shit like that
function console_log(input){

    console.log(input)
    console.log(typeof input)

}

//sets session values to their intended original values
function start(){
    
    let cards = document.getElementsByClassName("card")

    let alternatives = []
    let removed_alternatives = []
    
    for (i = 0; i < cards.length; i++){

        let alternative = {}
        
        // console.log(cards[i])
        
        cards[i].classList.remove("correct")
        cards[i].classList.remove("wrong100")
        cards[i].classList.remove("wrong66")
        cards[i].classList.remove("wrong33")
        cards[i].classList.remove("answered")

        alternative['id'] = cards[i].id
        alternative['name'] = cards[i].textContent
        alternatives.push(alternative)
        
    }
    
    sessionStorage.setItem("attempts", JSON.stringify(0))
    sessionStorage.setItem("alternatives", JSON.stringify(alternatives))
    sessionStorage.setItem("removed_alternatives", JSON.stringify(removed_alternatives))

    get_target()

}

//runs start; exists for clarity in code
function reset(){

    start()

}

//resets session attempts
function reset_attempts(){

    sessionStorage.setItem("attempts", JSON.stringify(0))

}

//converts a string into an integer
function string_to_int(string){

 return parseInt(string, 10)

}

function int_to_string(integer){
    return integer.toString()
}

//gets theremaining valid alternatives
function get_alternatives(){

    let alternatives = JSON.parse(sessionStorage.getItem("alternatives"))

    //console_log(alternatives)

    return(alternatives)

}

function get_removed_alternatives(){

    let removed_alternatives = JSON.parse(sessionStorage.getItem("removed_alternatives"))
    //let removed_alternatives = (sessionStorage.getItem("removed_alternatives"))
    
    return(removed_alternatives)

}

//removes a card from valid alternatives
function remove_alternative(card_id){

    let alternatives = get_alternatives()
    let removed_alternatives = get_removed_alternatives()

    //removed_alternatives.push(card_id)

    alternatives.forEach(function (alternative){
        
        if (alternative["id"] == card_id){
            
            removed_alternatives.push(card_id)
            
        }
        
    })

    alternatives = alternatives.filter(function(x){

        return x['id'] !== card_id
    
    })

    sessionStorage.setItem("removed_alternatives", JSON.stringify(removed_alternatives))
    sessionStorage.setItem("alternatives" , JSON.stringify(alternatives))
}

//method for getting a random target card
function get_target(){

    let alternatives = get_alternatives()

    let number_of_alternatives = alternatives.length

    let target_div = document.getElementById("target")

    let target_index = Math.floor((Math.random()*number_of_alternatives))

    console_log(alternatives)
    
    if (alternatives[target_index] !== undefined){

        target_div.innerHTML = alternatives[target_index]["name"]
        console.log(alternatives[target_index])
        sessionStorage.setItem("target", JSON.stringify(alternatives[target_index]))
        //sessionStorage.setItem("target", alternatives[target_index]["id"])
        //sessionStorage.setItem("target", alternatives[target_index]["name"])


        console.log("target")
        let asda = JSON.parse(sessionStorage.getItem("target"))
        console.log(asda["id"])
        
    } else {
        
        target_div.innerHTML = "victory"
        sessionStorage.setItem("target", "victory")

    }
    

}

//stage one of handling answers
function answer(clicked_id){

    let card = document.getElementById(clicked_id)

    remove_alternative(clicked_id)

    let number_of_attempts = JSON.parse(sessionStorage.getItem("attempts"))

    return {"card":card, "number_of_attempts":number_of_attempts}

}

//stage two of answer handling; handles correct answers
function correct_answer(clicked_id){

    let result = answer(clicked_id)

    let card = result["card"]
    let number_of_attempts = result["number_of_attempts"]

    if (number_of_attempts < 1){

        card.classList.add("correct")
        
    } else if (number_of_attempts == 1) {
        
        card.classList.add("wrong33")
        
    } else if (number_of_attempts == 2) {
        
        card.classList.add("wrong66")

    } else {

        console.log("fatal error in 'number_of_attempts', please reset")

    }

    card.classList.add("answered")

    reset_attempts()

    get_target()
    
}

//stage two of answer handling; handles incorrect answers
function wrong_answer(target_id){

    let result = answer(target_id)

    let card = result["card"]
    let number_of_attempts = result["number_of_attempts"]

    number_of_attempts++

    if (number_of_attempts < 3){

        sessionStorage.setItem("attempts", JSON.stringify(number_of_attempts))

    } else {

        card.classList.add("wrong100")
        card.classList.add("answered")

        reset_attempts()

        get_target()

    }
    
}

//checks if the correct card was clicked
function is_correct(clicked_card){

    console.log(clicked_card)

    let target = JSON.parse(sessionStorage.getItem("target"))
    let target_card = document.getElementById(clicked_card["id"])
    let removed_alternatives = get_removed_alternatives()

    if (removed_alternatives.includes(clicked_card["id"]) && target_card.classList.contains("answered")){

        console.log("skipped")

    } else if (target["id"] == clicked_card["id"] || target["name"] == clicked_card["name"]){

        console_log("correct")

        correct_answer(clicked_card["id"])

    } else {
        
        console.log("wrong")

        wrong_answer(target["id"])
        
    }
    
}

// test method that links to test button for easy testing
function test(){

    // let a = JSON.stringify({"a1":"a2","b1":"b2"})

    let a =JSON.parse('{"a1":"a2","b1":"b2"}')

    console.log("test")

    console_log(a)

}

//stuff that loads immediately
window.onload = start()

/////////////////////////////
// basic functionality end //
/////////////////////////////

