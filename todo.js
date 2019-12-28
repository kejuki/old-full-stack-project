var r = 3, m = 2, l = 1;
var right = document.getElementById("right");
var middle = document.getElementById("middle");
var left = document.getElementById("left");
var saveTextTimeout;

function getTod(){
  let text = localStorage.getItem("objsJSON");
  obj = JSON.parse(text);
  return obj;
}

function setTodId(objs){
  for(let i = 0; i<objs.length;i++){
    objs[i].id = i;
  }
  return objs;
}

function saveToLocalStorage(objs){
  let objsJSON = JSON.stringify(objs);
  localStorage.setItem("objsJSON", objsJSON);
}

function addTod(col){
  loadTod();
  let obj = {
              id: 0,
              column: col,
              text: "",
              isDone: false,
              toBeDeleted: false
            };
  try { setTodId(getTod());} catch (e) {}
  try { obj.id = getTod().length; } catch (e) {}
  if(obj.id===null){obj.id=0;}


  createTod(obj);
  storeTod(obj);
  loadTod();
}

function createTod(obj){
  let listObj = document.createElement("div");
  let textarea = document.createElement("textarea");
  let donebtn = document.createElement("button");
  let delbtn = document.createElement("button");

  textarea.classList.add("todoinput");
  listObj.classList.add("listObj");
  donebtn.classList.add("donebtn", "fa", "fa-check-square");
  delbtn.classList.add("delbtn", "fa", "fa-trash-o");

  if(obj.isDone){
    listObj.setAttribute("style","background-color: rgb(0, 30, 0)");
    textarea.setAttribute("style","background-color: DarkGreen");
    delbtn.setAttribute("style","background-color: DarkGreen");
    donebtn.setAttribute("style","background-color: DarkGreen");
  }
  delbtn.setAttribute("onclick","delTod("+obj.id+");");
  donebtn.setAttribute("onclick","doneTod("+obj.id+");");
  textarea.value=obj.text;
  textarea.setAttribute("placeholder", "Write here!");
  textarea.setAttribute("oninput",
                        "stt(value, "+obj.id+");" +
                        'this.style.height = "";' +
                        'this.style.height = this.scrollHeight + "px"');
  
  listObj.setAttribute("id", "lo"+obj.id);
  listObj.appendChild(textarea);
  listObj.appendChild(donebtn);
  listObj.appendChild(delbtn);

  return listObj;
}




function appendTod(column,obj){
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
  let objs = getTod();

  objs.forEach(function(obj){
    if(id===obj.id){
      obj.text = text;
    }
  });
  saveToLocalStorage(objs);
}

function storeTod(obj){
  let objs = getTod();
  if (objs===null){objs=[];}
  objs.push(obj);

  saveToLocalStorage(objs);
}

function loadTod(){
  clearTod();
  let objs = getTod();
  if(objs!==null){
    for(let i = 0; i<objs.length;i++){
      appendTod(objs[i].column, createTod(objs[i]));
    }
  }
  textBoxResize();
}

function textBoxResize(){
  let textareasc = document.getElementsByClassName("todoinput");
  let textareas = Array.from(textareasc);
  console.log(textareas);
  textareas.forEach(function(ta){
    ta.style.height = ta.scrollHeight + "px";
  })
}

function doneTod(e){
  let objs = getTod();

  objs.forEach(function(g){
    if(e===g.id){
      if(objs[e].isDone){
        objs[e].isDone=false;
      }
      else{
        objs[e].isDone=true;
      }
    }
  });

  saveToLocalStorage(objs);
  loadTod();
}

function delTod(id){

  let objs = getTod();

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

  setTodId(objs);
  saveToLocalStorage(objs);
  loadTod();
}

function clearTod(){

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

window.addEventListener('keypress', function() { window.clearTimeout(saveTextTimeout);}, true);

document.addEventListener("DOMContentLoaded", function(event) {
  loadTod();
});
