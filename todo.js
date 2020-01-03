
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

var saveTextTimeout;


function AddTod(col){
  Load();
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
  StoreObj(obj, "objsJSON");
  Load();
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

  col0.appendChild(obj); //redo this
  
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

function StoreObj(obj, objType){
  let objs = GetObj(objType);
  if (objs===null){objs=[];}
  objs.push(obj);

  SaveToLocalStorage(objs, objType);
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
  Load();
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
  Load();
}

//* ------------------------------------------------------------------------ */
//* ------------------------------------------------------------------------ */
//* ------------------------------------------------------------------------ */

function AddCol(){
  Load();
  let colObj = {
    id: 0,
    title: "",
    toBeDeleted: false
  }
  try { SetColId(GetObj("colObjsJSON"));} catch (e) {}
  try { colObj.id = GetObj("colObjsJSON").length; } catch (e) {}
  if(colObj.id===null){colObj.id=0;}

  CreateCol(colObj);
  StoreObj(colObj, "colObjsJSON");
  
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

  addBtn.setAttribute("onclick", "AddTod("+colObj.id+")"); //addTod(col index)
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

function Load(){
  ClearCont();
  let colObjs = GetObj("colObjsJSON");
  let todObjs = GetObj("objsJSON");
  if(colObjs!==null){
    for(let i = 0; i<colObjs.length;i++){
      CreateCol(colObjs[i]);
    }
  }
  if(todObjs!==null){
    for(let i = 0; i<todObjs.length;i++){
      AppendTod(todObjs[i].column, CreateTod(todObjs[i]));
    }
  }
  ResizeTextarea();

}
function DeleteCol(id){
  return null;
}
function ClearCont(){
  while (container.firstChild){
    container.removeChild(container.firstChild);
  }
}

container.style.width = 324 * 4 + "px"; //add width with new cols

function saveCol(){
  return null;
}

window.addEventListener('keypress', () => { window.clearTimeout(saveTextTimeout);}, true);

document.addEventListener("DOMContentLoaded", (event) => {
    Load();
  });