const leftcontainer = document.getElementById("left-container");
const rightcontainer = document.getElementById("right-container");
const url = "http://localhost:3000/listItems/";

async function GetAllObjs(){
    const objs = await fetch(url,{
        method:"GET",
        header: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .catch(error => console.log(error));
    return objs;
}

async function GetOne(id){
    const obj = await fetch(url + id,{
        method:"GET",
        header: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .catch(error => console.log(error));
    return obj;
}

async function SetObj(obj){
    await fetch(url,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then((res) => res.json())
    .catch((err) => { console.error("Error: ", err);});
}

async function DeleteItem(id){
    await fetch(url + id,{
      method: "DELETE"
    })
    .then(res => res.json())
    .catch((err) => { console.error("Error: ", err);});

    try {
        document.getElementById("idelem").value === id ? ClearRightCont() : null;
    } catch (error) {
        console.log(error);
    }

    Load();
}

async function UpdateText(obj){
    await fetch(url + obj.type + "/" + obj.id,{
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj.content)
    })
    .then((res) => res.json())
    .then(Load())
    .catch((err) => { console.error("Error: ", err);});
}

async function UploadImage(ev){
    ev.preventDefault();

    const inpFile = document.getElementById("selectImg");
    const fd = new FormData();
    const id = document.getElementById("idelem").value;
    if(inpFile.files[0] === undefined){
        alert("choose an image to submit");
    }else{
        fd.append("img", inpFile.files[0]);

        await fetch(url + "upload/" + id, {
            method: "POST",
            body: fd
        })
        .then((res) => res.json())
        .then(setTimeout(() => {RefreshImgSpace(id);}, 2000))
        .catch((err) => console.log(err));
    }
}

async function AddObj() {

    let obj = {
        title: "title",
        imgurl: "",
        texts: ""
    }
    await SetObj(obj);
    Load();
}

function CreateListItem(obj) {
    const listItem = document.createElement("div"),
    listItemHeader = document.createElement("p"),
    delListItemBtn = document.createElement("Button"),
    expandBtn = document.createElement("Button");
  
    listItem.classList.add("item", "listItem");
    listItemHeader.classList.add("itemHeader");
    delListItemBtn.classList.add("delItemBtn", "fa", "fa-trash-o");
    expandBtn.classList.add("expandBtn");

    listItemHeader.innerHTML = obj.title;
    delListItemBtn.setAttribute("onclick", "DeleteItem('"+obj._id+"');");
    expandBtn.setAttribute("onclick", "ExpandItem('"+obj._id+"');");
    
    listItem.appendChild(listItemHeader);
    listItem.appendChild(delListItemBtn);
    listItem.appendChild(expandBtn);
    
    leftcontainer.appendChild(listItem);
}

function CreateAddBtn(){
    const addElement = document.createElement("div"),
    addBtn = document.createElement("Button");

    addElement.classList.add("contAdd");
    addBtn.classList.add("fa", "fa-plus", "contAddBtn", "listItem");
    addBtn.setAttribute("onclick", "AddObj()");

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


async function Load() {
    let objs = await GetAllObjs();

    ClearLeftCont();

    if(objs.items!==null){
        for(const item in objs.items){
            CreateListItem(objs.items[item]);
        }
    }
    CreateAddBtn();
}

function CreateExpandableObj(obj){
    const expandObjTitle = document.createElement("textarea"),
    textarea = document.createElement("textarea"),
    img = document.createElement("img"),
    addImgForm = document.createElement("form"),
    idelem = document.createElement("input"),
    selectImgBtn = document.createElement("input"),
    submitImgBtn = document.createElement("button");


    //creating the title area
    expandObjTitle.value = obj.title;
    expandObjTitle.classList.add("expandedItemTitle", "rcItem");
    expandObjTitle.setAttribute("oninput","SetText({content: {title: value}, type: 'title', id: '"+obj._id+"'});");

    //loading the image
    img.id = "imgelement";
    img.classList.add("rcItem");
    obj.imgurl != "" ? img.setAttribute("src", "http://localhost:3000/" + obj.imgurl) : null;


    //creating the image upload form
    addImgForm.id = "imgForm";
    addImgForm.classList.add("rcItem");

    idelem.setAttribute("type", "hidden");
    idelem.id = "idelem";
    idelem.value = obj._id;

    selectImgBtn.setAttribute("name", "img");
    selectImgBtn.setAttribute("type", "file");
    selectImgBtn.setAttribute("accept", "image/*");
    selectImgBtn.classList.add("selectBtn");
    selectImgBtn.id = "selectImg";

    submitImgBtn.setAttribute("type", "submit");
    submitImgBtn.addEventListener("click", UploadImage);
    submitImgBtn.classList.add("submitBtn");
    submitImgBtn.innerHTML = "Submit";

    addImgForm.appendChild(idelem);
    addImgForm.appendChild(selectImgBtn);
    addImgForm.appendChild(submitImgBtn);
    
    //creating the textarea
    textarea.classList.add("expandedItemtextarea", "rcItem");
    textarea.value = obj.texts;
    textarea.setAttribute("oninput","SetText({content: {texts: value}, type: 'texts', id: '"+obj._id+"'}); ResizeTextarea();" 
        +'this.style.minHeight = "";' 
        +'this.style.minHeight = this.scrollHeight + "px"');
    
    //appending elements to the container
    rightcontainer.appendChild(expandObjTitle);
    rightcontainer.appendChild(img);
    rightcontainer.appendChild(addImgForm);
    rightcontainer.appendChild(textarea);

}

function ResizeTextarea() {
    const tae = document.getElementsByClassName("expandedItemtextarea");
    let ta = Array.from(tae);

    ta.forEach((ta) => {
      ta.style.minHeight = ta.scrollHeight + "px";
    })
}

async function ExpandItem(id){
    const obj = await GetOne(id);
    ClearRightCont();
    CreateExpandableObj(obj);
    ResizeTextarea();
}

async function RefreshImgSpace(id){
    const obj = await GetOne(id);
    const img = document.getElementById("imgelement");
    
    obj.imgurl != "" ? img.setAttribute("src", "http://localhost:3000/" + obj.imgurl) : null;
}

let saveTextTimeout;
function SetText(obj){
    saveTextTimeout = setTimeout(() => {UpdateText(obj);}, 500);
}

window.addEventListener('keypress', () => {
     window.clearTimeout(saveTextTimeout);
}, true);

document.addEventListener("DOMContentLoaded", () => { Load(); });
