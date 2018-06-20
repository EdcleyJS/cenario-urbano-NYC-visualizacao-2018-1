var mymap = L.map('map').setView([40.773573,-73.9480237], 12);

var color = d3.scaleOrdinal().domain(["01","02","03","04","05","06","07","08","09","10","11",""])
  .range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']);
    
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 17,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiZWRjbGV5OTQ1MiIsImEiOiJjamdvMGdmZ2owaTdiMndwYTJyM2tteTl2In0.2q25nBNRxzFxeaYahFGQ6g'
  }).addTo(mymap);



shp("http://localhost:8080/mn_mappluto_17v1_1.zip").then(function(geojson){
      
  var features = geojson[1].features.slice(0,15000);
  var cf = crossfilter(features);
      
      console.log(geojson[1].features);
      //console.log(cf.size());

  var geomDimension = cf.dimension(function(d) {
    return d.geometry;
  });

  //console.log("2");

  var dimFireComp= cf.dimension(function(d){
    return d.properties.FireComp;
  }); 
  var weaponDimFireComp= dimFireComp.group();

  var dimRetailArea= cf.dimension(function(d){
    if(d.properties.RetailArea < 500) return '0-499';
    if(d.properties.RetailArea   >= 500 && d.properties.RetailArea   < 1000) return '500-999';
    if(d.properties.RetailArea   >= 1000 && d.properties.RetailArea   < 1500) return '1000-1499';
    if(d.properties.RetailArea   >= 1500 && d.properties.RetailArea   < 2999) return '1500-2999';
    if(d.properties.RetailArea   >= 3000 ) return '+3000';
  }); 
  var weaponDimRetailArea= dimRetailArea.group();
  
  var dimYearBuilt= cf.dimension(function(d){
    return d.properties.YearBuilt;
  }); 
  var weaponDimYearBuilt= dimYearBuilt.group();
  
  var dimYearAlter1= cf.dimension(function(d){
    return d.properties.YearAlter1;
  }); 
  var weaponDimYearAlter1= dimYearAlter1.group();
  
  var dimYearAlter2= cf.dimension(function(d){
    return d.properties.YearAlter2;
  }); 
  var weaponDimYearAlter2= dimYearAlter2.group();
      
  var dimSHAPE_Area= cf.dimension(function(d){
    if(d.properties.SHAPE_Area >= 0 && d.properties.SHAPE_Area < 499) return '0-499';
    if(d.properties.SHAPE_Area >= 500 && d.properties.SHAPE_Area < 4999) return '500-4999';
    if(d.properties.SHAPE_Area >= 5000 && d.properties.SHAPE_Area < 49999) return '5000-49999';
    if(d.properties.SHAPE_Area >= 50000 ) return '50000-4999999';
  });
  var weaponDimSHAPE_Area= dimSHAPE_Area.group();
  //console.log(dimSHAPE_Area.top(1));
  var dimSHAPE_Leng= cf.dimension(function(d){
    if(d.properties.SHAPE_Leng < 40){ return '0-40'}
    if(d.properties.SHAPE_Leng >= 40 && d.properties.SHAPE_Leng < 400) return '40-399';
    if(d.properties.SHAPE_Leng >= 400 && d.properties.SHAPE_Leng < 4000) return '400-3999';
    if(d.properties.SHAPE_Leng >= 4000) return '4000-36615';
  });
  
  var weaponDimSHAPE_Leng= dimSHAPE_Leng.group();      

  var dimNumFloors= cf.dimension(function(d){
    return d.properties.NumFloors;
  });

  var weaponNumFloors= dimNumFloors.group();      

  var dimPolicePrct= cf.dimension(function(d){
    return d.properties.PolicePrct;
  });
  var weaponPolicePrct= dimPolicePrct.group();
  
  var dimSchoolDist= cf.dimension(function(d){
    return d.properties.SchoolDist;
  });
  var weaponSchoolDist= dimSchoolDist.group();      

  var dimSanitDistr= cf.dimension(function(d){
    return d.properties.SanitDistr;
  });
  var weaponSanitDistr= dimSanitDistr.group();

  var dimLandUse= cf.dimension(function(d){
    return d.properties.LandUse;
  }); 
  var weaponDimLandUse= dimLandUse.group().reduceCount();

  var dimHealthArea= cf.dimension(function(d){
    if(d.properties.HealthArea < 500){ return '0-499'}
    if(d.properties.HealthArea  >= 500 && d.properties.HealthArea  < 1500) return '500-1499';
    if(d.properties.HealthArea  >= 1500 && d.properties.HealthArea  < 3500) return '1500-3499';
    if(d.properties.HealthArea  >= 3500 && d.properties.HealthArea  < 5000) return '3500-4999';
    if(d.properties.HealthArea  >= 5000 && d.properties.HealthArea  < 6500) return '5000-6499';
    if(d.properties.HealthArea  >= 6500) return '6500-9100';
  });
  var weaponDimHealthArea= dimHealthArea.group();

  var chart = dc.barChart("#graph2");
    chart.width(450)
          .height(200)
          .x(d3.scaleLinear().domain([1880,2000]))
          .brushOn(true)
          .yAxisLabel("Quantidade")
          .xAxisLabel("Ano")
          .dimension(dimYearBuilt)
          .group(weaponDimYearBuilt);

  var chart2 = dc.barChart("#graph3");
    chart2.width(450)
          .height(200)
          .x(d3.scaleLinear().domain([1930,2017]))
          .brushOn(true)
          .yAxisLabel("Quantidade de Alterações")
          .xAxisLabel("Ano")
          .dimension(dimYearAlter1)
          .group(weaponDimYearAlter1);

  var chart3 = dc.barChart("#graph4");
    chart3.width(450)
          .height(200)
          .x(d3.scaleLinear().domain([1930,2017]))
          .brushOn(true)
          .yAxisLabel("Quantidade de Alterações")
          .xAxisLabel("Ano")
          .dimension(dimYearAlter2)
          .group(weaponDimYearAlter2);
/*
  var chart4 = dc.pieChart("#graph");
    chart4.width(200)
          .height(200)
          .slicesCap(15)
          .innerRadius(5)
          .dimension(dimFireComp)
          .group(weaponDimFireComp)
          .renderLabel(true);
*/
  var chart5 = dc.barChart("#graph5");
    chart5.width(450)
          .height(200)
          .brushOn(true)
          .x(d3.scaleOrdinal().domain(["0-499","500-4999","5000-49999","50000-4999999"]))
          .xUnits(dc.units.ordinal)
          .yAxisLabel("Numero de Lotes")
          .xAxisLabel("Comprimento da Area em m2")
          .dimension(dimSHAPE_Area)
          .group(weaponDimSHAPE_Area);
          
  var chart6 = dc.barChart("#graph6");
    chart6.width(450)
          .height(200)
          .x(d3.scaleOrdinal().domain(["0-40","40-399","400-3999","4000-36615"]))
          .xUnits(dc.units.ordinal)
          .brushOn(true)
          .yAxisLabel("Número de Lotes")
          .xAxisLabel("Comprimento da Forma")
          .dimension(dimSHAPE_Leng)
          .group(weaponDimSHAPE_Leng);
  
  var chart7 = dc.barChart("#graph7");
    chart7.width(450)
          .height(200)
          .x(d3.scaleLinear().domain([1,50]))
          .brushOn(true)
          .yAxisLabel("Número de Lotes")
          .xAxisLabel("Número de Pisos")
          .dimension(dimNumFloors)
          .group(weaponNumFloors);       
  
/*  var chart8 = dc.barChart("#graph8");
    chart8.width(450)
          .height(200)
          .x(d3.scaleLinear().domain([1,35]))
          .brushOn(true)
          .yAxisLabel("Áreas Atendidos")
          .xAxisLabel("Nº do Distrito Policial")
          .dimension(dimPolicePrct)
          .group(weaponPolicePrct);      

  var chart9 = dc.barChart("#graph9");
    chart9.width(450)
          .height(200)
          .x(d3.scaleOrdinal().domain(["","01","02","03","04","05","06","10"]))
          .xUnits(dc.units.ordinal)
          .brushOn(true)
          .yAxisLabel("Nº de Áreas Atendidas")
          .xAxisLabel(" Nº da Escola Responsavel")
          .dimension(dimSchoolDist)
          .group(weaponSchoolDist);
*/
  var chart10 = dc.barChart("#graph10");
    chart10.width(450)
          .height(200)
          .x(d3.scaleOrdinal().domain(["0-499","500-1499","1500-3499","3500-4999","5000-6499","6500-9100"]))
          .xUnits(dc.units.ordinal)
          .brushOn(true)
          .yAxisLabel("Números de Áreas")
          .xAxisLabel("Índice de Saúde")
          .dimension(dimHealthArea)
          .group(weaponDimHealthArea);

  var chart11 = dc.barChart("#graph11");
    chart11.width(450)
          .height(200)
          .x(d3.scaleOrdinal().domain(["0-499","500-999","1000-1499","1500-2999","+3000"]))
          .xUnits(dc.units.ordinal)
          .brushOn(true)
          .yAxisLabel("Números de Áreas")
          .xAxisLabel("Índice de Rentabilidade")
          .dimension(dimRetailArea)
          .group(weaponDimRetailArea);
          //console.log(weaponDimLandUse.top(15));
  //console.log("3");


  

  var geoJsonLayer = L.geoJson({
    type: 'FeatureCollection',
    features: geomDimension.top(Infinity),
  },{
    filter: function(feature) {
        //debugger
        var zoom= mymap.getZoom();
        var a= mymap.getBounds();
        var Leste= a.getEast();
        var Oeste= a.getWest();
        var Norte= a.getNorth();
        var Sul=a.getSouth();
        switch(zoom){
          case 12:
            if(feature.properties.SHAPE_Area>6000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            //console.log(feature.properties.SHAPE_Area);
            return true;
          }
          break;
          case 13:
            if(feature.properties.SHAPE_Area>5000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            //console.log(feature.properties.SHAPE_Area);
            return true;
          }
          break;
          case 14:
            if(feature.properties.SHAPE_Area>4000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            //console.log(feature.properties.SHAPE_Area);
            return true;
          }
          break;
          case 15:
            if(feature.properties.SHAPE_Area>3000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            //console.log(feature.properties.SHAPE_Area);
            return true;
          }
          break;
          case 16:
            if(feature.properties.SHAPE_Area>2000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            //console.log(feature.properties.SHAPE_Area);
            return true;
          }
          break;
          case 17:
            if(feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            //console.log(feature.properties.SHAPE_Area);
            return true;
          }
          break;
        }/*
        if(zoom ==12){
          if(feature.properties.SHAPE_Area>6000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            //console.log(feature.properties.SHAPE_Area);
            return true;
          }
        }
        if(zoom >12 && zoom <15){
          if(feature.properties.SHAPE_Area>4000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte

            ){

            //console.log(feature.geometry.bbox[0]+" > "+b);
            return true;
          }
        }
        if(zoom >14 && zoom <18){
          if(feature.properties.SHAPE_Area>2000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte

            ){
            //console.log(feature.properties.SHAPE_Area);
            //console.log(feature.geometry.bbox[0]+" > "+b);
            return true;
          }
        }
        if(zoom ==18 && feature.geometry.bbox[0]<b){
          return true;
        }*/
        
    },
    style: function(feature){
      //console.log(feature.properties.LandUse);
      //console.log(color(feature.properties.LandUse));
      //console.log("style");
      return {
        weight: 2,
        opacity: 1,
        color: color(feature.properties.LandUse),
        
        fillOpacity: 0.9
      };
  },
  onEachFeature: function (feature, layer) {
        layer.bindPopup("Nome e Endereço do Proprietário: "+feature.properties.OwnerName+" CEP do Lote: "+feature.properties.ZipCode);
    }
}
  /*,{style: function(feature){
      //console.log(feature.properties.LandUse);
      //console.log(color(feature.properties.LandUse));
      console.log("style");
      return {
        weight: 2,
        opacity: 1,
        color: color(feature.properties.LandUse),
        
        fillOpacity: 0.9
      };
  }}*/).addTo(mymap);

  

  var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (mymap) {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = ["01","02","03","04","05","06","07","08","09","10","11",""],
        labels = ["01 ou 02 Familias","Multi Familias","+02 Familias c/Elevador",
              "Misto Residencial e Comercial", "Comercial e de Escritório",
              "Industrial", "Transportes e Utilidades", "Público ou Instituições",
              "Espaço aberto/recreação","Estacionamento","Desocupado","Não Informado"];

      for (var i = 0; i < grades.length; i++) {
          //console.log(color(grades[i]));
          div.innerHTML +='<i style="color:'+color(grades[i]) +'; background:' + color(grades[i]) + '"></i> ' +labels[i] +'</br>';
        }
      return div;
    };
    legend.addTo(mymap);

  var info = L.control();
  info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  };
  info.update = function (props) {
    this._div.innerHTML = '<h4>Edifícios de Manhattan</h4>' +  (props ?'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Tipo de Uso Atribuído');
  };
  info.addTo(mymap);

  function updateMap() {
    geoJsonLayer.clearLayers();
    //var a= mymap.getBounds();
    //var b= a.getCenter();
    
    geoJsonLayer.addData({
      type: 'FeatureCollection',
      features: geomDimension.top(Infinity)//colocar aqui função que pega o nível de zoom e atualiza.
    });
    //mymap.fitBounds(mymap.getBounds());
  }

  mymap.on('moveend', function() {
    updateMap();
  });

  chart.on('filtered', function(chart, filter) {
    updateMap();
  });
  chart2.on('filtered', function(chart, filter) {
    updateMap();
  });
  chart3.on('filtered', function(chart, filter) {
    updateMap();
  });
  /*
  chart4.on('filtered', function(chart, filter) {
    updateMap();
  });*/
  chart5.on('filtered', function(chart, filter) {
    updateMap();
  });
  chart6.on('filtered', function(chart, filter) {
    updateMap();
  });
  chart7.on('filtered', function(chart, filter) {
    updateMap();
  });/*
  chart8.on('filtered', function(chart, filter) {
    updateMap();
  });
  chart9.on('filtered', function(chart, filter) {
    updateMap();
  });*/
  chart10.on('filtered', function(chart, filter) {
    updateMap();
  });
  chart11.on('filtered', function(chart, filter) {
    updateMap();
  });
  dc.renderAll();
});      