const createFolderBtn = document.getElementById("createFolder");
const newFolderForm = document.getElementById("formContainer");
const exitButton = document.getElementById("exitButton");
function toggleCreateFolderForm (){
    document.getElementById("overlay").classList.add("active");
    newFolderForm.classList.add("active");

}
function exitForm(){
    document.getElementById("overlay").classList.remove("active");
    newFolderForm.classList.remove("active");
}
document.addEventListener("DOMContentLoaded",function(){
    createFolderBtn.addEventListener("click", ()=>
        {
            toggleCreateFolderForm();
        });
        
        exitButton.addEventListener("click", ()=>
        {
            exitForm();
        });


})

