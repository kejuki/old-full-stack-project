
/*
create a method that creates column,
  adds width to #container,
  saves the containers
create a method that deletes the container with confirmation, 
  redoes the order and 
  recuces #container width
create a method that creates an add container button.
recreate ClrearTod method.
add addbutton to the bottom as an object.
add confirmation to delete btn.
get rid of hardcoded variables.
separate to different files.
*/
const container = document.getElementById("container");

var r = 3, m = 2, l = 1;
var right = document.getElementById("right");
var middle = document.getElementById("middle");
var left = document.getElementById("left");

var saveTextTimeout;


function AddTod(col){
  LoadTod();
  let obj = {
    id: 0,
    column: col,
    text: "",
    isDone: false,
    toBeDeleted: false
  };
  try { SetTodId(GetObj("objsJSON"));} catch (e) {}
  try { obj.id = GetObj("objsJSON").length; } catch (e) {}
  


  CreateTod(obj);
  StoreTod(obj);
  LoadTod();
}

function SetTodId(objs){
  for(let i = 0; i<objs.length;i++){
    objs[i].id = i;
  }
  return objs;
}

function CreateTod(obj){
  let listObj = document.createElement("div");
  let textarea = document.createElement("textarea");
  let donebtn = document.createElement("button");
  let delbtn = document.createElement("button");

  textarea.classList.add("todoinput");
  listObj.classList.add("listObj");
  donebtn.classList.add("donebtn", "fa", "fa-check-square");
  delbtn.classList.add("delbtn", "fa", "fa-trash-o");
  listObj.id = "lo"+obj.id;

  if(obj.isDone){
    listObj.setAttribute("style","background-color: rgb(0, 30, 0)");
    textarea.setAttribute("style","background-color: DarkGreen");
    delbtn.setAttribute("style","background-color: DarkGreen");
    donebtn.setAttribute("style","background-color: DarkGreen");
  }
  delbtn.setAttribute("onclick","DeleteTod("+obj.id+");");
  donebtn.setAttribute("onclick","DoneTod("+obj.id+");");
  textarea.value=obj.text;
  textarea.setAttribute("placeholder", "Write here!");
  textarea.setAttribute("oninput",
                        "STT(value, "+obj.id+");" +
                        'this.style.height = "";' +
                        'this.style.height = this.scrollHeight + "px"');
  
  listObj.appendChild(textarea);
  listObj.appendChild(donebtn);
  listObj.appendChild(delbtn);

  return listObj;
}

function AppendTod(column,obj){

  
  switch (column) {
    case 1:
      left.appendChild(obj);
      break;
    case 2:
      middle.appendChild(obj);
      break;
    case 3:
      right.appendChild(obj);
      break;
    default:
  }
}

function STT(text, id){
  saveTextTimeout = setTimeout(() => {StoreText(text, id);}, 300);
}

function StoreText(text, id){
  let objs = GetObj("objsJSON");

  objs.forEach((obj) => {
    if(id===obj.id){
      obj.text = text;
    }
  });
  SaveToLocalStorage(objs, "objsJSON");
}

function StoreTod(obj){
  let objs = GetObj("objsJSON");
  if (objs===null){objs=[];}
  objs.push(obj);

  SaveToLocalStorage(objs, "objsJSON");
}

function LoadTod(){
  ClearTod();
  let objs = GetObj("objsJSON");
  if(objs!==null){
    for(let i = 0; i<objs.length;i++){
      AppendTod(objs[i].column, CreateTod(objs[i]));
    }
  }
  ResizeTextarea();
}

function ResizeTextarea(){
  let textareasc = document.getElementsByClassName("todoinput");
  let textareas = Array.from(textareasc);
  textareas.forEach((ta) => {
    ta.style.height = ta.scrollHeight + "px";
  })
}

function GetObj(objType){ //objtype = objsJSON/colObjsJSON
  let text = localStorage.getItem(objType);
  let obj = JSON.parse(text);
  return obj;
}

function SaveToLocalStorage(objs, objType){
  let objsJSON = JSON.stringify(objs);
  localStorage.setItem(objType, objsJSON);
}

function DoneTod(e){
  let objs = GetObj("objsJSON");

  objs.forEach((g) => {
    if(e===g.id){
      if(objs[e].isDone){
        objs[e].isDone=false;
      }
      else{
        objs[e].isDone=true;
      }
    }
  });

  SaveToLocalStorage(objs, "objsJSON");
  LoadTod();
}

function DeleteTod(id){

  let objs = GetObj("objsJSON");

  objs.forEach((obj) => {
    if(id===obj.id){
      objs[id].toBeDeleted=true;
    }
  });

  for(let i = 0; i<objs.length;i++){
    if(objs[i].toBeDeleted===true){
      objs.splice(i,1);
    }
  }

  SetTodId(objs);
  SaveToLocalStorage(objs, "objsJSON");
  LoadTod();
}

function ClearTod(){ 

  while (left.firstChild) {
      left.removeChild(left.firstChild);
  }
  while (middle.firstChild) {
      middle.removeChild(middle.firstChild);
  }
  while (right.firstChild) {
      right.removeChild(right.firstChild);
  }
}

//* ------------------------------------------------------------------------ */
//* ------------------------------------------------------------------------ */
//* ------------------------------------------------------------------------ */

function AddCol(){
  loadCol();
  let colObj = {
    id: 0,
    title: "",
    toBeDeleted: false
  }
  try { SetColId(GetObj("colObjsJSON"));} catch (e) {}
  try { colObj.id = GetObj("colObjsJSON").length; } catch (e) {}
  if(colObj.id===null){colObj.id=0;}

  CreateCol(colObj);
  return null;
}

function SetColId(objs){
  for(let i = 0; i<objs.length;i++){
    objs[i].id = i;
  }
  return objs;
}

function CreateCol(colObj){
  let col = document.createElement("div");
  let colHeader = document.createElement("p");
  let objCont = document.createElement("div");
  let delColBtn = document.createElement("Button");
  let addBtn = document.createElement("Button");

  col.classList.add("col");
  colHeader.classList.add("colHeader");
  objCont.id = "col"+colObj.id;
  delColBtn.classList.add("delColBtn");
  addBtn.classList.add("addbtn");

  addBtn.setAttribute("onclick", "AddTod(m)"); //addTod(col index)
  delColBtn.setAttribute("onclick", "DeleteCol("+colObj.id+")");
  colHeader.innerHTML=colObj.title;
  addBtn.innerHTML = "+";
  delColBtn.innerHTML = "-";
  
  col.appendChild(colHeader);
  col.appendChild(delColBtn);
  col.appendChild(objCont);
  col.appendChild(addBtn);

  
  container.appendChild(col);
  return col;
}
AddCol();
function loadCol(){
  return null;
}
function DeleteCol(id){
  return null;
}

container.style.width = 324 * 4 + "px"; //add width with new cols

function saveCol(){
  return null;
}

window.addEventListener('keypress', () => { window.clearTimeout(saveTextTimeout);}, true);

document.addEventListener("DOMContentLoaded", (event) => {
    loadCol();
    LoadTod();
  });