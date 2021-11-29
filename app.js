const saveBtn = document.getElementById("add-file-btn");
const fileInput = document.getElementById("input-file");
const card = document.getElementById("card");

const imagesBox = document.createElement("div");

imagesBox.classList.add("imagesBox");

card.appendChild(imagesBox);

const allImages = getLocalStorage() || [];
generateImgList(allImages);

saveBtn.addEventListener("click", (event) => {
    fileInput.click();
})

fileInput.addEventListener("change", (event) => {
    const newImgArr = Array.from(fileInput.files)
    let imgFromLocal = getLocalStorage() || [];
    let arrNewImg = [];

    for (let i = 0; i < newImgArr.length; i++) {
        const reader = new FileReader();
        console.log(fileInput.files)
        reader.addEventListener("load", (event) => {

            const img = new Img(generateId(arrNewImg.length ? arrNewImg : imgFromLocal), event.target.result, newImgArr[i].name);
            arrNewImg.push(img);

            if (newImgArr.length - 1 === i) {
                const allImages = imgFromLocal.concat(arrNewImg);
                imagesBox.innerHTML = '';

                generateImgList(allImages);

                if (!localStorage.massages) {
                    setLocalStorage(allImages);
                }
                if (localStorage.massages) {
                    console.log(localStorage.massages.length)
                    if (localStorage.massages.length < 5000000) {
                        setLocalStorage(allImages);
                    } else {
                        console.log(`You can use only 5MB. But you have already used ${localStorage.massages.length}B`)
                    }
                }
            }
        })
        reader.readAsDataURL(newImgArr[i]);
    }
})
imagesBox.addEventListener("click", (ev) => {
    if (!ev.target.dataset.name) {
        return
    }
    const id = +ev.target.dataset.name;
    removeImg(id);

    const block = imagesBox.querySelector(`[data-name="${id}"]`).parentElement;
    const nameImg = block.lastElementChild.firstElementChild;
    nameImg.classList.add('delete');

    setTimeout(()=>{
        block.classList.add('removed');
        setTimeout(()=>{
            block.remove();
        },500)
    },500)

})

function generateImgList(imgArr) {
    for (let i = 0; i < imgArr.length; i++) {
        imagesBox.insertAdjacentHTML("afterbegin", `
           <div class="img-block">
              <div class="removeSymbol" data-name = ${imgArr[i].id}>&times;</div>
              <img src="${imgArr[i].imgStr}" alt="${imgArr[i].name}">
              <div class="nameImg"><p class="name">${imgArr[i].name}</p></div>
           </div>`);
    }
}

//work with locale storage
function getLocalStorage() {
    return JSON.parse(localStorage.getItem("massages"));
}

function removeImg(id) {
    return setLocalStorage(getLocalStorage().filter((img) => id !== img.id));
}

function setLocalStorage(masItem) {
    const masImgToStr = JSON.stringify(masItem);
    localStorage.setItem("massages", masImgToStr);

    return masItem
}

//classes
class Img {
    constructor(id, imgStr, name) {
        this.id = id;
        this.imgStr = imgStr;
        this.name = name;
    }
}

//helpers
function generateId(arr) {
    if (!arr.length) {
        return 1
    }
    return arr[arr.length - 1].id + 1
}


