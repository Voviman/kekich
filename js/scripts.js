let tab = function() {
    let tabNav = document.querySelectorAll(
        '.tabs-nav__item'),
        tabContent = document.querySelectorAll('.tab'),
        tabName;

    tabNav.forEach(item => {
        item.addEventListener('click', selectTabNav)
    });

    function selectTabNav() {
        tabNav.forEach(item => {
            item.classList.remove('is-active')
        });
        console.log(this);
        this.classList.add('is-active');
        tabName = this.getAttribute('data-tab-name');
        console.log(tabName);
        selectTabContent(tabName);
    }
     
    function selectTabContent(tabName) {
        tabContent.forEach(item => {
            item.classList.contains(tabName)? item.classList.add('is-active'):
            item.classList.remove('is-active');
        })
    }

};

tab();


'use strict';
    var multiItemSlider = (function () {
      return function (selector, config) {
        var
          _mainElement = document.querySelector(selector), 
          _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), 
          _sliderItems = _mainElement.querySelectorAll('.slider__item'), 
          _sliderControls = _mainElement.querySelectorAll('.slider__control'), 
          _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), 
          _sliderControlRight = _mainElement.querySelector('.slider__control_right'), 
          _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), 
          _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), 
          _positionLeftItem = 0, 
          _transform = 0, 
          _step = _itemWidth / _wrapperWidth * 100, 
          _items = [], 
          _interval = 0,
          _config = {
            isCycling: false,
            direction: 'right', 
            interval: 5000, 
            pause: true 
          };

        for (var key in config) {
          if (key in _config) {
            _config[key] = config[key];
          }
        }

        
        _sliderItems.forEach(function (item, index) {
          _items.push({ item: item, position: index, transform: 0 });
        });

        var position = {
          getItemMin: function () {
            var indexItem = 0;
            _items.forEach(function (item, index) {
              if (item.position < _items[indexItem].position) {
                indexItem = index;
              }
            });
            return indexItem;
          },
          getItemMax: function () {
            var indexItem = 0;
            _items.forEach(function (item, index) {
              if (item.position > _items[indexItem].position) {
                indexItem = index;
              }
            });
            return indexItem;
          },
          getMin: function () {
            return _items[position.getItemMin()].position;
          },
          getMax: function () {
            return _items[position.getItemMax()].position;
          }
        }

        var _transformItem = function (direction) {
          var nextItem;
          if (direction === 'right') {
            _positionLeftItem++;
            if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
              nextItem = position.getItemMin();
              _items[nextItem].position = position.getMax() + 1;
              _items[nextItem].transform += _items.length * 100;
              _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
            }
            _transform -= _step;
          }
          if (direction === 'left') {
            _positionLeftItem--;
            if (_positionLeftItem < position.getMin()) {
              nextItem = position.getItemMax();
              _items[nextItem].position = position.getMin() - 1;
              _items[nextItem].transform -= _items.length * 100;
              _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
            }
            _transform += _step;
          }
          _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        }

        var _cycle = function (direction) {
          if (!_config.isCycling) {
            return;
          }
          _interval = setInterval(function () {
            _transformItem(direction);
          }, _config.interval);
        }

  
        var _controlClick = function (e) {
          if (e.target.classList.contains('slider__control')) {
            e.preventDefault();
            var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
            _transformItem(direction);
            clearInterval(_interval);
            _cycle(_config.direction);
          }
        };

        var _setUpListeners = function () {
         
          _sliderControls.forEach(function (item) {
            item.addEventListener('click', _controlClick);
          });
          if (_config.pause && _config.isCycling) {
            _mainElement.addEventListener('mouseenter', function () {
              clearInterval(_interval);
            });
            _mainElement.addEventListener('mouseleave', function () {
              clearInterval(_interval);
              _cycle(_config.direction);
            });
          }
        }

     
        _setUpListeners();
        _cycle(_config.direction);

        return {
          right: function () { 
            _transformItem('right');
          },
          left: function () { 
            _transformItem('left');
          },
          stop: function () { 
            _config.isCycling = false;
            clearInterval(_interval);
          },
          cycle: function () { 
            _config.isCycling = true;
            clearInterval(_interval);
            _cycle();
          }
        }

      }
    }());

    var slider = multiItemSlider('.slider', {
      isCycling: true
    })