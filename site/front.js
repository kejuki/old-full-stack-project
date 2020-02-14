const leftcontainer = document.getElementById("left-container");
const rightcontainer = document.getElementById("right-container");

async function getCols(){
    const cols = await fetch("http://localhost:3000/cols/",{
        method:"GET",
        header: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .catch(error => console.log(error));
    return cols;
}
async function getOne(url, id){
    const obj = await fetch(url + id,{
        method:"GET",
        header: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .catch(error => console.log(error));
    return obj;
}

async function SetCol(obj){
    await fetch("http://localhost:3000/cols/",{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then((response) => response.json())
    .catch((err) => { console.error("Error: ", err);});
}

async function DeleteCol(id){
    await fetch("http://localhost:3000/cols/" + id,{
      method: "DELETE"
    })
    .then(res => res.json())
    .catch((err) => { console.error("Error: ", err);});

    Load();
}

async function UpdateText(text, id){
    await fetch("http://localhost:3000/cols/" + id,{
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: text})
    })
    .then((response) => response.json())
    .catch((err) => { console.error("Error: ", err);});
}

async function AddCol() {

    let obj = {
        title: "title",
        content: [
            {type: "img", imgurl:"img/asdf.png", order: 0}, 
            {type: "text", text: "asdasd", order: 3},
            {type: "img", imgurl:"img/asdf.png", order: 2}, 
            {type: "text", text: "asdasd", order: 1}
        ]
    }
    await SetCol(obj);
    Load();
}

function CreateCol(colObj) {
    const   col = document.createElement("div"),
            colHeader = document.createElement("p"),
            delColBtn = document.createElement("Button"),
            expandBtn = document.createElement("Button");
  
    col.classList.add("col");
    colHeader.classList.add("colHeader");
    delColBtn.classList.add("delColBtn", "fa", "fa-trash-o");
    expandBtn.classList.add("expandBtn");

    colHeader.innerHTML = colObj.title;
    delColBtn.setAttribute("onclick", "DeleteCol('"+colObj._id+"');");
    expandBtn.setAttribute("onclick", "ExpandObj('"+colObj._id+"');");
    //colHeader.setAttribute("oninput","SetText(value, '"+colObj._id+"');");
    
    col.appendChild(colHeader);
    col.appendChild(delColBtn);
    col.appendChild(expandBtn);
    
    leftcontainer.appendChild(col);
}

function CreateAddBtn(){
    const   addElement = document.createElement("div"),
            addBtn = document.createElement("Button");

    addElement.classList.add("contAdd");
    addBtn.classList.add("fa", "fa-plus", "contAddBtn");
    addBtn.setAttribute("onclick", "AddCol()");

    addElement.appendChild(addBtn);
    leftcontainer.appendChild(addElement);
}

function ClearLeftCont(){
    while (leftcontainer.firstChild){
        leftcontainer.removeChild(leftcontainer.firstChild);
    }
}

function ClearRightCont(){
    while (rightcontainer.firstChild){
        rightcontainer.removeChild(rightcontainer.firstChild);
    }
}

let saveTextTimeout;
function SetText(text, id){
    saveTextTimeout = setTimeout(() => {UpdateText(text, id);}, 500);
}

async function Load() {
    let colObjs = await getCols();
    console.log(colObjs);
    ClearLeftCont();

    if(colObjs.cols!==null){
        for(const col in colObjs.cols){
            CreateCol(colObjs.cols[col]);
        }
    }
    CreateAddBtn();
}

function CreateExpandableObj(obj){
    const expandedObjTitle = document.createElement("textarea");
    let expandedObjCont = [];

    expandedObjTitle.value = obj.title;
    expandedObjTitle.classList.add("expandedObjTitle");
    rightcontainer.appendChild(expandedObjTitle);

    obj.content.sort((a, b) => {return a.order - b.order});

    for(const cont in obj.content){
        if(obj.content[cont].type === "text"){
            expandedObjCont.push(document.createElement("textarea"));
            expandedObjCont[cont].classList.add("expandedObjtextarea");
            expandedObjCont[cont].value = obj.content[cont].text;
            //setattribute for save
        }
        if(obj.content[cont].type === "img"){
            expandedObjCont.push(document.createElement("img"));
            expandedObjCont[cont].classList.add("expandedObjImg");
            expandedObjCont[cont].setAttribute("src", "http://localhost:3000/saitti/" + obj.content[cont].imgurl);
        }
        rightcontainer.appendChild(expandedObjCont[cont]);
    }
}

async function ExpandObj(id){
    let obj = await getOne("http://localhost:3000/cols/", id);
    ClearRightCont();
    CreateExpandableObj(obj);
}

//create a text changed method maybe
window.addEventListener('keypress', () => { window.clearTimeout(saveTextTimeout);}, true);

document.addEventListener("DOMContentLoaded", () => { Load(); });


