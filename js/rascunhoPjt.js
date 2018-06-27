
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
        }


        ,{style: function(feature){
      //console.log(feature.properties.LandUse);
      //console.log(color(feature.properties.LandUse));
      console.log("style");
      return {
        weight: 2,
        opacity: 1,
        color: color(feature.properties.LandUse),
        
        fillOpacity: 0.9
      };
  }}