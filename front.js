const content = document.getElementById("content");
const container = document.getElementById("container");

const getCols = fetch("http://localhost:3000/cols/",{
    method:"GET",
    header: {"Content-Type": "application/json"}})
    .then(res => res.json());


function SetObjId(objs) {
    if(objs!==null){
      for(let i = 0; i<objs.length;i++){
        objs[i].id = i;
      }
    }
    return objs;
}

function AddCol() {
  
    let colObj = {
      id: 0,
      title: ""
    }
  
    try { SetObjId(getCols);} catch (e) {}
    try { colObj.id = getCols.length; } catch (e) {}
  
    CreateCol(colObj);
    //StoreObj(colObj, "colObjsJSON");
    
    Load();
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
    delColBtn.setAttribute("onclick", "DeleteCol("+colObj.id+");");
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

    let colObjs = await getCols;
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