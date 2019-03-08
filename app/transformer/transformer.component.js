'use strict';

angular.
  module('angieMotors').
  component('transformer', {
    templateUrl: 'transformer/transformer.template.html',
    controller: function TransformerController($scope) {
      
      $scope.configConexion = {
        mono: 1,
        bi: 2,
        tri: 3
      }
      
      $scope.transformadoresIds = [];
      
      $scope.datosgenerador={
        voltajeprimario: 440,
        voltajesecundario: 110
      };
     
      $scope.numTransformadores = 0;
      $scope.transformadores=[];

      $scope.updateTransformadores = function() {
        $scope.transformadores=[];
        $scope.transformadoresIds = [];
        for(var i = 1; i <= $scope.numTransformadores; i++){
          $scope.transformadores.push({
            id: i,
            tipo: 3,
            voltajeprimario: 13200,
            voltajesecundario: 220,
            potenciaaparente: null,
            potenciareactivasecundaria: null,
            potenciareactivaprimaria: null,
            potenciaactivasecundaria: null,
            potenciaactivaprimaria: null,
            corrienteprimaria: null,
            corrientesecundaria: null,
            factordepotencia: 0.9,            
            correccion: true,
            conexionesExternas: [],
            numeromotores: 0,
            motores: []
          });
          $scope.transformadoresIds.push(i);
        }
      };
      
      $scope.updatemotores = function(transformadorId) {
        $scope.transformadores[transformadorId-1].motores=[];        
        for(var i = 1; i <= $scope.transformadores[transformadorId-1].numeromotores; i++){
          $scope.transformadores[transformadorId-1].motores.push({
            id: i,
            tipo: 3,
            voltaje: $scope.transformadores[transformadorId-1].voltajesecundario,
            potenciaaparente: null,
            potenciareactiva: null,
            potenciaactiva: null,
            corriente: null,
            factordepotencia: null,
            caballosdefuerza: null,
            correccion: true            
          });          
        }
      }; 

      
      $scope.actualizarConexionesTransformador = function(transformadorId, transformadorExtId) {
        var indexLocal = $scope.transformadores[transformadorId-1].conexionesExternas.indexOf(transformadorExtId);
        var indexExterno = $scope.transformadores[transformadorExtId-1].conexionesExternas.indexOf(transformadorId);
        
        // Remover la conexión
        if (indexLocal > -1) {
          $scope.transformadores[transformadorId-1].conexionesExternas.splice(indexLocal, 1);
          $scope.transformadores[transformadorExtId-1].conexionesExternas.splice(indexExterno, 1);
        }
        // Agregar la conexión
        else {
          $scope.transformadores[transformadorId-1].conexionesExternas.push(transformadorExtId);
          $scope.transformadores[transformadorExtId-1].conexionesExternas.push(transformadorId);
        }
      };     

      //Fill al transformer fields if all motors have data
      $scope.calcularValoresTransformador = function(transformadorId) {
        var currentTransformer = $scope.transformadores[transformadorId-1];
        var allowCalculate = true;
        
        for(var i = 0; i < currentTransformer.motores.length; i++){
          var currentMotor = currentTransformer.motores[i];
          if(!currentMotor.factordepotencia || !currentMotor.corriente ||
            !currentMotor.potenciaaparente || !currentMotor.potenciaactiva || !currentMotor.potenciareactiva){
              
            allowCalculate = false;
            alert("Motor " + (i+1) + " no tiene datos completos!");
            break;
          }
        }
        
        if(allowCalculate){
          var sumPotenciasActivas = 0;
          var sumPotenciasReactivas = 0;
          var sumPotenciasAparentes = 0;
          for(var i = 0; i < currentTransformer.motores.length; i++){

            var currentMotor = currentTransformer.motores[i];
            sumPotenciasActivas += currentMotor.potenciaactiva;
            sumPotenciasReactivas += currentMotor.potenciareactiva;
            sumPotenciasAparentes += currentMotor.potenciaaparente;
          }
          currentTransformer.potenciaactivasecundaria = sumPotenciasActivas;
          currentTransformer.potenciareactivasecundaria = sumPotenciasReactivas;
          currentTransformer.potenciaaparente = sumPotenciasAparentes;
          
          switch(currentTransformer.tipo){
            case 1: currentTransformer.corrienteprimaria = currentTransformer.potenciaaparente / ((currentTransformer.voltajeprimario)* currentTransformer.factordepotencia);
              currentTransformer.corrientesecundaria = currentTransformer.potenciaaparente / ((currentTransformer.voltajesecundario)* currentTransformer.factordepotencia);
              currentTransformer.potenciareactivaprimaria = currentTransformer.voltajeprimario * currentTransformer.corrienteprimaria*Math.sin(Math.acos(currentMotor.factordepotencia));
              currentTransformer.potenciaactivaprimaria = currentTransformer.voltajeprimario*currentTransformer.corrienteprimaria;
              break;
            case 2: currentTransformer.corrienteprimaria = currentTransformer.potenciaaparente / ((currentTransformer.voltajeprimario/2)* currentTransformer.factordepotencia);
              currentTransformer.corrientesecundaria = currentTransformer.potenciaaparente / ((currentTransformer.voltajesecundario/2)* currentTransformer.factordepotencia);
              currentTransformer.potenciareactivaprimaria = (currentTransformer.voltajeprimario/2) * currentTransformer.corrienteprimaria*Math.sin(Math.acos(currentMotor.factordepotencia));
              currentTransformer.potenciaactivaprimaria = (currentTransformer.voltajeprimario/2)*currentTransformer.corrienteprimaria;
              break;
            case 3: currentTransformer.corrienteprimaria = currentTransformer.potenciaaparente / ((currentTransformer.voltajeprimario/2)* currentTransformer.factordepotencia*Math.pow(3, 1/2));
              currentTransformer.corrientesecundaria = currentTransformer.potenciaaparente / ((currentTransformer.voltajesecundario/2)* currentTransformer.factordepotencia*Math.pow(3, 1/2));
              currentTransformer.potenciareactivaprimaria = (currentTransformer.voltajeprimario/2) * currentTransformer.corrienteprimaria*Math.sin(Math.acos(currentMotor.factordepotencia))*Math.pow(3, 1/2);
              currentTransformer.potenciaactivaprimaria = (currentTransformer.voltajeprimario/2)*currentTransformer.corrienteprimaria*Math.pow(3, 1/2);
              break;
          }
        }
      };

      $scope.calcularValoresMotor = function(transformadorId, motorId){
        var currentMotor = $scope.transformadores[transformadorId-1].motores[motorId-1];
        //corriente (voltaje,potencia activa o potencia aparente o potencia reactiva)
        if(currentMotor.potenciaaparente > 0) {
          switch(currentMotor.tipo){
            case 1: currentMotor.corriente = currentMotor.potenciaaparente / ((currentMotor.voltaje)* currentMotor.factordepotencia);
              currentMotor.potenciareactiva = ((currentMotor.voltaje)* currentMotor.corriente* Math.sin(Math.acos(currentMotor.factordepotencia)));
              currentMotor.potenciaactiva = ((currentMotor.voltaje)* currentMotor.corriente); 
              break;
            case 2: currentMotor.corriente = currentMotor.potenciaaparente / ((currentMotor.voltaje/2) * currentMotor.factordepotencia);
              currentMotor.potenciareactiva = ((currentMotor.voltaje/2)* currentMotor.corriente* Math.sin(Math.acos(currentMotor.factordepotencia)));
              currentMotor.potenciaactiva = ((currentMotor.voltaje/2)* currentMotor.corriente); 
              
              break;
            case 3: currentMotor.corriente = currentMotor.potenciaaparente / ( (currentMotor.voltaje/2) * currentMotor.factordepotencia *Math.pow(3, 1/2));
               currentMotor.potenciareactiva = ((currentMotor.voltaje/2)* currentMotor.corriente* Math.sin(Math.acos(currentMotor.factordepotencia))*Math.pow(3, 1/2));
              currentMotor.potenciaactiva = ((currentMotor.voltaje/2)* currentMotor.corriente*Math.pow(3, 1/2)); 
              break;
          }       
        }
        else if(currentMotor.potenciareactiva > 0) {
          switch(currentMotor.tipo){
            case 1: currentMotor.corriente = currentMotor.potenciareactiva / ((currentMotor.voltaje)* Math.sin(Math.acos(currentMotor.factordepotencia)));
              currentMotor.potenciaactiva = ((currentMotor.voltaje)* currentMotor.corriente);
              currentMotor.potenciaaparente = ((currentMotor.voltaje)* currentMotor.corriente* currentMotor.factordepotencia);
              break;
            case 2: currentMotor.corriente = currentMotor.potenciareactiva / ((currentMotor.voltaje/2)* Math.sin(Math.acos(currentMotor.factordepotencia)));
             currentMotor.potenciaactiva = ((currentMotor.voltaje/2)* currentMotor.corriente);
              currentMotor.potenciaaparente = ((currentMotor.voltaje/2)* currentMotor.corriente* currentMotor.factordepotencia);
             break;
            case 3: currentMotor.corriente = currentMotor.potenciareactiva / ( (currentMotor.voltaje/2) * Math.sin(Math.acos(currentMotor.factordepotencia)) *Math.pow(3, 1/2));
              currentMotor.potenciaactiva = ((currentMotor.voltaje/2)* currentMotor.corriente*Math.pow(3, 1/2));
              currentMotor.potenciaaparente = ((currentMotor.voltaje/2)* currentMotor.corriente* currentMotor.factordepotencia);
              break;
          }
        }
        //potenciaaparente y potencia reactiva y activa
        else if(currentMotor.corriente > 0) {
          switch(currentMotor.tipo){
            case 1: currentMotor.potenciaaparente = ((currentMotor.voltaje)* currentMotor.corriente* currentMotor.factordepotencia);
              currentMotor.potenciareactiva = ((currentMotor.voltaje)* currentMotor.corriente* Math.sin(Math.acos(currentMotor.factordepotencia)));
              currentMotor.potenciaactiva = ((currentMotor.voltaje)* currentMotor.corriente);              
              break;
            case 2: currentMotor.potenciaaparente = ((currentMotor.voltaje/2)* currentMotor.corriente* currentMotor.factordepotencia);
              currentMotor.potenciareactiva = ((currentMotor.voltaje/2)* currentMotor.corriente* Math.sin(Math.acos(currentMotor.factordepotencia)));
              currentMotor.potenciaactiva = ((currentMotor.voltaje/2)* currentMotor.corriente);
              break;
            case 3: currentMotor.potenciaaparente = ((currentMotor.voltaje/2)* currentMotor.corriente* currentMotor.factordepotencia*Math.pow(3, 1/2));
              currentMotor.potenciareactiva = ((currentMotor.voltaje/2)* currentMotor.corriente* Math.sin(Math.acos(currentMotor.factordepotencia))*Math.pow(3, 1/2));
              currentMotor.potenciaactiva = ((currentMotor.voltaje/2)* currentMotor.corriente*Math.pow(3, 1/2));
              break;            
          }       
        }
      };

      $scope.show=function(){
        console.log($scope.datosgenerador);
        console.log($scope.transformadores);
      };
    }
  });