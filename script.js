function createWindow(){
    document.getElementById('createContainer').style.display = 'flex';
    document.getElementById('horariosContainer').style.display = 'none';
    document.getElementById('buttonAlterar1').style.opacity = '100%';
    document.getElementById('buttonAlterar2').style.opacity = '30%';
}

function horariosWindow(){
    document.getElementById('createContainer').style.display = 'none';
    document.getElementById('horariosContainer').style.display = 'flex';
    document.getElementById('buttonAlterar1').style.opacity = '30%';
    document.getElementById('buttonAlterar2').style.opacity = '100%';
}

