var CardLayout;

(function() {
    'use strict';

    var _elemContainer,
        _elemCardList,
        _cardWidthUnit,
        _cardWidth,
        _gapColumn,
        _gapRow,

        _cardNumPerRow,
        _transitionDelay,
        _timeout;

    CardLayout = {
        'init':function(options) {
            if(options === undefined) {
                throw 'Option not defined';
            } else if (!('container' in options && 'card' in options && 'width' in options)) {
                throw 'There is a missing option.'
            }

            var containerClassName = options.container,
                cardClassName = options.card,
                cardWidthData = options.width,
                cardCssStyle;

            if(cardWidthData.indexOf('px') !== -1) {
                _cardWidth = parseInt(cardWidthData.substr(0, cardWidthData.indexOf('px')), 10);
                _cardWidthUnit = 'px';
            } // TODO : % width

            _transitionDelay = options.transDelay || 400;
            _elemContainer = document.getElementsByClassName(containerClassName)[0];
            _elemCardList = document.getElementsByClassName(cardClassName);

            _cardNumPerRow = getCardNumPerRow(_elemContainer.offsetWidth, _cardWidth);
            cardCssStyle = getCssStyle(_elemCardList[0]);

            _gapColumn = parseInt(cardCssStyle.marginLeft.substr(0, cardCssStyle.marginLeft.indexOf('px')), 10);
            _gapRow = parseInt(cardCssStyle.marginLeft.substr(0, cardCssStyle.marginBottom.indexOf('px')), 10);

            window.addEventListener('resize', function() {
                var changedCardNumPerRow = getCardNumPerRow(_elemContainer.offsetWidth, _cardWidth);

                if(changedCardNumPerRow !== _cardNumPerRow) {
                    if(_timeout === undefined) {
                        _timeout = setTimeout(function() {
                            changedCardNumPerRow = getCardNumPerRow(_elemContainer.offsetWidth, _cardWidth);

                            if(changedCardNumPerRow !== _cardNumPerRow) {
                                _cardNumPerRow = changedCardNumPerRow;
                                alignCardsOnResize();
                                _timeout = undefined;
                            }
                        }, 200);
                    }
                }
            });

            alignCards();
        }
    };

    function alignCards() {
        var elemCard,
            changedLeftVal, changedTopVal,
            changedColumn;

        for(var i = 0; i < _elemCardList.length; i++) {
            elemCard = _elemCardList[i];
            // elemCss = getCssStyle(elemCard);

            if(i >= _cardNumPerRow) {
                changedTopVal = _gapRow + _elemCardList[i - _cardNumPerRow].offsetTop + _elemCardList[i - _cardNumPerRow].offsetHeight;
            } else {
                changedTopVal = 0;
            }

            changedColumn = i % _cardNumPerRow;
            changedLeftVal = (changedColumn * _gapColumn) + (changedColumn * _cardWidth);

            elemCard.style.position = 'absolute';
            elemCard.style.width = _cardWidth + _cardWidthUnit;
            elemCard.style.left = changedLeftVal + _cardWidthUnit;
            elemCard.style.top = changedTopVal + _cardWidthUnit;
        }
    }

    function alignCardsOnResize() {
        var changedPosList = [],
            elemCard, elemCss,
            beforeLeftVal, beforeTopVal,
            changedLeftVal, changedTopVal,
            changedColumn,
            translateX, translateY;

        changedPosList.push([0, 0]);

        for(var i = 1; i < _elemCardList.length; i++) {
            elemCard = _elemCardList[i];
            elemCss = getCssStyle(elemCard);

            beforeLeftVal = parseInt(elemCss.left, 10);
            beforeTopVal = parseInt(elemCss.top, 10);

            if(i >= _cardNumPerRow) {
                changedTopVal = _gapRow + changedPosList[i - _cardNumPerRow][0] + _elemCardList[i - _cardNumPerRow].offsetHeight;
            } else {
                changedTopVal = 0;
            }

            changedColumn = i % _cardNumPerRow;
            changedLeftVal = (changedColumn * _gapColumn) + (changedColumn * _cardWidth);

            changedPosList.push([changedTopVal, changedLeftVal]);

            translateX = changedLeftVal - beforeLeftVal;
            translateY = changedTopVal - beforeTopVal;

            if(translateX !== 0 || translateY !== 0) {
                elemCard.style.transitionProperty = 'transform';
                elemCard.style.transitionDuration = '0.4s';
                elemCard.style.transform = 'translate(' + translateX + 'px' + ',' + translateY + 'px' + ')';

                (function () {
                    var tempElemCard = elemCard,
                        tempChangedLeftVal = changedLeftVal,
                        tempChangedTopVal = changedTopVal;

                    setTimeout(function () {
                        tempElemCard.style.transitionProperty = tempElemCard.style.transitionDuration = tempElemCard.style.transform = '';
                        tempElemCard.style.left = tempChangedLeftVal + 'px';
                        tempElemCard.style.top = tempChangedTopVal + 'px';
                    }, 400)
                }());
            }
        }
    }

    function getCssStyle(elem) {
        return elem.currentStyle || window.getComputedStyle(elem);
    }

    function getCardNumPerRow(conWidth, width) {
        var num = parseInt(conWidth/(width), 10);

        return num < 1 ? 1 : num;
    }

}());
