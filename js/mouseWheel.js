(function () {
    var lethargy = new Lethargy();
    var timeBlock = document.getElementsByClassName('setTime')[0];
    var settingsWrapper = document.getElementsByClassName('settingsWrapper');
    var timeList = document.getElementsByClassName('settings');
    var hoursConf = {step: 1, start: 1, stop: 12};
    var minConf = {step: 5, start: "00", stop: 55, minInH: 60};
    var stepForMac = 20;
    var macScrollRound;
    var startY;
    var targetElem;
    var macScroll = 0;
    var prevMacScroll = 0;
    var isMacScroll = false;

    //add event listeners
    for (var i = 0; i < timeList.length; i++) {
        timeList[i].addEventListener("wheel", onWheel);
        timeList[i].addEventListener("touchstart", onTouchStart);
        timeList[i].addEventListener("mousedown", onMouseStart);
    }

    window.addEventListener("wheel", checkMacScroll);

    function checkMacScroll(event) {
        if (lethargy.check(event) === false) {
            isMacScroll = true;
        } else {
            isMacScroll = false;
        }
    }


    //start of mouseMoveBlock________________________________________________________
    function onMouseStart(event){
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        startY = event.clientY;
        targetElem = event.target.parentNode;

        targetElem.addEventListener('mousemove', onMouseMove);
        targetElem.addEventListener('mouseleave', onMouseEnd);
        targetElem.addEventListener('mouseup', onMouseEnd);
    }

    function onMouseMove(event){
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        var delta = event.clientY - startY;
        startY = event.clientY;
        targetElem.style.marginTop = parseInt(getComputedStyle(targetElem).marginTop) + delta + 'px';
    }

    function onMouseEnd(event){
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        var height = parseInt(getComputedStyle(timeList[0].children[0]).height);
        var stepMultipl = Math.round (parseInt(getComputedStyle(targetElem).marginTop)/height) + 11;
        targetElem.style.marginTop = "";

        targetElem.removeEventListener('mousemove', onMouseMove);
        targetElem.removeEventListener('mouseleave', onMouseEnd);
        targetElem.removeEventListener('mouseup', onMouseEnd);

        if (targetElem == settingsWrapper[0].children[0]) {
            hoursChange(Math.abs(stepMultipl * hoursConf.step), hoursConf.start, hoursConf.stop, -stepMultipl, event);
        } else if (targetElem == settingsWrapper[1].children[0]) {
            minChange(Math.abs(minConf.step * stepMultipl), minConf.start, minConf.stop, -stepMultipl, event);
        } else if (targetElem == settingsWrapper[2].children[0]) {
            dayHalfChange(stepMultipl, event);
        }
    }

    //end of mouseMoveBlock__________________________________________________________


    //start of touchMoveBlock________________________________________________________
    function onTouchStart(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        startY = event.touches[0].pageY;
        targetElem =  event.target.parentNode;

        timeBlock.addEventListener('touchmove', onTouchMove);
        timeBlock.addEventListener('touchend', onTouchEnd);
    }

    function onTouchMove(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        var delta = Math.ceil(event.touches[0].pageY - startY);
        startY = event.touches[0].pageY;
        targetElem.style.marginTop = parseInt(getComputedStyle(targetElem).marginTop) + delta + 'px';

    }

    function onTouchEnd(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);

        var height = parseInt(getComputedStyle(timeList[0].children[0]).height);
        var stepMultipl = Math.round (parseInt(getComputedStyle(targetElem).marginTop)/height) + 11;
        targetElem.style.marginTop = "";

        timeBlock.removeEventListener('touchmove', onTouchMove);
        timeBlock.removeEventListener('touchend', onTouchEnd);

        if (targetElem == timeBlock.children[0].children[0]) {
            hoursChange(Math.abs(stepMultipl * hoursConf.step), hoursConf.start, hoursConf.stop, -stepMultipl, event);
        } else if (targetElem == timeBlock.children[1].children[0]) {
            minChange(Math.abs(minConf.step * stepMultipl), minConf.start, minConf.stop, -stepMultipl, event);
        } else if (targetElem == timeBlock.children[2].children[0]) {
            dayHalfChange(stepMultipl, event);
        }

        event.target.removeEventListener('touchmove', onTouchMove);
        event.target.removeEventListener('touchend', onTouchEnd);
    }
    //end of touchMoveBlock__________________________________________________________


    //wheelMoveBlock_________________________________________________________________
    function onWheel(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        event = event || window.event;

        var timeList = event.target.parentNode.parentNode;
        var delta = event.deltaY || event.detail || event.wheelDelta;
        console.log(delta);

        if (isMacScroll) {
            macScroll = macScroll + delta;
            macScrollRound = Math.abs(Math.round(macScroll/stepForMac)*stepForMac);
            if (prevMacScroll != macScrollRound &&  macScrollRound >= stepForMac){
                prevMacScroll = macScrollRound;
                if (timeList == timeBlock.children[0]) {
                    hoursChange(hoursConf.step, hoursConf.start, hoursConf.stop, delta, event);
                } else if (timeList == timeBlock.children[1]) {
                    minChange(minConf.step, minConf.start, minConf.stop, delta, event);
                } else if (timeList == timeBlock.children[2]) {
                    dayHalfChange(-delta, event);
                }
            }
        }
        else {
            if (timeList == timeBlock.children[0]) {
                hoursChange(hoursConf.step, hoursConf.start, hoursConf.stop, delta, event);
            } else if (timeList == timeBlock.children[1]) {
                minChange(minConf.step, minConf.start, minConf.stop, delta, event);
            } else if (timeList == timeBlock.children[2]) {
                dayHalfChange(delta, event);
            }
        }
    }

    //timeChangingBlock______________________________________________________________
    function hoursChange(step, start, stop, delta, event) {
        var targetElem;

        if (event && event.target == timeBlock) {
            targetElem = event.target.children[0].children;
        } else {
            targetElem = document.getElementsByClassName('settings')[0].children;
        }

        if (delta > 0) {
            for (var i = 0; i < targetElem.length; i++) {
                if ((parseInt(targetElem[i].innerHTML) + step) > stop) {
                    targetElem[i].innerHTML = parseInt(targetElem[i].innerHTML) + step - stop;
                    if (targetElem[i].classList.contains('chosen') && targetElem[i].innerHTML < step) {
                        dayHalfChange(delta);
                    }
                } else {
                    targetElem[i].innerHTML = parseInt(targetElem[i].innerHTML) + step;
                    if (targetElem[i].classList.contains('chosen') && targetElem[i].innerHTML == stop) {
                        dayHalfChange(delta);
                    }
                }
            }
        } else if(delta < 0) {
            for (var i = 0; i < targetElem.length; i++) {
                if ((parseInt(targetElem[i].innerHTML) - step) <= 0) {
                    targetElem[i].innerHTML = parseInt(targetElem[i].innerHTML) - step + stop;
                } else {
                    targetElem[i].innerHTML = parseInt(targetElem[i].innerHTML) - step;
                    if (targetElem[i].classList.contains('chosen') && targetElem[i].innerHTML == stop - step) {
                        dayHalfChange(delta);
                    }
                }
            }
        } else if(delta == 0) {
            if (event && event.target == timeList[0].children[11]){
                hoursChange(hoursConf.step, hoursConf.start, hoursConf.stop, -1)
            }
            else if (event && event.target == timeList[0].children[13]){
                hoursChange(hoursConf.step, hoursConf.start, hoursConf.stop, 1)
            }
        }

    }

    function minChange(step, start, stop, delta, event) {
        var targetElem;

        if (event && event.target == timeBlock) {
            targetElem = event.target.children[1].children;
        } else {
            targetElem = document.getElementsByClassName('settings')[1].children;
        }

        if (delta > 0) {
            for (var i = 0; i < targetElem.length; i++) {
                if ((parseInt(targetElem[i].innerHTML) + step) > stop) {
                    targetElem[i].innerHTML = parseInt(targetElem[i].innerHTML) + step - minConf.minInH;
                    if (targetElem[i].innerHTML < 10) {
                        targetElem[i].innerHTML = "0" + targetElem[i].innerHTML;
                    }
                    if (targetElem[i].classList.contains('chosen') && parseInt(targetElem[i].innerHTML) < step) {
                        hoursChange(hoursConf.step, hoursConf.start, hoursConf.stop, delta);
                    }
                } else {
                    targetElem[i].innerHTML = parseInt(targetElem[i].innerHTML) + step;
                    if (targetElem[i].innerHTML < 10) {
                        targetElem[i].innerHTML = "0" + targetElem[i].innerHTML;
                    }
                }
            }
        } else if (delta < 0){
            for (var i = 0; i < targetElem.length; i++) {
                if ((parseInt(targetElem[i].innerHTML) - step) < 0) {
                    targetElem[i].innerHTML = minConf.minInH + ((parseInt(targetElem[i].innerHTML) - step)) ;
                    if (targetElem[i].classList.contains('chosen')) {
                        hoursChange(hoursConf.step, hoursConf.start, hoursConf.stop, delta);
                    }
                }
                else {
                    targetElem[i].innerHTML = parseInt(targetElem[i].innerHTML) - step;
                    if (targetElem[i].innerHTML < 10) {
                        targetElem[i].innerHTML = "0" + targetElem[i].innerHTML;
                    }
                }
            }
        } else if(delta == 0) {
            if (event && event.target == timeList[1].children[11]){
                minChange(minConf.step, minConf.start, minConf.stop, -1)
            }
            else if (event && event.target == timeList[1].children[13]){
                minChange(minConf.step, minConf.start, minConf.stop, 1)
            }
        }
    }

    function dayHalfChange(delta, event) {
        var targetElem;

        if (event) {
            targetElem = event.target.parentNode.children;
            if (delta > 0) {
                targetElem[11].innerHTML = "";
                targetElem[12].innerHTML = "AM";
                targetElem[13].innerHTML = "PM";
            } else if (delta < 0) {
                targetElem[11].innerHTML = "AM";
                targetElem[12].innerHTML = "PM";
                targetElem[13].innerHTML = "";
            } else if (delta == 0) {
                if (event && event.target == timeList[2].children[11]) {
                    dayHalfChange(1, event);
                }
                else if (event && event.target == timeList[2].children[13]) {
                    dayHalfChange(-1, event);
                }
            }

        } else {
            targetElem = document.getElementsByClassName('settings')[2].children;
            if (targetElem[11].innerHTML === "AM") {
                targetElem[11].innerHTML = "";
                targetElem[12].innerHTML = "AM";
                targetElem[13].innerHTML = "PM";
            } else {
                targetElem[11].innerHTML = "AM";
                targetElem[12].innerHTML = "PM";
                targetElem[13].innerHTML = "";
            }
        }

    }

})();
