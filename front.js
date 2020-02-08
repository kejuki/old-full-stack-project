const content = document.getElementById("content");
const container = document.getElementById("container");

async function getCols(){
    const cols = await fetch("http://localhost:3000/cols/",{
    method:"GET",
    header: {"Content-Type": "application/json"}})
    .then(res => res.json())
    .catch(error => console.log(error));
    return cols;
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

    let colObjs = await getCols();
    let colObj = {
      title: "title"
    }

    try { colObj.id = colObjs.cols.length; } catch (e) {}

    await SetCol(colObj);
    colObjs = await getCols();

    CreateCol(colObj);
    
    Load();
}

function CreateCol(colObj) {
    const col = document.createElement("div");
    const colHeader = document.createElement("textarea");
    const objCont = document.createElement("div");
    const delColBtn = document.createElement("Button");
    const addBtn = document.createElement("Button");
  
    col.classList.add("col");
    colHeader.classList.add("colHeader");
    objCont.id = "col"+colObj.id;
    delColBtn.classList.add("delColBtn");
    addBtn.classList.add("addbtn");
  
    addBtn.setAttribute("onclick", "AddTex('"+colObj._id+"');");
    delColBtn.setAttribute("onclick", "DeleteCol('"+colObj._id+"');");
    colHeader.value = colObj.title;
    colHeader.setAttribute("oninput","SetText(value, '"+colObj._id+"');");
    addBtn.innerHTML = "+";
    delColBtn.innerHTML = "-";
    
    col.appendChild(colHeader);
    col.appendChild(delColBtn);
    col.appendChild(objCont);
    col.appendChild(addBtn);
  
    
    container.appendChild(col);
    return col;
}

function ClearCont(){
    while (container.firstChild){
      container.removeChild(container.firstChild);
    }
}

function ResizeCont(leng) {
    container.style.width = 324 * leng + "px";
    content.style.width = 324 * leng + 60 + "px";
}

let saveTextTimeout;
function SetText(text, id){
    saveTextTimeout = setTimeout(() => {UpdateText(text, id);}, 500);
}

async function Load() {
    let colObjs = await getCols();
    console.log(colObjs);
    ClearCont();

    if(colObjs.cols!==null){
        ResizeCont(colObjs.cols.length);
        for(const col in colObjs.cols){
            CreateCol(colObjs.cols[col]);
        }
    }
}

//create a text changed method maybe
window.addEventListener('keypress', () => { window.clearTimeout(saveTextTimeout);}, true);

document.addEventListener("DOMContentLoaded", () => { Load(); });


