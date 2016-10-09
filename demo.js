Table = new Mongo.Collection('table');

if (Meteor.isClient) {
  angular.module('simple-meteor-angular-crud',['angular-meteor']);
  var onReady = function() { angular.bootstrap(document, ['simple-meteor-angular-crud']); };
  if (Meteor.isCordova) { 
    angular.element(document).on('deviceready', onReady); 
  } else {
    angular.element(document).ready(onReady);
  }
  angular.module('simple-meteor-angular-crud').controller('CrudCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {
      $scope.$meteorSubscribe('table');
      $scope.table = $meteor.collection(function() { return Table.find($scope.getReactively('query'), {}) });
      $scope.createRecord = function (newRecord) {
        $meteor.call('createRecord', newRecord);
      };
      $scope.readRecord = function () {
        return Table.find({}).count();
      };
      $scope.updateRecord = function (record) {
        $meteor.call('updateRecord', record._id, !record.checked);
      };
      $scope.deleteRecord = function (record) {
        $meteor.call('deleteRecord', record._id);
      };
      $scope.$watch('hideCompleted', function() { $scope.query = {}; });
    }]);
}

Meteor.methods({
  createRecord: function (text) {
    Table.insert({text: text});
  },
  updateRecord: function (recordId, setChecked) {
    Table.update(recordId, { $set: { checked: setChecked} });
  },
  deleteRecord: function (recordId) {
    Table.remove(recordId);
  }
});

if (Meteor.isServer) {
  Meteor.publish('table', function () {
    return Table.find({});
  });
}