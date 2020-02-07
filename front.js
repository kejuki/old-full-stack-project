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

async function DeleteObj(id){
    await fetch("http://localhost:3000/cols/" + id,{
      method: "DELETE"
    })
    .then(res => res.json())
    .catch((err) => { console.error("Error: ", err);});
    Load();
}

function SetObjId(objs) {
    if(objs!==null){
      for(let i = 0; i<objs.length;i++){
        objs[i].id = i;
      }
    }
    return objs;
}

async function AddCol() {
  
    colObjs = await getCols();

    let colObj = {
      id: 0,
      title: ""
    }
  
    try { SetObjId(colObjs);} catch (e) {}
    try { colObj.id = colObjs.cols.length; } catch (e) {}
  
    CreateCol(colObj);
    await SetCol(colObj);
    
    await Load();
}

function CreateCol(colObj) {
    const col = document.createElement("div");
    const colHeader = document.createElement("p");
    const objCont = document.createElement("div");
    const delColBtn = document.createElement("Button");
    const addBtn = document.createElement("Button");
  
    col.classList.add("col");
    colHeader.classList.add("colHeader");
    objCont.id = "col"+colObj.id;
    delColBtn.classList.add("delColBtn");
    addBtn.classList.add("addbtn");
  
    addBtn.setAttribute("onclick", "AddTex("+colObj.id+");");
    delColBtn.setAttribute("onclick", "DeleteObj("+colObj.id+");");
    colHeader.innerHTML = colObj.title;
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
  
document.addEventListener("DOMContentLoaded", event => {
    Load();
});

//4dbuggin
//DeleteAll();
function DeleteAll(){
    fetch("http://localhost:3000/cols/",{
        method: "DELETE"
      })
      .then(res => res.json())
      .then((data) => { console.log("Success: ", data);});
}