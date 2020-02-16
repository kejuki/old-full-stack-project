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

async function UpdateTitle(text, id){
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

async function DeleteContObj(id, subid){//first reorder cont then patch then delete
    await fetch("http://localhost:3000/cols/" + id + "." + subid,{
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .catch((err) => { console.error("Error: ", err);});
}

async function AddCol() {

    let obj = {
        title: "title",
        content: [
            {type: "img", imgurl:"img/asdf.png", order: 0}, 
            {type: "text", texts: "asdasd", order: 3}
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
function SetText(text, id, order){
    saveTextTimeout = setTimeout(() => {UpdateText(text, id, order);}, 500);
}
let saveTitleTimeout;
function SetTitle(text, id){
    saveTextTimeout = setTimeout(() => {UpdateTitle(text, id);}, 500);
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
    const expandObjTitle = document.createElement("textarea");
    const expandObjAddBtnContainer = document.createElement("div");
    const expandObjAddBtnImg = document.createElement("button");
    const expandObjAddBtnText = document.createElement("button");
    let expandObjCont = [];

    expandObjTitle.value = obj.title;
    expandObjTitle.classList.add("expandedObjTitle");
    expandObjTitle.setAttribute("oninput","SetTitle(value, '"+obj._id+"');");
    rightcontainer.appendChild(expandObjTitle);

    obj.content.sort((a, b) => {return a.order - b.order});

    for(const cont in obj.content){

        const delObjBtn = document.createElement("button");
        delObjBtn.classList.add("delObjBtn");
        delObjBtn.setAttribute("onclick", "DeleteContObj('"+obj._id+"', '"+obj.content[cont]._id+"');");

        if(obj.content[cont].type === "text"){
            expandObjCont.push(document.createElement("div"));
            const textarea = document.createElement("textarea");
            textarea.classList.add("expandedObjtextarea")
            textarea.value = obj.content[cont].texts;
            textarea.setAttribute("oninput","SetText(value, '"+obj._id+"', "+obj.content[cont].order+");");
            expandObjCont[cont].appendChild(textarea);
            expandObjCont[cont].appendChild(delObjBtn);
            expandObjCont[cont].classList.add("expandedObjtextarea");
        }
        if(obj.content[cont].type === "img"){
            expandObjCont.push(document.createElement("div"));
            const imgspace = document.createElement("img");
            imgspace.setAttribute("src", "http://localhost:3000/saitti/" + obj.content[cont].imgurl);
            expandObjCont[cont].appendChild(imgspace);
            expandObjCont[cont].appendChild(delObjBtn);
            expandObjCont[cont].classList.add("expandedObjImg");
        }
        rightcontainer.appendChild(expandObjCont[cont]);
    }

    expandObjAddBtnContainer.appendChild(expandObjAddBtnImg);
    expandObjAddBtnContainer.appendChild(expandObjAddBtnText);
    rightcontainer.appendChild(expandObjAddBtnContainer);

}

async function ExpandObj(id){
    let obj = await getOne("http://localhost:3000/cols/", id);
    ClearRightCont();
    CreateExpandableObj(obj);
}

//create a text changed method maybe
window.addEventListener('keypress', () => {
     window.clearTimeout(saveTextTimeout);
     window.clearTimeout(saveTitleTimeout);
}, true);

document.addEventListener("DOMContentLoaded", () => { Load(); });


