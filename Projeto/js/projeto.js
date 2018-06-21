//Criação do mapa
var mymap = L.map('map').setView([40.773573,-73.9480237], 12);

//Escala de cores para o mapa
var color = d3.scaleOrdinal().domain(["01","02","03","04","05","06","07","08","09","10","11",""])
  .range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']);

//Renderização inicial do mapa e configurações.    
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 17,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiZWRjbGV5OTQ1MiIsImEiOiJjamdvMGdmZ2owaTdiMndwYTJyM2tteTl2In0.2q25nBNRxzFxeaYahFGQ6g'
  }).addTo(mymap);

//Variáveis. Agrupadas por Genéricas, Dimensões, Grupos das Dimensões, Variáveis dos Plots, e Variavéis oos Bounds do mapa.
var features,cf,geomDimension,geoJsonLayer,legend,info;
var dimFireComp,dimRetailArea,dimYearBuilt,dimYearAlter1,dimYearAlter2,dimSHAPE_Area,dimSHAPE_Leng,dimNumFloors,dimPolicePrct,dimSchoolDist,dimSanitDistr
,dimLandUse,dimHealthArea;
var weaponDimFireComp,weaponDimRetailArea,weaponDimYearBuilt,weaponDimYearAlter1,weaponDimYearAlter2,weaponDimSHAPE_Area,weaponDimSHAPE_Leng,weaponNumFloors
,weaponPolicePrct,weaponSchoolDist,weaponSanitDistr,weaponDimLandUse,weaponDimHealthArea;
var chart,chart2,chart3,chart4,chart5,chart6,chart7,chart8,chart9,chart10,chart11;
var zoom,a,Leste,Oeste,Norte,Sul;

//Função para converter um arquivo .zip que contém shape files em Geojson.
shp("http://localhost:8080/mn_mappluto_17v1_1.zip").then(function(geojson){
      
  features = geojson[1].features.slice(0,42638);
  cf = crossfilter(features);

  //Criação das Dimensões e Grupos com base no crossfilter.
  geomDimension = cf.dimension(function(d) {
    return d.geometry;
  });

  dimFireComp= cf.dimension(function(d){
    return d.properties.FireComp;
  }); 
  weaponDimFireComp= dimFireComp.group();

  dimRetailArea= cf.dimension(function(d){
    if(d.properties.RetailArea < 500) return '0-499';
    if(d.properties.RetailArea   >= 500 && d.properties.RetailArea   < 1000) return '500-999';
    if(d.properties.RetailArea   >= 1000 && d.properties.RetailArea   < 1500) return '1000-1499';
    if(d.properties.RetailArea   >= 1500 && d.properties.RetailArea   < 2999) return '1500-2999';
    if(d.properties.RetailArea   >= 3000 ) return '+3000';
  }); 
  weaponDimRetailArea= dimRetailArea.group();
  
  dimYearBuilt= cf.dimension(function(d){
    return d.properties.YearBuilt;
  }); 
  weaponDimYearBuilt= dimYearBuilt.group();
  
  dimYearAlter1= cf.dimension(function(d){
    return d.properties.YearAlter1;
  }); 
  weaponDimYearAlter1= dimYearAlter1.group();
  
  dimYearAlter2= cf.dimension(function(d){
    return d.properties.YearAlter2;
  }); 
  weaponDimYearAlter2= dimYearAlter2.group();
      
  dimSHAPE_Area= cf.dimension(function(d){
    if(d.properties.SHAPE_Area >= 0 && d.properties.SHAPE_Area < 499) return '0-499';
    if(d.properties.SHAPE_Area >= 500 && d.properties.SHAPE_Area < 4999) return '500-4999';
    if(d.properties.SHAPE_Area >= 5000 && d.properties.SHAPE_Area < 49999) return '5000-49999';
    if(d.properties.SHAPE_Area >= 50000 ) return '50000-4999999';
  });
  weaponDimSHAPE_Area= dimSHAPE_Area.group();
  //console.log(dimSHAPE_Area.top(1));
  dimSHAPE_Leng= cf.dimension(function(d){
    if(d.properties.SHAPE_Leng < 40){ return '0-40'}
    if(d.properties.SHAPE_Leng >= 40 && d.properties.SHAPE_Leng < 400) return '40-399';
    if(d.properties.SHAPE_Leng >= 400 && d.properties.SHAPE_Leng < 4000) return '400-3999';
    if(d.properties.SHAPE_Leng >= 4000) return '4000-36615';
  });
  
  weaponDimSHAPE_Leng= dimSHAPE_Leng.group();      

  dimNumFloors= cf.dimension(function(d){
    return d.properties.NumFloors;
  });

  weaponNumFloors= dimNumFloors.group();      

  dimPolicePrct= cf.dimension(function(d){
    return d.properties.PolicePrct;
  });
  weaponPolicePrct= dimPolicePrct.group();
  
  dimSchoolDist= cf.dimension(function(d){
    return d.properties.SchoolDist;
  });
  weaponSchoolDist= dimSchoolDist.group();      

  dimSanitDistr= cf.dimension(function(d){
    return d.properties.SanitDistr;
  });
  weaponSanitDistr= dimSanitDistr.group();

  dimLandUse= cf.dimension(function(d){
    return d.properties.LandUse;
  }); 
  weaponDimLandUse= dimLandUse.group().reduceCount();

  dimHealthArea= cf.dimension(function(d){
    if(d.properties.HealthArea < 500){ return '0-499'}
    if(d.properties.HealthArea  >= 500 && d.properties.HealthArea  < 1500) return '500-1499';
    if(d.properties.HealthArea  >= 1500 && d.properties.HealthArea  < 3500) return '1500-3499';
    if(d.properties.HealthArea  >= 3500 && d.properties.HealthArea  < 5000) return '3500-4999';
    if(d.properties.HealthArea  >= 5000 && d.properties.HealthArea  < 6500) return '5000-6499';
    if(d.properties.HealthArea  >= 6500) return '6500-9100';
  });
  weaponDimHealthArea= dimHealthArea.group();

  //Criação dos Plots de Visualização com Base dc.js
  chart = dc.barChart("#graph2").width(450)
          .height(200)
          .x(d3.scaleLinear().domain([1880,2000]))
          .brushOn(true)
          .yAxisLabel("Quantidade")
          .xAxisLabel("Ano")
          .dimension(dimYearBuilt)
          .group(weaponDimYearBuilt);

  chart2 = dc.barChart("#graph3").width(450)
          .height(200)
          .x(d3.scaleLinear().domain([1930,2017]))
          .brushOn(true)
          .yAxisLabel("Quantidade de Alterações")
          .xAxisLabel("Ano")
          .dimension(dimYearAlter1)
          .group(weaponDimYearAlter1);

  chart3 = dc.barChart("#graph4").width(450)
          .height(200)
          .x(d3.scaleLinear().domain([1930,2017]))
          .brushOn(true)
          .yAxisLabel("Quantidade de Alterações")
          .xAxisLabel("Ano")
          .dimension(dimYearAlter2)
          .group(weaponDimYearAlter2);
/*
  chart4 = dc.pieChart("#graph").width(200)
          .height(200)
          .slicesCap(15)
          .innerRadius(5)
          .dimension(dimFireComp)
          .group(weaponDimFireComp)
          .renderLabel(true);
*/
  chart5 = dc.barChart("#graph5").width(450)
          .height(200)
          .brushOn(true)
          .x(d3.scaleOrdinal().domain(["0-499","500-4999","5000-49999","50000-4999999"]))
          .xUnits(dc.units.ordinal)
          .yAxisLabel("Numero de Lotes")
          .xAxisLabel("Comprimento da Area em m2")
          .dimension(dimSHAPE_Area)
          .group(weaponDimSHAPE_Area);
          
  /*chart6 = dc.barChart("#graph6").width(450)
          .height(200)
          .x(d3.scaleOrdinal().domain(["0-40","40-399","400-3999","4000-36615"]))
          .xUnits(dc.units.ordinal)
          .brushOn(true)
          .yAxisLabel("Número de Lotes")
          .xAxisLabel("Comprimento da Forma")
          .dimension(dimSHAPE_Leng)
          .group(weaponDimSHAPE_Leng);*/
  
  chart7 = dc.barChart("#graph7").width(450)
          .height(200)
          .x(d3.scaleLinear().domain([1,50]))
          .brushOn(true)
          .yAxisLabel("Número de Lotes")
          .xAxisLabel("Número de Pisos")
          .dimension(dimNumFloors)
          .group(weaponNumFloors);       
  
  chart8 = dc.barChart("#graph8").width(450)
          .height(200)
          .x(d3.scaleLinear().domain([1,35]))
          .brushOn(true)
          .yAxisLabel("Áreas Atendidos")
          .xAxisLabel("Nº do Distrito Policial")
          .dimension(dimPolicePrct)
          .group(weaponPolicePrct);      

  chart9 = dc.barChart("#graph9").width(450)
          .height(200)
          .x(d3.scaleOrdinal().domain(["","01","02","03","04","05","06","10"]))
          .xUnits(dc.units.ordinal)
          .brushOn(true)
          .yAxisLabel("Nº de Áreas Atendidas")
          .xAxisLabel(" Nº da Escola Responsavel")
          .dimension(dimSchoolDist)
          .group(weaponSchoolDist);

  chart10 = dc.barChart("#graph10").width(450)
          .height(200)
          .x(d3.scaleOrdinal().domain(["0-499","500-1499","1500-3499","3500-4999","5000-6499","6500-9100"]))
          .xUnits(dc.units.ordinal)
          .brushOn(true)
          .yAxisLabel("Números de Áreas")
          .xAxisLabel("Índice de Saúde")
          .dimension(dimHealthArea)
          .group(weaponDimHealthArea);

  chart11 = dc.barChart("#graph11").width(450)
          .height(200)
          .x(d3.scaleOrdinal().domain(["0-499","500-999","1000-1499","1500-2999","+3000"]))
          .xUnits(dc.units.ordinal)
          .brushOn(true)
          .yAxisLabel("Números de Áreas")
          .xAxisLabel("Índice de Rentabilidade")
          .dimension(dimRetailArea)
          .group(weaponDimRetailArea);

  geoJsonLayer = L.geoJson({
    type: 'FeatureCollection',
    features: geomDimension.top(Infinity),
  },{
    filter: function(feature) {
        /*Este filtro delimita a área que será renderizada no mapa levando em consideração o zoom e os delimitadores dos polígonos.
        Com base na área de visualização atual do mapa é feita uma comparação se o polígono estiver dentro da área atual do mapa ele é renderizado.
        O zoom filtra os edifícios e lotes com uma área superior a um determinado valor. Quanto maior o zoom mais edifícios serão renderizados na tela
        de visualização tendo em vista que edíficios com áreas menores passam a ser renderizados quando mais se aproxima da área.
        */
        zoom= mymap.getZoom();a= mymap.getBounds();
        Leste= a.getEast();Oeste= a.getWest();Norte= a.getNorth();Sul=a.getSouth();

        switch(zoom){
          case 12:
            if(feature.properties.SHAPE_Area>6000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            return true;
          }
          break;
          case 13:
            if(feature.properties.SHAPE_Area>5000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            return true;
          }
          break;
          case 14:
            if(feature.properties.SHAPE_Area>4000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            return true;
          }
          break;
          case 15:
            if(feature.properties.SHAPE_Area>3000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            return true;
          }
          break;
          case 16:
            if(feature.properties.SHAPE_Area>2000 && feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            return true;
          }
          break;
          case 17:
            if(feature.geometry.bbox[0]>Oeste && feature.geometry.bbox[2]<Leste
              && feature.geometry.bbox[1]>Sul  && feature.geometry.bbox[1]<Norte){
            return true;
          }
          break;
        }
        
    },
    style: function(feature){
      //Style para definir configurações dos polígonos a serem desenhados e colorir com base na escala criada.
      return {
        weight: 2,
        opacity: 1,
        color: color(feature.properties.LandUse),
        fillOpacity: 0.9
      };
  },
  onEachFeature: function (feature, layer) {
        //Criação do Popup de cada feature/polígono contendo o nome do proprietário e o cep de localização do edíficio/lote.
        layer.bindPopup("Nome e Endereço do Proprietário: "+feature.properties.OwnerName+" CEP do Lote: "+feature.properties.ZipCode);
    }
}).addTo(mymap);

  // criação da div que contém a legenda do Mapa.
  legend = L.control({position: 'bottomright'});
    legend.onAdd = function (mymap) {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = ["01","02","03","04","05","06","07","08","09","10","11",""],
        labels = ["01 ou 02 Familias","Multi Familias","+02 Familias c/Elevador",
              "Misto Residencial e Comercial", "Comercial e de Escritório",
              "Industrial", "Transportes e Utilidades", "Público ou Instituições",
              "Espaço aberto/recreação","Estacionamento","Desocupado","Não Informado"];

      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +='<i style="color:'+color(grades[i]) +'; background:' + color(grades[i]) + '"></i> ' +labels[i] +'</br>';
        }
      return div;
    };
    legend.addTo(mymap);

  // criação da div que contém o Título e Subtítulo do Mapa.
  info = L.control();
  info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };
  info.update = function (props) {
    this._div.innerHTML = '<h4>Edifícios de Manhattan</h4>' +  (props ?'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Tipo de Uso Atribuído');
  };
  info.addTo(mymap);
  // Fim da criação da div que contém o Título e Subtítulo do Mapa.

  //Função que atualiza o mapa para nova visualização com base nos filtros aplicados seja de zoom, de área ou de seleção nos plots..
  function updateMap() {
    geoJsonLayer.clearLayers();
    geoJsonLayer.addData({
      type: 'FeatureCollection',
      features: geomDimension.top(Infinity)
    });
  }

  //Função para atualizar mapa caso ocorra alguma mudança no zoom ou na área de visualização do mapa
  mymap.on('moveend', function() {
    updateMap();
  });
  //Funções para atualizar o mapa caso alguma seleção nos plots ocorra.
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
  });/*
  chart6.on('filtered', function(chart, filter) {
    updateMap();
  });*/
  chart7.on('filtered', function(chart, filter) {
    updateMap();
  });
  chart8.on('filtered', function(chart, filter) {
    updateMap();
  });
  chart9.on('filtered', function(chart, filter) {
    updateMap();
  });
  chart10.on('filtered', function(chart, filter) {
    updateMap();
  });
  chart11.on('filtered', function(chart, filter) {
    updateMap();
  });
  //Renderização dos Plots do dc.js
  dc.renderAll();
});      