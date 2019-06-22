var r = 3, m = 2, l = 1;
var right = document.getElementById("right");
var middle = document.getElementById("middle");
var left = document.getElementById("left");
var saveTextTimeout;

function getTodo(){
  let text = localStorage.getItem("objsJSON");
  obj = JSON.parse(text);
  return obj;
}

function setTodoId(objs){
  for(let i = 0; i<objs.length;i++){
    objs[i].id = i;
  }
  return objs;
}

function saveToLocalStorage(objs){
  let objsJSON = JSON.stringify(objs);
  localStorage.setItem("objsJSON", objsJSON);
}

function addTodo(col){
  loadTodo();
  let obj = {
              id: 0,
              column: col,
              text: "",
              isDone: false,
              toBeDeleted: false
            };
  try { setTodoId(getTodo());} catch (e) {}
  try { obj.id = getTodo().length; } catch (e) {}
  if(obj.id===null){obj.id=0;}


  createTodo(obj);
  storeTodo(obj);
  loadTodo();
}

function createTodo(obj){
  let listObj = document.createElement("div");
  let input = document.createElement("input");
  let donebtn = document.createElement("button");
  let delbtn = document.createElement("button");

  input.classList.add("todoinput");
  listObj.classList.add("listObj");
  donebtn.classList.add("donebtn", "fa", "fa-check-square");
  delbtn.classList.add("delbtn", "fa", "fa-trash-o");

  if(obj.isDone){
    input.setAttribute("style","background-color: green");
    delbtn.setAttribute("style","background-color: green");
    donebtn.setAttribute("style","background-color: green");
  }
  delbtn.setAttribute("onclick","delTodo("+obj.id+");");
  donebtn.setAttribute("onclick","doneTodo("+obj.id+");");
  input.setAttribute("value",obj.text);
  input.setAttribute("placeholder", "Write here!");
  input.setAttribute("oninput", "stt(value, "+obj.id+");");
  listObj.setAttribute("id", "lo"+obj.id);
  listObj.appendChild(input);
  listObj.appendChild(donebtn);
  listObj.appendChild(delbtn);

  return listObj;
}

function appendTodo(column,obj){
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

function stt(text, id){
  saveTextTimeout = setTimeout(function(){storeText(text, id);}, 300);
}

function storeText(text, id){
  let objs = getTodo();

  objs.forEach(function(obj){
    if(id===obj.id){
      obj.text = text;
    }
  });

  saveToLocalStorage(objs);
}

function storeTodo(obj){
  let objs = getTodo();
  if (objs===null){objs=[];}
  objs.push(obj);

  saveToLocalStorage(objs);
}

function loadTodo(){
  clearTodo();
  let objs = getTodo();
  if(objs!==null){
    for(let i = 0; i<objs.length;i++){
      appendTodo(objs[i].column, createTodo(objs[i]));
    }
  }
}

function doneTodo(e){
  let objs = getTodo();

  objs.forEach(function(g){
    if(e===g.e){
      if(objs[e].isDone){
        objs[e].isDone=false;
      }
      else{
        objs[e].isDone=true;
      }
    }
  });

  saveToLocalStorage(objs);
  loadTodo();
}

function delTodo(id){

  let objs = getTodo();

  objs.forEach(function(obj){
    if(id===obj.id){
      objs[id].toBeDeleted=true;
    }
  });

  for(let i = 0; i<objs.length;i++){
    if(objs[i].toBeDeleted===true){
      objs.splice(i,1);
    }
  }

  setTodoId(objs);
  saveToLocalStorage(objs);
  loadTodo();
}

function clearTodo(){

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

window.addEventListener('keypress', function() {
  window.clearTimeout(saveTextTimeout);
}, true);

document.addEventListener("DOMContentLoaded", function(event) {
  loadTodo();
});
