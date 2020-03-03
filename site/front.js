const leftcontainer = document.getElementById("left-container");
const rightcontainer = document.getElementById("right-container");
const url = "http://localhost:3000/cols/";

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

async function SetCol(obj){
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

    document.getElementById("idelem").value === id ? ClearRightCont() : null;
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

async function AddItem() {

    let obj = {
        title: "title",
        imgurl: "",
        texts: ""
    }
    await SetCol(obj);
    Load();
}

function CreateListItem(obj) {
    const listItem = document.createElement("div"),
    listItemHeader = document.createElement("p"),
    delListItemBtn = document.createElement("Button"),
    expandBtn = document.createElement("Button");
  
    listItem.classList.add("col");
    listItemHeader.classList.add("colHeader");
    delListItemBtn.classList.add("delColBtn", "fa", "fa-trash-o");
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
    addBtn.classList.add("fa", "fa-plus", "contAddBtn");
    addBtn.setAttribute("onclick", "AddItem()");

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
function SetText(obj){
    saveTextTimeout = setTimeout(() => {UpdateText(obj);}, 500);
}

async function Load() {
    let objs = await GetAllObjs();

    ClearLeftCont();

    if(objs.cols!==null){
        for(const col in objs.cols){
            CreateListItem(objs.cols[col]);
        }
    }
    CreateAddBtn();
}

function CreateExpandableObj(obj){
    const expandObjTitle = document.createElement("textarea"),
    textarea = document.createElement("textarea"),
    imgspace = document.createElement("div"),
    img = document.createElement("img"),
    addImgForm = document.createElement("form"),
    idelem = document.createElement("input"),
    selectImgBtn = document.createElement("input"),
    submitImgBtn = document.createElement("button");


    //creating the title area
    expandObjTitle.value = obj.title;
    expandObjTitle.classList.add("expandedObjTitle");
    expandObjTitle.setAttribute("oninput","SetText({content: {title: value}, type: 'title', id: '"+obj._id+"'});");

    //loading the image
    img.id = "imgelement";
    imgspace.classList.add("expandedObjImg");
    obj.imgurl != "" ? img.setAttribute("src", "http://localhost:3000/" + obj.imgurl) : null;
    imgspace.appendChild(img);

    //creating the image upload form
    addImgForm.id = "imgForm";

    idelem.setAttribute("type", "hidden");
    idelem.id = "idelem";
    idelem.value = obj._id;

    selectImgBtn.setAttribute("name", "img");
    selectImgBtn.setAttribute("type", "file");
    selectImgBtn.setAttribute("accept", "image/*");
    selectImgBtn.classList.add("formBtn");
    selectImgBtn.id = "selectImg";

    submitImgBtn.setAttribute("type", "submit");
    submitImgBtn.addEventListener("click", UploadImage);
    submitImgBtn.classList.add("formBtn");

    addImgForm.appendChild(idelem);
    addImgForm.appendChild(selectImgBtn);
    addImgForm.appendChild(submitImgBtn);
    
    //creating the textarea
    textarea.classList.add("expandedObjtextarea");
    textarea.value = obj.texts;
    textarea.setAttribute("oninput","SetText({content: {texts: value}, type: 'texts', id: '"+obj._id+"'});" 
        +'this.style.height = "";' 
        +'this.style.height = this.scrollHeight + "px"');
    
    //appending elements to the container
    rightcontainer.appendChild(expandObjTitle);
    rightcontainer.appendChild(imgspace);
    rightcontainer.appendChild(addImgForm);
    rightcontainer.appendChild(textarea);

}

function ResizeTextarea() {
    let tae = document.getElementsByClassName("expandedObjtextarea");
    let ta = Array.from(tae);
    ta.forEach((ta) => {
      ta.style.height = ta.scrollHeight + "px";
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
    const img = document.createElement("img");
    expandedObjImg = document.getElementsByClassName("expandedObjImg")[0];
    expandedObjImg.firstChild ? expandedObjImg.removeChild(expandedObjImg.firstChild) : null;
    obj.imgurl != "" ? img.setAttribute("src", "http://localhost:3000/" + obj.imgurl) : null;
    expandedObjImg.appendChild(img);
}

window.addEventListener('keypress', () => {
     window.clearTimeout(saveTextTimeout);
}, true);

document.addEventListener("DOMContentLoaded", () => { Load(); });
