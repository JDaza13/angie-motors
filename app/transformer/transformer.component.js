'use strict';

angular.
  module('angieMotors').
  component('transformer', {
    templateUrl: 'transformer/transformer.template.html',
    controller: function TransformerController($scope) {
     
      $scope.numTransformadores = 0;
      $scope.transformadores=[];

      $scope.updateTransformadores = function() {
        $scope.transformadores=[];
        for(var i = 1; i <= $scope.numTransformadores; i++){
          $scope.transformadores.push({
            id: i,
            tipo: "3",
            voltaje: 0,
            potenicaparente:0,
            potenciareactiva:0,
            potenciaactiva:0,
            corriente:0,
            factordepotencia:0,
            caballosdefuerza:0,
            correccion: "true",
            conexionesExternas: [],
            motores: []
          });
        }
      };

      $scope.datosgenerador={
        voltajeprimario: 323,
        voltajesecundario: 443
      };

      $scope.traconect={
        cantidadtransconectado: 323
      };

      $scope.datosmotor={
        voltaje: 0,
        potenicaparente:0,
        potenciareactiva:0,
        potenciaactiva:0,
        corriente:0,
        factordepotencia:0,
        caballosdefuerza:0
      };

      $scope.show=function(){
        console.log($scope.datosgenerador);
        console.log($scope.transformadores);
      }
    }
  });
