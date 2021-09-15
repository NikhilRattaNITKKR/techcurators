const getId=(url)=>{                    
let id;
let parts=url.split('spreadsheets/d/');
if(parts[1].includes('/')){
id=parts[1].split('/')[0];
}else{
    id=parts[1];
}
return id;
}

module.exports={
    getId
}