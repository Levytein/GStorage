const fileInput = document.getElementById('file');
const fileNameDisplay = document.getElementById('file-name');
let toggleNavButton = document.getElementById('toggleNav');
let toggleNavButtonOn = document.getElementById('toggleNavOn');
toggleNavButton.addEventListener(`click`,()=>
{
 
      document.getElementById('fileDisplayContainer').style.marginLeft = `0px`;
      document.getElementById('fileDisplayContainer').style.width = `100vw`;
      toggleNavButtonOn.style.display = `block`;
      document.getElementById('navBar').style.display = `none`;
});
toggleNavButtonOn.addEventListener(`click`,()=>
{
  document.getElementById('fileDisplayContainer').style.marginLeft = `200px`;
  document.getElementById('fileDisplayContainer').style.width = `calc(100vw-200px)`;
  document.getElementById('navBar').style.display = `flex`;
  toggleNavButtonOn.style.display = `none`;
});
function attachListener()
{
  toggleNavButton = document.getElementById('toggleNav');
}
fileInput.addEventListener('change', function() {
  const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
  fileNameDisplay.textContent = fileName;
});

document.addEventListener("DOMContentLoaded", function() {
  // Attach click event listeners to all folder containers
  document.querySelectorAll('.folderNav.clickable').forEach(function(el) {
    el.addEventListener('click', function(event) {
      // Prevent the click event from bubbling up if necessary
      event.stopPropagation();
      // Get the folder name from the data attribute
      var folderName = this.getAttribute('data-folder-name');
      // Navigate to the folder route using the folder name
      window.location.href = '/folder?folderName=' + encodeURIComponent(folderName);
    });
  });
});