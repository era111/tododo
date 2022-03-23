const $inputTextNode = document.querySelector('.inputtext')//поле ввода заметки
const $inputLVL = document.querySelector('.selectLvl')
const $buttonSender = document.querySelector('.addtask')
const $checkBox = document.querySelector('.checkboxesWrap')
const podsk = document.querySelector('#hide')
document.addEventListener('click', (event) => {
    if (event.target.className == 'podskazka') {
        hider(podsk)
    }
})

//

const $field = document.querySelector('.fieldTasks')//куда вставлять заметки

localStorage.clear()

let index = 0
let notesArray = []

class Note {
    constructor(id,lvl,noteText){ //
        this.id = id
        this.isComplite = false
        this.lvl = lvl
        this.data = new Date()
        this.noteText = noteText
    }
}

let Datas = []
localStorage.setItem('data', JSON.stringify(Datas))

$buttonSender.addEventListener('click',addNodeDB)
$inputTextNode.addEventListener('keypress', senderEnter);
function senderEnter(e) {
    if (e.code=='Enter') {
        addNodeDB()
    }
}

function addNodeDB(){
    let array = localStorage.getItem('data')
    let arr = JSON.parse(array)
    let newNode = createNode()
    
    arr.push(newNode)
  
    localStorage.setItem('data', JSON.stringify(arr));
    renderNode(JSON.parse(localStorage.getItem('data')) )
    $inputTextNode.value = ''
}

function createNode() {
    let valueText = $inputTextNode.value
    let valueLVL = $inputLVL.value
    
    index+=1

    let note = new Note(index,valueLVL,valueText);
    return note
}

function renderNode(array){
    $field.innerHTML = ''
    array.forEach((note) => {
        let noteBlock = document.createElement('div')
        noteBlock.classList.add('noteBlock')
        noteBlock.classList.add(`${note.isComplite}`)
        noteBlock.innerHTML = `     
        <div id = "${note.id}" class="noteWrap ">
            <span class="${note.lvl}">${note.lvl}</span>
            <input class = "innertext" value = "${note.noteText}" disabled>
            <button class="btn complete" onclick = 'doneBtn(this)'>Done</button>
            <button class="btn delete" onclick = 'deleteBtn(this)'>Delete</button>
        </div>  
        `
        $field.prepend(noteBlock)
    })
}

// let changeBlock = document.querySelector('.noteBlock')

document.addEventListener('dblclick', event => {
    
    let className = event.target.className.toLowerCase()

    // console.log(array);

    if (className==='innertext'){
        input = event.target
        let array = JSON.parse(localStorage.getItem('data'))
        console.log(array);
            
        let node = event.target.parentNode //враппер с ид
        let number = node.id
        let changedEl = array.filter((obj) => obj.id==number)[0]
        array.splice(array.indexOf(changedEl), 1);
        console.log(changedEl);
        console.log(array);

        // let input = event.target
        
        if (input.hasAttribute('disabled')){
            input.removeAttribute('disabled');
        }

        input.addEventListener('keypress', logKey);

        function logKey(e) {

            if (e.code=='Enter') {
                changedEl.noteText = input.value
                console.log(typeof(changedEl));
                array.push(changedEl)
                console.log(array);
            
                localStorage.setItem('data', JSON.stringify(array))
                renderNode(JSON.parse(localStorage.getItem('data')) )
                if (!input.hasAttribute('disabled')){                    
                    input.setAttribute('disabled','disabled');
                }
            }
        }
    }
},false)


$checkBox.addEventListener('click', (event) => {

    const elem = event.target
    if (elem.className==='check') {
        let filterArray = []
        let array = JSON.parse(localStorage.getItem('data'))
        console.log(array);
        const high = $checkBox.querySelector('#high') 
        const medium = $checkBox.querySelector('#medium') 
        const low = $checkBox.querySelector('#low') 
        const complited = $checkBox.querySelector('#isComplite')
        const all = $checkBox.querySelector('#all') 
        console.log(high.id);
        
        if (high.checked||medium.checked||low.checked) {
            all.checked = false;
        }


        if (high.checked) {
        
            addFilter(array,filterArray,'lvl',high.id)
            
        }
        if (medium.checked) {
            
            addFilter(array,filterArray,'lvl',medium.id);     
        }
        if (low.checked) {
            
            addFilter(array,filterArray,'lvl',low.id);
        }
        if (complited.checked) {
            addFilter(array,filterArray,'isComplite',true);
        }
        if (all.checked) {

            filterArray = []
            array.forEach(element => {
                filterArray.push(element)
            });
        }
        
        console.log(filterArray);
        localStorage.setItem('filter', JSON.stringify(filterArray))
        console.log(localStorage.getItem('filter', JSON.stringify(filterArray)));
        renderNode(JSON.parse(localStorage.getItem('filter')))
    }


})

function addFilter(array,filterArray,tag,data){
    if (typeof(data)=="boolean") {
        let newarray = array.filter((obj) => obj[tag]==data)
        console.log('filtered', newarray);
        newarray.forEach(element => {filterArray.push(element)});
        console.log('addfilter',filterArray);
    } else {
        console.log(array[0][tag].toLowerCase())
        let newarray = array.filter((obj) => obj[tag].toLowerCase()==data)
        newarray.forEach(element => {filterArray.push(element)});

    }
    // return filterArray
    
}




function doneBtn(elementbtn) {
    let array = JSON.parse(localStorage.getItem('data'))
    const wrapNode = elementbtn.parentNode
    const papa = wrapNode.parentNode

    const id = wrapNode.id
    let doneEl = array.filter((obj) => obj.id==id)[0]
    array.splice(array.indexOf(doneEl), 1);
    if (papa.classList.contains('false')) {
        doneEl.isComplite = true;

        console.log(papa);
    } else {
        doneEl.isComplite = false;

    }

    console.log(doneEl);
    array.push(doneEl)
    localStorage.setItem('data', JSON.stringify(array))
    renderNode(JSON.parse(localStorage.getItem('data')) )

}



function deleteBtn(elementbtn) {
    let array = JSON.parse(localStorage.getItem('data'))
    const node = elementbtn.parentNode
    const id = node.id
    let deletedEl = array.filter((obj) => obj.id==id)[0]
    array.splice(array.indexOf(deletedEl), 1);
    localStorage.setItem('data', JSON.stringify(array))
    renderNode(JSON.parse(localStorage.getItem('data')) )

}


//изменение видимости
function hider(elem){
    if (elem.classList.contains('hide')){
        elem.classList.remove('hide')
        // $noteBlock.removeAttribute('hide')
    } else {
        // $noteBlock.setAttribute('hide')
        elem.classList.add('hide')
    }
}
