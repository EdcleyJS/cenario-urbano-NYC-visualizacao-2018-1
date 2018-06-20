function exibiVisualizacao() {
    if (document.getElementById('V1').checked) {
        document.getElementById('G1').style.visibility = 'visible';
    } else{
        document.getElementById('G1').style.visibility = 'hidden';
    }
    if(document.getElementById('V2').checked){
       document.getElementById('G2').style.visibility = 'visible'; 
    }else {
       document.getElementById('G2').style.visibility = 'hidden';
    }
    if(document.getElementById('V3').checked){
       document.getElementById('G3').style.visibility = 'visible'; 
    }else {
       document.getElementById('G3').style.visibility = 'hidden';
    }

}