

var APP = angular.module('APP', ['ngMaterial']);

APP.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue')
    .accentPalette('blue');
});

/**************************************
* CONTROLLERS
**************************************/

APP.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $mdUtil, $log) {
    
    /**************************************
    * Section Meta Data
    **************************************/
    
    $scope.loading = true;
    $scope.views = [
        {
            name:'IAT 235',
            dir:'course',
            sections:[
                {
                    name:'Course Info',
                    fn:'syllabus.html'
                },
                {
                    name:'Office Hours',
                    fn:'office-hours.html',
                    skipReveal:true
                },
                {
                    name:'Readings',
                    fn:'readings.html',
                    skipReveal:true
                },
                {
                    name:'Tools',
                    fn:'tools.html',
                    skipReveal:true
                },
                {
                    name:'Quizzes',
                    fn:'quizzes.html',
                    skipReveal:true
                },
                {
                    name:'Calendar',
                    fn:'calendar.html',
                    src:'<div class="content"><iframe src="https://www.google.com/calendar/embed?src=2n13sio8jc7vd2eolu88k956ns%40group.calendar.google.com&ctz=America/Vancouver" style="border: 0" width="100%" height="600" frameborder="0" scrolling="no"></iframe></div>',
                    skipReveal:true
                }
            ]
        },
        {
            name:'Lectures',
            dir:'lectures',
            sections:[
                {
                    name:'01: What is Information?',
                    fn:'lecture-1.html'
                },
                {
                    name:'02: Context vs. Content',
                    fn:'lecture-2.html'
                },
                {
                    name:'03: Information Architecture',
                    fn:'lecture-3.html'
                },
                {
                    name:'04: Wireframes and Web',
                    fn:'lecture-4.html'
                }
            ]
        },
        {
            name:'Labs',
            dir:'labs',
            sections:[
                {
                    name:'Lab 01',
                    fn:'lab-1.html'
                },
                {
                    name:'Lab 02',
                    fn:'lab-2.html'
                },
                {
                    name:'Lab 03',
                    fn:'lab-3.html'
                }
            ]
        },
        {
            name:'Assignments',
            dir:'assignments',
            sections:[
                {
                    name:'Assignment 1',
                    fn:'assignment-1.html',
                    skipReveal:true
                },
                {
                    name:'Assignment 2',
                    fn:'assignment-2.html',
                    skipReveal:true
                }
            ]
        },
        {
            name:'Projects',
            dir:'projects',
            sections:[
                {
                    name:'Project 1: Scope',
                    fn:'project-1.html',
                    skipReveal:true
                },
                {
                    name:'Project 2: Wireframing',
                    fn:'project-2.html',
                    skipReveal:true
                }
            ]
        }
    ];
    
    //section loading
    $scope.loadSection = function(viewname, index) {
        $scope.loading = true;
        var done = function() {
            $scope.toggleLeft();
            if (!$scope.$$phase) $scope.$apply();
            setTimeout(function() {
                if (!section.skipReveal) APP.initReveal();
                $scope.loading = false;
                if (!$scope.$$phase) $scope.$apply();
                APP.resize();
            }, 100);
        };
        for (var i = 0; i < $scope.views.length; i++)
            if ($scope.views[i].name == viewname) break;
        var section = $scope.currentSection = $scope.views[i].sections[index];
        if (!section.src) {
            APP.load($scope.views[i].dir + '/' + section.fn, function(res) {
                section.src = res;
                done();
            });
        } else {
            done();
        }
    };
    
    $scope.fullscreen = false;
    $scope.toggleFullscreen = function() {
        if ($scope.fullscreen) document.webkitExitFullscreen();
        else document.documentElement.webkitRequestFullscreen();
        $scope.fullscreen = !$scope.fullscreen;
    };
    //menu toggle
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function() {
            $mdSidenav(navID).toggle();
      }, 300);
      return debounceFn;
    }
    //load section and open menu
    $scope.loadSection('IAT 235', 0);
    $scope.toggleLeft();
});

APP.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
});
  
APP.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
});

/**************************************
* Helpers
**************************************/

APP.filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);

APP.load = function(fn, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fn, true);
    xhr.responseType = 'text';
    xhr.onload = function(e) {
        if (this.status != 200) return;
        callback(this.response);
    };
    xhr.send();
};

APP.resize = function() {
    var section = document.querySelectorAll('.content-section')[0];
    section.style.height = (window.innerHeight-48) + 'px';
};
window.onresize = APP.resize;

APP.initReveal = function() {
    
    APP.resize();
    
    Reveal.initialize({
        // Display controls in the bottom right corner
        controls: true,
        // Display a presentation progress bar
        progress: false,
        // Display the page number of the current slide
        slideNumber: false,
        // Push each slide change to the browser history
        history: true,
        // Enable keyboard shortcuts for navigation
        keyboard: true,
        // Enable the slide overview mode
        overview: true,
        // Vertical centering of slides
        center: true,
        // Enables touch navigation on devices with touch input
        touch: true,
        // Loop the presentation
        loop: false,
        // Change the presentation direction to be RTL
        rtl: false,
        // Turns fragments on and off globally
        fragments: true,
        // Flags if the presentation is running in an embedded mode,
        // i.e. contained within a limited portion of the screen
        embedded: false,
        // Flags if we should show a help overlay when the questionmark
        // key is pressed
        help: true,
        // Number of milliseconds between automatically proceeding to the
        // next slide, disabled when set to 0, this value can be overwritten
        // by using a data-autoslide attribute on your slides
        autoSlide: 0,
        // Stop auto-sliding after user input
        autoSlideStoppable: true,
        // Enable slide navigation via mouse wheel
        mouseWheel: false,
        // Hides the address bar on mobile devices
        hideAddressBar: false,
        // Opens links in an iframe preview overlay
        previewLinks: false,
        // Transition style
        transition: 'slide', // none/fade/slide/convex/concave/zoom
        // Transition speed
        transitionSpeed: 'fast', // default/fast/slow
        // Transition style for full page slide backgrounds
        backgroundTransition: 'slide', // none/fade/slide/convex/concave/zoom
        // Number of slides away from the current that are visible
        viewDistance: 3,
        // Parallax background image
        parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
        // Parallax background size
        parallaxBackgroundSize: '' // CSS syntax, e.g. "2100px 900px"
    });
    
    Reveal.slide(0, 0);
};