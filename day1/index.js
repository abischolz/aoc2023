/*
Each line originally contained a specific calibration value that the Elves now need to recover. 
On each line, the calibration value can be found by combining the first digit and the last digit (in that order) 
to form a single two-digit number.

For example:
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet

In this example, the calibration values of these four lines are 12, 38, 15, and 77. 
Adding these together produces 142.

Consider your entire calibration document. What is the sum of all of the calibration values?

*/

const { parse } = require('path');

// first - split input into array of strings 
const fs = require('fs').promises;

const parseInput = async (path) => {
    const input = (await fs.readFile(path)).toString().split('\n');
    return input; 
}
// each string needs to resolve to a double digit number 
// strings have at least one digit
// if string only has one digit, the digit is both tens nad ones value (7 => 77)

const sumCalibrationValues = async () => {
    const input = await parseInput('day1/input.txt')

    let total = 0; 
    // loop over each string in the array 
    input.forEach((str, idx) => {
        // then loop over string (two pointers, one at index 0, one at index string.length-1)
        let pointer1 = 0;
        let pointer2 = str.length-1;
        let digit1 = '';
        let digit2 = '';
        // move each pointer until you reach a number OR until the pointers meet 
        while (pointer2 >= pointer1 && (!digit1 || !digit2)) {
            if (!digit1 && !isNaN(str[pointer1])) {
                digit1 = str[pointer1];
            } else if (!digit1) {
                pointer1++; 
            }

            if (!digit2 &&!isNaN(str[pointer2])) {
                digit2 = str[pointer2];
            } else if (!digit2) {
                pointer2--; 
            }
        }
        let calibrationVal = digit1 + digit2; 
        // if there is only one digit, append digits to make a two digit number
        if (calibrationVal.length < 2) {
            calibrationVal += calibrationVal
        }
        // log for each input
        console.log(`${idx}: input string is ${str} and the calibration value is ${calibrationVal}...as a number ${Number(calibrationVal)}`)
        total += Number(calibrationVal);
    })
    return total; 
}

// PART 1 SOLUTION
(async () => {
     console.log(await sumCalibrationValues())
})()

/*
Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: 
one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".
*/

// each string needs to resolve to a double digit number 
// strings have at least one digit
// if string only has one digit, the digit is both tens nad ones value (7 => 77)
// then loop over string (two pointers, one at index 0, one at index string.length-1)
// move each pointer until you reach a number, a character within the specific set OR until the pointers meet
// IF you match on the character: 
//  check to see if the sub-string matches a number (word)
// if yes - match the word to a number, set digit
// if not - advance/decrease the pointer


const sumCalibrationValues2 = async () => {
    const input = await parseInput('day1/input.txt')

    let total = 0; 
    // loop over each string in the array 
    input.forEach((str, idx) => {
        debugger;
        // then loop over string (two pointers, one at index 0, one at index string.length-1)
        let pointer1 = 0;
        let pointer2 = str.length-1;
        let digit1 = '';
        let digit2 = '';
        // move each pointer until you reach a number OR until the pointers meet 
        while (pointer2 >= pointer1 && (!digit1 || !digit2)) {
            if (!digit1 && !isNaN(str[pointer1])) {
                digit1 = str[pointer1];
            } else if (!digit1) {
                pointer1++; 
            }

            if (!digit2 &&!isNaN(str[pointer2])) {
                digit2 = str[pointer2];
            } else if (!digit2) {
                pointer2--; 
            }
        }
        let calibrationVal = digit1 + digit2; 
        // if there is only one digit, append digits to make a two digit number
        if (calibrationVal.length < 2) {
            calibrationVal += calibrationVal
        }
        // log for each input
        console.log(`${idx}: input string is ${str} and the calibration value is ${calibrationVal}...as a number ${Number(calibrationVal)}`)
        total += Number(calibrationVal);
    })
    return total; 
}

const digitCharsStart = new Set(['o', 't', 'f', 's', 'e', 'n']);
const digitCharsEnd = new Set(['e', 'o', 'r', 'x', 'n', 't']);

const testDigit = (char, start) => {
    if (!isNaN(char)) {
        return char
    } 
}
/*
o - n - e
t - w - o
t - h - r - e - e
f - o - u - r
f - i - v - e
s - i - x
s - e - v - e - n
e - i - g - h - t
n - i - n - e 

o -> n -> e

t - w - o
 \
  h - r - e - e 

f - o - u - r
 \
  i - v - e 
  
s - i - x
 \ 
  e - v - e - n

e - i - g - h - t

n - i - n - e

BACKWARDS 

      i - n
    / 
   n - o
 /
e - e - r - h - t
 \ 
  v -i - f

n - e - v - e - s

o - w - t

r - u - o - f

x - i - s

t - h - g - i - e

*/

const startMap = new Map({
    '1': /one/,
    '2': /two/,
    '3': /three/,
    '4': /four/,
    '5': /five/,
    '6': /six/,
    '7': /seven/,
    '8': /eight/, 
    '9': /nine/ 
})

const endMap = new Map({
    '1': /(?<=on)e/,
    '2': /(?<=tw)o/,
    '3': /(?<=thre)e/,
    '4': /(?<=fou)r/,
    '5': /(?<=fiv)e/,
    '6': /(?<=si)x/,
    '7': /(?<=seve)n/,
    '8': /(?<=eigh)t/, 
    '9': /(?<=nin)e/ 
})