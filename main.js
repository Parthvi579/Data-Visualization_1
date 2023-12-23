

function clicked_countryname(Country){

    if(Country==null){
        updatelinechart("India");
    }
    else{
    updatelinechart(Country);
    }
    console.log(Country);
}