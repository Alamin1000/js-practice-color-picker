/*
*Date : 12/07/22
*Author: Alamin
*Description: Color picker application with huge dom functionality
*/


//Globals
let toastContainer = null
const defaultColor = {
    red: 221,
    green: 222,
    blue: 238
}
const defaultPresetColors = [
	'#ffcdd2',
	'#f8bbd0',
	'#e1bee7',
	'#ff8a80',
	'#ff80ab',
	'#ea80fc',
	'#b39ddb',
	'#9fa8da',
	'#90caf9',
	'#b388ff',
	'#8c9eff',
	'#82b1ff',
	'#03a9f4',
	'#00bcd4',
	'#009688',
	'#80d8ff',
	'#84ffff',
	'#a7ffeb',
	'#c8e6c9',
	'#dcedc8',
	'#f0f4c3',
	'#b9f6ca',
	'#ccff90',
	'#ffcc80',
];
const copySound = new Audio('./src_project-10_copy-sound.wav');
copySound.volume = '0.2'


// onload handler
window.onload = () => {
    main()
    updateColorCodeDom(defaultColor)
    displayColorBoxes(
        document.getElementById('preset-colors'), 
        defaultPresetColors
    )
}
 
//main or boot function, this function will take care of getting all the dom references
function main() {
    //dom references
    const generateRandomBtn = document.getElementById('generate-random-color');
    const inputHex = document.getElementById('input-hex');
    const inputRgb = document.getElementById('input-hex');
    const colorSliderRed = document.getElementById('color-slider-red');
    const colorSliderGreen = document.getElementById('color-slider-green');
    const colorSliderBlue = document.getElementById('color-slider-blue');
    const copyToClipboardBtn = document.getElementById('copy-to-clipboard')
    const presetColorParent = document.getElementById('preset-colors')

    
    // event listeners
    copyToClipboardBtn.addEventListener('click', handleCopyToClipboardButton);
    generateRandomBtn.addEventListener('click', function(){
        handleGenerateRandomColorBtn()
    })
    inputHex.addEventListener('keyup',  handleHexInp)
    colorSliderRed.addEventListener('change', handleColorSlider(colorSliderRed,colorSliderBlue,colorSliderGreen));
    colorSliderGreen.addEventListener('change', handleColorSlider(colorSliderRed,colorSliderBlue,colorSliderGreen));
    colorSliderBlue.addEventListener('change', handleColorSlider(colorSliderRed,colorSliderBlue,colorSliderGreen));
    
    presetColorParent.addEventListener('click', handlePresetColorPreset)

}

//event handlers
function handleGenerateRandomColorBtn() {
    const color = generateColorDecimal();
    updateColorCodeDom(color);
    copySound.play()
}

function handleHexInp(e) {
    this.value = this.value.toUpperCase()
    const hexColor = '#' + e.target.value;
    if (hexColor) {
        if (isValidHex(hexColor)) {
            updateColorCodeDom(hexToDecimal(hexColor));
        }
    }
}

function handleColorSlider(colorSliderRed,colorSliderBlue,colorSliderGreen) {
    return function() {
        const color = {
            red: parseInt(colorSliderRed.value),
            green: parseInt(colorSliderGreen.value),
            blue: parseInt(colorSliderBlue.value)
        }
        updateColorCodeDom(color);
    }
}


function handleCopyToClipboardButton(){
    const colorModeRadios = document.getElementsByName('color-mode')
    const mode = getCheckedValueFromRadios(colorModeRadios)
    if (mode === null) {
        throw new Error('Invalid Radio Input')
    }
    
    if (toastContainer !== null) {
        toastContainer.remove();
        toastContainer = null;
    }

    if (mode === 'hex') {
        const hexColor = `#${document.getElementById('input-hex').value}`
        if (hexColor && isValidHex(hexColor)) {
            navigator.clipboard.writeText(hexColor);
            copySound.play()
            generateToastMessage(`${hexColor} Copied`);
        } else { alert('invalid Hex code') }
        
    } else {
        const rgbColor = document.getElementById('input-rgb').value
        if (rgbColor) {
            navigator.clipboard.writeText(rgbColor)
            copySound.play()
            generateToastMessage(`${rgbColor} Copied`);
        } else { alert('invalid RGB code') }
    }
}

function handlePresetColorPreset(event){
    const child = event.target
    if (child.classList.contains('color-box')) {
        colorData = child.getAttribute('data-color')
        navigator.clipboard.writeText(colorData)
        copySound.play()

        updateColorCodeDom(hexToDecimal(colorData));

        if (toastContainer !== null) {
            toastContainer.remove();
            toastContainer = null;
        }
        generateToastMessage(`${colorData} Copied`);
    }

    
}


//dom functions

/**
 * generate dynamic element to show a toast message
 * @param {string} 
 */

var isToastRunning = null;
function generateToastMessage(msg) {
    toastContainer = document.createElement('div')
    toastContainer.classList.add('toast-message', 'toast-message-slide-in')
    toastContainer.innerHTML = msg

    toastContainer.addEventListener('click', function(){
        toastContainer.classList.remove('toast-message-slide-in')
        toastContainer.classList.add('toast-message-slide-out')

        toastContainer.addEventListener('animationend', function(){
            toastContainer.remove()
            toastContainer = null
        })
    })

    

    document.body.appendChild(toastContainer);


    if (isToastRunning != null) {
        clearTimeout(isToastRunning)
        isToastRunning = null
    } 
    isToastRunning = setTimeout(function(){
        toastContainer.classList.add('toast-message-slide-out');
        toastContainer.addEventListener('animationend', function(){
            toastContainer.remove()
            toastContainer = null
        })

        clearTimeout(isToastRunning)
        isToastRunning = null
    },2000)

    
}

/**
 * find the checked elements from a list of radios
 * @param {Array}
 */
function getCheckedValueFromRadios(nodes) {
    let getCheckedValue = null;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            getCheckedValue = nodes[i].value
            break
        }
    }
    return getCheckedValue
}

function updateColorCodeDom(color) {
    const hexColor = generateHexColor(color);
    const rgbColor = hexToRgb(hexColor);
    document.getElementById('color-display').style.background = hexColor;
    document.getElementById('input-hex').value = hexColor.substring(1);
    document.getElementById('input-rgb').value = rgbColor;
    document.getElementById('color-slider-red-label').innerText = color.red;
    document.getElementById('color-slider-red').value = color.red;
    document.getElementById('color-slider-green-label').innerText = color.green;
    document.getElementById('color-slider-green').value = color.green;
    document.getElementById('color-slider-blue-label').innerText = color.blue;
    document.getElementById('color-slider-blue').value = color.blue;
}

/**
 * create a single color element (colorBox)
 * @param {string} color: ;
 * @return  {object}
 */
function generateColorBox(color) {
    const cDiv = document.createElement('div');
    cDiv.className = 'color-box';
    cDiv.style.background = color;
    cDiv.setAttribute('data-color', color)

    return cDiv
}

/**
 * this will display color boxes
 * @param {object} parent 
 * @param {Array} colors 
 */
function displayColorBoxes(parent,colors) {
    colors.forEach(color => {
        const colorBox = generateColorBox(color);
        parent.appendChild(colorBox)
    })
}


//utils function

/**
 * generate and return an object of three color values
 * @returns {object}
 */
function generateColorDecimal() {
    let red = Math.floor(Math.random() * 255)
    let green = Math.floor(Math.random() * 255)
    let blue = Math.floor(Math.random() * 255)

    return {
        red,
        green,
        blue
    }
}

/**
 * take a color object of three decimal values and return a hexadecimal color code
 * @param {object} param0 
 * @returns {string}
 */
function generateHexColor({red, green, blue}) {
    const getTwoCode = (value) => {
        const hex = value.toString(16)
        return hex.length < 2 ? `0${hex}` : hex
    }
    return `#${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`.toUpperCase() 
}

/**
 * take a color object of three decimal values and return a rgb color code
 * @param {object} param0 
 * @returns {string}
 */
function generateRgbColor({red, green, blue}) {
    return `rgb(${red}, ${green}, ${blue})`
}

/**
 * check a valid hex color code
 * @param {string} color 
 * @returns {boolean}
 */
function isValidHex(color) {
    if(color.length !== 7) return false;
    if(color[0] !== '#') return false;
    color = color.substring(1)
    return /^[0-9A-Fa-f]{6}$/i.test(color)
}

/**
 * convert hex color code to rgb color code
 * @param {string} hex 
 * @returns {string}
 */
function hexToRgb(hex) {
    hex = hex.substring(1)
    const red = parseInt(hex.slice(0,2), 16)
    const green = parseInt(hex.slice(2,4), 16)
    const blue = parseInt(hex.slice(4,6), 16)

    return `rgb(${red}, ${green}, ${blue})`
}


/**
 * convert hex color code to Decimal color code
 * @param {string} hex 
 * @returns {string}
 */
function hexToDecimal(hex) {
    hex = hex.substring(1)
    const red = parseInt(hex.slice(0,2), 16)
    const green = parseInt(hex.slice(2,4), 16)
    const blue = parseInt(hex.slice(4,6), 16)

    return {
        red,
        green,
        blue
    }
}