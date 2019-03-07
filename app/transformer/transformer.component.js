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
            voltaje: null,
            potenicaparente: null,
            potenciareactiva: null,
            potenciaactiva: null,
            corriente: null,
            factordepotencia: null,
            caballosdefuerza: null,
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
        $scope.motoresIds = [];
        for(var i = 1; i <= $scope.transformadores[transformadorId-1].numeromotores; i++){
          $scope.transformadores[transformadorId-1].motores.push({
            id: i,
            tipo: 3,
            voltaje: null,
            potenicaparente: null,
            potenciareactiva: null,
            potenciaactiva: null,
            corriente: null,
            factordepotencia: null,
            caballosdefuerza: null,
            correccion: true,
            conexionesExternas: []
          });
          $scope.motoresIds.push(i);
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
      
      $scope.actualizarConexionesMotor = function(transformadorId, motorId, motorExtId) {
        var indexLocal = $scope.transformadores[transformadorId-1].motores[motorId-1].conexionesExternas.indexOf(motorExtId);
        var indexExterno = $scope.transformadores[transformadorId-1].motores[motorExtId-1].conexionesExternas.indexOf(motorId);
        
        // Remover la conexión
        if (indexLocal > -1) {
          $scope.transformadores[transformadorId-1].motores[motorId-1].conexionesExternas.splice(indexLocal, 1);
          $scope.transformadores[transformadorId-1].motores[motorExtId-1].conexionesExternas.splice(indexExterno, 1);
        }
        // Agregar la conexión
        else {
          $scope.transformadores[transformadorId-1].motores[motorId-1].conexionesExternas.push(motorExtId);
          $scope.transformadores[transformadorId-1].motores[motorExtId-1].conexionesExternas.push(motorId);
        }
      };

      $scope.show=function(){
        console.log($scope.datosgenerador);
        console.log($scope.transformadores);
      }
    }
  });
