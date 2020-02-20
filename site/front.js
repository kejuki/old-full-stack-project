const leftcontainer = document.getElementById("left-container");
const rightcontainer = document.getElementById("right-container");

async function getCols(){
    const cols = await fetch("http://localhost:3000/cols/",{
        method:"GET",
        header: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .catch(error => console.log(error));
    return cols;
}
async function getOne(url, id){
    const obj = await fetch(url + id,{
        method:"GET",
        header: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .catch(error => console.log(error));
    return obj;
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
//colid form actionssii
async function UpdateText(obj){
    await fetch("http://localhost:3000/cols/" +obj.type+ "/" +obj.id,{
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj.content)
    })
    .then((response) => response.json())
    .then(Load())
    .catch((err) => { console.error("Error: ", err);});
}

async function UploadImage(ev){
    ev.preventDefault();

    const inpFile = document.getElementById("selectImg");
    const fd = new FormData();
    const id = document.getElementById("idelem").value;
    fd.append("myImage", inpFile.files[0]);

    await fetch("http://localhost:3000/cols/upload/" + id, {
        method: "POST",
        body: fd
    })
    .then((response) => response.json())
    .then(setTimeout(() => {ExpandObj(id);}, 2000))
    .catch((err) => console.log(err));
}

async function AddCol() {

    let obj = {
        title: "title",
        imgurl: "",
        texts: ""
    }
    await SetCol(obj);
    Load();
}

function CreateCol(colObj) {
    const   col = document.createElement("div"),
            colHeader = document.createElement("p"),
            delColBtn = document.createElement("Button"),
            expandBtn = document.createElement("Button");
  
    col.classList.add("col");
    colHeader.classList.add("colHeader");
    delColBtn.classList.add("delColBtn", "fa", "fa-trash-o");
    expandBtn.classList.add("expandBtn");

    colHeader.innerHTML = colObj.title;
    delColBtn.setAttribute("onclick", "DeleteCol('"+colObj._id+"');");
    expandBtn.setAttribute("onclick", "ExpandObj('"+colObj._id+"');");
    //colHeader.setAttribute("oninput","SetText(value, '"+colObj._id+"');");
    
    col.appendChild(colHeader);
    col.appendChild(delColBtn);
    col.appendChild(expandBtn);
    
    leftcontainer.appendChild(col);
}

function CreateAddBtn(){
    const   addElement = document.createElement("div"),
            addBtn = document.createElement("Button");

    addElement.classList.add("contAdd");
    addBtn.classList.add("fa", "fa-plus", "contAddBtn");
    addBtn.setAttribute("onclick", "AddCol()");

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
    let colObjs = await getCols();
    console.log(colObjs);
    ClearLeftCont();

    if(colObjs.cols!==null){
        for(const col in colObjs.cols){
            CreateCol(colObjs.cols[col]);
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
    addImgForm.id = "objid";

    idelem.setAttribute("type", "hidden");
    idelem.id = "idelem";
    idelem.value = obj._id;

    selectImgBtn.setAttribute("name", "myImage");
    selectImgBtn.setAttribute("type", "file");
    selectImgBtn.setAttribute("accept", "image/*");
    selectImgBtn.classList.add("formBtn");
    selectImgBtn.id = "selectImg";

    submitImgBtn.setAttribute("type", "submit");
    submitImgBtn.addEventListener("click", UploadImage);
    submitImgBtn.classList.add("formBtn");

    imgspace.appendChild(addImgForm);
    addImgForm.appendChild(idelem);
    addImgForm.appendChild(selectImgBtn);
    addImgForm.appendChild(submitImgBtn);
    
    //creting the textarea
    textarea.classList.add("expandedObjtextarea");
    textarea.value = obj.texts;
    textarea.setAttribute("oninput","SetText({content: {texts: value}, type: 'texts', id: '"+obj._id+"'});");
    
    //appending elements to the container
    rightcontainer.appendChild(expandObjTitle);
    rightcontainer.appendChild(imgspace);
    rightcontainer.appendChild(textarea);

}

async function ExpandObj(id){
    let obj = await getOne("http://localhost:3000/cols/", id);
    ClearRightCont();
    CreateExpandableObj(obj);
}

window.addEventListener('keypress', () => {
     window.clearTimeout(saveTextTimeout);
}, true);

document.addEventListener("DOMContentLoaded", () => { Load(); });


