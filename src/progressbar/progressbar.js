angular.module('ui.bootstrap.progressbar', [])

.constant('progressConfig', {
  animate: true,
  max: 100
})

.value('$progressSuppressWarning', false)

.controller('ProgressController', ['$scope', '$attrs', 'progressConfig', function($scope, $attrs, progressConfig) {
  var self = this,
      animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

  this.bars = [];
  $scope.max = angular.isDefined($scope.max) ? $scope.max : progressConfig.max;

  this.addBar = function(bar, element) {
    if (!animate) {
      element.css({'transition': 'none'});
    }

    this.bars.push(bar);

    bar.max = $scope.max;

    bar.$watch('value', function(value) {
      bar.recalculatePercentage();
    });

    bar.recalculatePercentage = function() {
      bar.percent = +(100 * bar.value / bar.max).toFixed(2);

      var totalPercentage = self.bars.reduce(function(total, bar) {
        return total + bar.percent;
      }, 0);

      if (totalPercentage > 100) {
        bar.percent -= totalPercentage - 100;
      }
    };

    bar.$on('$destroy', function() {
      element = null;
      self.removeBar(bar);
    });
  };

  this.removeBar = function(bar) {
      this.bars.splice(this.bars.indexOf(bar), 1);
  };

  $scope.$watch('max', function(max) {
    self.bars.forEach(function(bar) {
      bar.max = $scope.max;
      bar.recalculatePercentage();
    });
  });
}])

.directive('uibProgress', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    controller: 'ProgressController',
    require: 'uibProgress',
    scope: {
      max: '=?'
    },
    template:  "<div class=\"progress\" ng-transclude></div>"
  };
})

.directive('progress', ['$log', '$progressSuppressWarning', function($log, $progressSuppressWarning) {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    controller: 'ProgressController',
    require: 'progress',
    scope: {
      max: '=?'
    },
    template:  "<div class=\"progress\" ng-transclude></div>",
    link: function() {
      if ($progressSuppressWarning) {
        $log.warn('progress is now deprecated. Use uib-progress instead');
      }
    }
  };
}])

.directive('uibBar', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    require: '^uibProgress',
    scope: {
      value: '=',
      type: '@'
    },
    template: "<div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" style=\"min-width: 0;\" ng-transclude></div>\n" +
    "",
    link: function(scope, element, attrs, progressCtrl) {
      progressCtrl.addBar(scope, element);
    }
  };
})

.directive('bar', ['$log', '$progressSuppressWarning', function($log, $progressSuppressWarning) {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    require: '^progress',
    scope: {
      value: '=',
      type: '@'
    },
    template: "<div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" style=\"min-width: 0;\" ng-transclude></div>\n" +
    "",
    link: function(scope, element, attrs, progressCtrl) {
      if ($progressSuppressWarning) {
        $log.warn('bar is now deprecated. Use uib-bar instead');
      }
      progressCtrl.addBar(scope, element);
    }
  };
}])

.directive('progressbar', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    controller: 'ProgressController',
    scope: {
      value: '=',
      max: '=?',
      type: '@'
    },
    template: "<div class=\"progress\">\n" +
    "  <div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" style=\"min-width: 0;\" ng-transclude></div>\n" +
    "</div>\n" +
    "",
    link: function(scope, element, attrs, progressCtrl) {
      progressCtrl.addBar(scope, angular.element(element.children()[0]));
    }
  };
});
