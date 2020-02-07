const content = document.getElementById("content");
const container = document.getElementById("container");

let saveTextTimeout;


function AddTex(col) {
  Load();

  let obj = {
    id: 0,
    column: col,
    title: "",
    text: "",
    done: false,
    hidden: false
  };
  
  try { SetObjId(GetObj("objsJSON"));} catch (e) {}
  try { obj.id = GetObj("objsJSON").length; } catch (e) {}
  
  CreateTex(obj);
  StoreObj(obj, "objsJSON");
  Load();
  GetTest();
}

function SetObjId(objs) {
  if(objs!==null){
    for(let i = 0; i<objs.length;i++){
      objs[i].id = i;
    }
  }
  return objs;
}

function CreateTex(obj) {
  const listObj = document.createElement("div");
  const textarea = document.createElement("textarea");
  const donebtn = document.createElement("button");
  const delbtn = document.createElement("button");

  textarea.classList.add("todoinput");
  listObj.classList.add("listObj");
  donebtn.classList.add("donebtn", "fa", "fa-check-square");
  delbtn.classList.add("delbtn", "fa", "fa-trash-o");
  listObj.id = "lo"+obj.id;

  if(obj.done){
    listObj.setAttribute("style","background-color: rgb(0, 30, 0)");
    textarea.setAttribute("style","background-color: DarkGreen");
    delbtn.setAttribute("style","background-color: DarkGreen");
    donebtn.setAttribute("style","background-color: DarkGreen");
  }

  delbtn.setAttribute("onclick","DeleteTex("+obj.id+");");
  donebtn.setAttribute("onclick","DoneTex("+obj.id+");");
  textarea.value = obj.text;
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

function AppendTex(column,obj) {
  let colToAppend = document.getElementById("col" + column);
  colToAppend !== null ? colToAppend.appendChild(obj) : null;
}

function STT(text, id) {
  saveTextTimeout = setTimeout(() => {StoreText(text, id);}, 300);
}

function StoreText(text, id) {
  let objs = GetObj("objsJSON");

  objs.forEach((obj) => {
    id===obj.id ? obj.text = text : null;
  });

  SaveToLocalStorage(objs, "objsJSON");
}

function StoreObj(obj, objType) {
  let objs = GetObj(objType);
  objs === null ? objs=[] : null;
  objs.push(obj);

  SaveToLocalStorage(objs, objType);
}

function ResizeTextarea() {
  let textareasc = document.getElementsByClassName("todoinput");
  let textareas = Array.from(textareasc);
  textareas.forEach((ta) => {
    ta.style.height = ta.scrollHeight + "px";
  })
}

function ResizeCont(leng) {
  container.style.width = 324 * leng + "px";
  content.style.width = 324 * leng + 60 + "px";
}

function GetObj(objType) { //objtype = objsJSON/colObjsJSON
  let text, obj
  if(objType === "colObjsJSON"){
    obj = GetColsTest();
  }else{
    text = localStorage.getItem(objType);
    obj = JSON.parse(text);
  }
  return obj;
}

function SaveToLocalStorage(objs, objType) {
  let objsJSON = JSON.stringify(objs);
  localStorage.setItem(objType, objsJSON);
  
  if (objType === "colObjsJSON"){
    PostTest(objs);
  }
  
}

function DoneTex(id) {
  let objs = GetObj("objsJSON");

  objs.forEach((obj) => {
    id === obj.id ? 
      objs[id].done ?
      objs[id].done = false :
      objs[id].done = true : 
      null;
  });

  SaveToLocalStorage(objs, "objsJSON");
  Load();
}

function DeleteTex(id) {

  let objs = GetObj("objsJSON");

  objs.forEach((obj) => {
    id === obj.id ? objs.splice(id,1) : null;
  });

  SetObjId(objs);
  SaveToLocalStorage(objs, "objsJSON");
  Load();
}

//* ------------------------------------------------------------------------ */

function AddCol() {

  Load();

  let colObj = {
    id: 0,
    title: ""
  }

  try { SetObjId(GetObj("colObjsJSON"));} catch (e) {}
  try { colObj.id = GetObj("colObjsJSON").length; } catch (e) {}

  CreateCol(colObj);
  StoreObj(colObj, "colObjsJSON");
  
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

function Load() {

  ClearCont();

  let colObjs = GetObj("colObjsJSON");
  let innerObjs = GetObj("objsJSON");

  if(colObjs!==null){
    for(let i = 0; i<colObjs.length;i++){
      CreateCol(colObjs[i]);
    }
    ResizeCont(colObjs.length);
  }

  if(innerObjs!==null){
    for(let i = 0; i<innerObjs.length;i++){
      AppendTex(innerObjs[i].column, CreateTex(innerObjs[i]));
    }
  }

  ResizeTextarea();
}

function DeleteCol(id) {
  
  let objs = GetObj("objsJSON");
  let colObjs = GetObj("colObjsJSON");


  if(objs !== null){
    for(let i = objs.length -1; i >= 0; i--){
      objs[i].column === id ? objs.splice(i,1) : null;
    }
  }

  for(let i = 0; i<objs.length; i++){
    objs[i].column > id ? objs[i].column-- : null;
  }

  colObjs.forEach((colObj) => {
    id === colObj.id ? colObjs.splice(id, 1) : null;
  });


  SetObjId(colObjs);
  SetObjId(objs);

  SaveToLocalStorage(objs, "objsJSON");
  SaveToLocalStorage(colObjs, "colObjsJSON");
  Load();

  DeleteTest(id);
}

function ClearCont(){
  while (container.firstChild){
    container.removeChild(container.firstChild);
  }
}

function PostTest(objs){
  fetch("http://localhost:3000/cols/",{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(objs[objs.length-1])
  })
  .then((response) => response.json())
  .then((data) => { console.log("Success: ", objs[objs.length-1]);})
  .catch((err) => { console.error("Error: ", err);});
}

function GetColsTest(){
  fetch("http://localhost:3000/cols/",{
    method:"GET",
    header: {"Content-Type": "application/json"}})
  .then(res => {
    return res.json();
  })
  .then(data => {
    console.log(data);
  })
}

function DeleteTest(id){
  fetch("http://localhost:3000/cols/" + id,{
    method: "DELETE"
  })
  .then(res => res.json())
  .then((data) => { console.log("Success: ", id);});
}
window.addEventListener('keypress', () => { window.clearTimeout(saveTextTimeout);}, true);

document.addEventListener("DOMContentLoaded", event => {
    Load();
  });