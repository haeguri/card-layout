'use strict';

var elemCardList = document.getElementsByClassName('card');
var elemCardContainer = document.getElementsByClassName('card-container')[0];

var cardSet = {
    'width':'300px',
    // 'isAligning':false
    'alignSTime':0,
    'alignETime':0
};

if(cardSet.width.indexOf('px') !== -1 ) {
    cardSet._width = parseInt(cardSet.width.substr(0, cardSet.width.indexOf('px')), 10);
    cardSet._unit = 'px';
} else {
    console.log('잘못된 세팅.');
}

var cardNumPerRow = getCardNumPerRow(elemCardContainer.offsetWidth, cardSet._width);
var elemCardCss = getCssStyle(elemCardList[0]);
var marginLeft = parseInt(elemCardCss.marginLeft.substr(0, elemCardCss.marginLeft.indexOf('px')), 10);
var marginBottom = parseInt(elemCardCss.marginBottom.substr(0, elemCardCss.marginBottom.indexOf('px')), 10);


var _timeout;

window.addEventListener("resize", function() {
    var changedCardNumPerRow = getCardNumPerRow(elemCardContainer.offsetWidth, cardSet._width);

    if(changedCardNumPerRow !== cardNumPerRow) {
        if(_timeout === undefined) {
            _timeout = setTimeout(function() {
                changedCardNumPerRow = getCardNumPerRow(elemCardContainer.offsetWidth, cardSet._width);

                if(changedCardNumPerRow !== cardNumPerRow) {
                    cardNumPerRow = changedCardNumPerRow;
                    alignCardsOnResize();
                    _timeout = undefined;
                }
            }, 200);
        }
    }


});

alignCards();

function alignCards() {
    var elemCard, elemCss,
        changedLeftVal, changedTopVal,
        changedColumn;

    for(var i = 0; i < elemCardList.length; i++) {
        elemCard = elemCardList[i];
        elemCss = getCssStyle(elemCard);

        if(i >= cardNumPerRow) {
            changedTopVal = marginBottom + elemCardList[i-cardNumPerRow].offsetTop + elemCardList[i-cardNumPerRow].offsetHeight;;
        } else {
            changedTopVal = 0;
        }

        changedColumn = i % cardNumPerRow;
        changedLeftVal = (changedColumn * marginLeft) + (changedColumn * cardSet._width);

        elemCard.style.position = 'absolute';
        elemCard.style.width = cardSet.width;
        elemCard.style.left = changedLeftVal + 'px';
        elemCard.style.top = changedTopVal + 'px';
    }
}

function alignCardsOnResize() {
    var elemCard, elemCss,
        beforeLeftVal, beforeTopVal,
        changedLeftVal, changedTopVal = 0,
        changedRow, changedColumn,
        translateX, translateY,
        changedPosList = [];

    changedPosList.push([0, 0]);

    for(var i = 1; i < elemCardList.length; i++) {
        elemCard = elemCardList[i];
        elemCss = getCssStyle(elemCard);

        beforeLeftVal = parseInt(elemCss.left, 10);
        beforeTopVal = parseInt(elemCss.top, 10);

        changedRow = parseInt(i / cardNumPerRow, 10);
        changedColumn = i % cardNumPerRow;

        if(i >= cardNumPerRow) {
            changedTopVal = marginBottom + changedPosList[i-cardNumPerRow][0] + elemCardList[i-cardNumPerRow].offsetHeight;
        } else {
            changedTopVal = 0;
        }

        changedLeftVal = (changedColumn * marginLeft) + (changedColumn * cardSet._width);

        changedPosList.push([changedTopVal, changedLeftVal]);

        translateX = changedLeftVal - beforeLeftVal;
        translateY = changedTopVal - beforeTopVal;

        if(translateX !== 0 || translateY !== 0) {
            elemCard.style.transitionProperty = 'transform';
            elemCard.style.transitionDuration = '0.4s';
            elemCard.style.transform = 'translate(' + translateX + 'px' + ',' + translateY + 'px' + ')';

            (function () {
                var _elemCard = elemCard,
                    _changedLeftVal = changedLeftVal,
                    _changedTopVal = changedTopVal,
                    _isLastCard = i-1 === elemCardList.length;

                setTimeout(function () {
                    _elemCard.style.transitionProperty = _elemCard.style.transitionDuration = _elemCard.style.transform = '';
                    _elemCard.style.left = _changedLeftVal + 'px';
                    _elemCard.style.top = _changedTopVal + 'px';

                    if(_isLastCard) {
                        cardSet.isAligning = false;
                    }
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
