'use strict';

var elemCardList = document.getElementsByClassName('card');
var elemCardContainer = document.getElementsByClassName('card-container')[0];

var cardSet = {
    'width':'300px'
};

if(cardSet.width.indexOf('px') !== -1 ) {
    cardSet._width = parseInt(cardSet.width.substr(0, cardSet.width.indexOf('px')), 10);
    cardSet._unit = 'px';
} else {
    console.log('잘못된 넓이.');
}

var cardNumPerRow = parseInt(elemCardContainer.offsetWidth/cardSet._width, 10);
var elemCardCss = getComputedCssStyle(elemCardList[0]);
var marginLeft = parseInt(elemCardCss.marginLeft.substr(0, elemCardCss.marginLeft.indexOf('px')), 10);
var marginBottom = parseInt(elemCardCss.marginBottom.substr(0, elemCardCss.marginBottom.indexOf('px')), 10);

// console.log('container\'s with is ', elemCardContainer.offsetWidth);
// console.log('한 행에 올 수 있는 카드의 개수.', cardNumPerRow);

alignCardList();

function getComputedCssStyle(elem) {
    return elem.currentStyle || window.getComputedStyle(elem);
}

function alignCardList() {
    for(var i = 0; i < elemCardList.length; i++) {
        var elemCard = elemCardList[i],
            col = i % cardNumPerRow,
            beforeLeftVal = parseInt(elemCard.style.left, 10),
            beforeTopVal = parseInt(elemCard.style.top, 10),
            afterLeftVal, afterTopVal,
            topElemHeight,
            translateX, translateY;

        afterLeftVal = (col * marginLeft) + (col * cardSet._width);

        if(i >= cardNumPerRow) {
            topElemHeight = (marginBottom) + elemCardList[i-cardNumPerRow].offsetTop + elemCardList[i-cardNumPerRow].offsetHeight;
            // elemCard.style.top = topElemHeight + cardSet._unit;
            afterTopVal = topElemHeight;
        } else {
            afterTopVal = 0;
        }

        // translateX = parseInt(beforeLeft, 10) - parseInt(elemCard.style.left, 10);
        // translateY = parseInt(beforeTop, 10) - parseInt(elemCard.style.top, 10);
        translateX = beforeLeftVal - afterLeftVal;
        translateY = beforeTopVal - afterTopVal;



        elemCard.style.position = 'absolute';
        elemCard.style.width = cardSet._width + cardSet._unit;
        elemCard.style.left = afterLeftVal + 'px';
        elemCard.style.top = afterTopVal + 'px';


        // elemCard.style.transitionProperty = 'transform';
        // elemCard.style.transitionDuration = '0.4s';
        // elemCard.style.transform = 'translate('+translateX + ', '+translateY+')';

        // transition-property: transform;
        // transition-duration: 0.4s;
        // transform: translate(20px, 20px);
        // elemCard.style.transitionProperty = 'transform';
        // elemCard.style.transitionDuration = '0.4s';
        // elemCard.style.transform = 'translate('+elemCard.style.left + ', '+elemCard.style.top+')';
    }
}

window.addEventListener("resize", function(e) {
    // var width = e.target.innerWidth;
    // var height = e.target.innerHeight;
    cardNumPerRow = parseInt(elemCardContainer.offsetWidth/cardSet._width, 10);
    alignCardList();

    console.log('resizing', cardNumPerRow);
});
