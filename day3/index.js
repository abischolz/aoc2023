/*
The engine schematic (your puzzle input) consists of a visual representation of the engine. 
There are lots of numbers and symbols you don't really understand, but apparently any number 
adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. 
(Periods (.) do not count as a symbol.)

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). 
Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. 
What is the sum of all of the part numbers in the engine schematic?
*/

// first find the positions of symbols - [x, y]
// how to identify symbols ? 
// ascii 33 - 47 (exclude 46 which is . )
// class Node => this.location, this.value

// class Node {
//     constructor(value) {
//         this.value = value;
//         this.location
//         this.edges = []
//         this.visited = ''    // bool
//     }
// }

const fs = require('fs');

const parseInput = (path) => {
    const input = fs.readFileSync(path).toString().split('\n').map(str => str.split(''));
    return input; 
}

class Schematic {
    constructor() {
        this.nodes = [] // graph
        this.symbols = []; // array of nodes
        this.partNumbers = []
    }
    // adds node to end of row 
    addNode(node) {
        this.nodes[this.nodes.length-1].push(node);
    }
    addRow() {
        this.nodes.push([])
    }
    addSymbol(symbol) {
        this.symbols.push(symbol)
    }
    // this is DFS approach to finding a part number - input is a symbol node 
    findPartNumber(node) {
        //console.log('adjoining node is ', node)
        // if this node has already been part of a part number, we cannot add it to another part number
        if (node.visited) {
            //console.log('we have already used this node in a part number')
            return;
        }
        // each adjoining is a number node already - set the first number as the part number
        let partNumber = node.value;
        // set node to visited - it is already part of the part number
        node.visited = true; 

        const [x, y] = node.location;
        //console.log('LOCATION START IS ', node.location)
        //console.log('starting location is ', node.location)
        const maxY = this.nodes[0].length-1;
        //console.log('MAX Y  is ', maxY)

        let left, right;
        if (y > 0) {
            left = this.nodes[x][y-1]
            //console.log('left node is ', left)
        }  

        if (left && left.number && !left.visited) {
            //console.log('left - recursing...')
            // add part to beginning of existing part number  
            partNumber = this.findPartNumber(left) + partNumber; 
            //console.log('what is partnumber ? ', partNumber)
        } 


        if (y < maxY) {
            //console.log('right - recursing...')

            right = this.nodes[x][y+1]
            //console.log('right node is ', right)
        }
        
        if (right && right.number && !right.visited) {
            // add part to end of existing part number
            partNumber += this.findPartNumber(right)
        }   
        //console.log('part number is ', partNumber)
        return partNumber;
    }
}

class Node {
    constructor(val, row, col) {
        this.value = val;
        this.visited = false;
        this.gearRatio = 0;
        this.symbol = ''; // set when node is added 
        this.number = ''; // set when node is added 
        this.location = [row, col] // [x,y]
        this.adjoining = []; // this is only relevant for symbols - keeps track of traversal
        this.partNumbers = [];
    }

    isSymbol() {
        const regex = new RegExp('[^0-9.]')
        //const code = this.value.charCodeAt(0);
        //console.log('code is ', code)
        if (regex.test(this.value)) {
            this.symbol = true;
        } else {
            this.symbol = false;
        }
    }
    isNumber() {
        const regex = new RegExp('[0-9]')
        if (regex.test(this.value)) {
            this.number = true;
        } else {
            this.number = false;
        }
    }
    addAdjoining(graph) {
        const [x, y] = this.location; 
        const adjacent = []
        const locations = [[x-1, y+1], [x, y+1], [x+1, y+1], [x-1, y], [x+1, y], [x-1, y-1], [x, y-1], [x+1, y-1]];
        locations.forEach(([x, y]) => {
            const maxX = graph.nodes.length-1;
            const maxY = graph.nodes[x].length-1;
            if ((x >= 0 && y >= 0) && (x <= maxX && y <= maxY) && graph.nodes[x][y].number) {
                adjacent.push(graph.nodes[x][y])
            }
        })
        this.adjoining = adjacent;
        //console.log('adjoining for node is ', this.adjoining)
    }
    calculateGearRatio() {
        // only calculate if gear is adjacent to two part numbers
        if (this.partNumbers.length === 2) {
            this.gearRatio = Number(this.partNumbers[0]) * Number(this.partNumbers[1])
        } else {
            this.gearRatio = 0; 
        }
    }
}


const input = parseInput('day3/input.txt')

const buildGraph = (input) => {
    //console.log('input is ', input)
    const schematic = new Schematic(); 
    //schematic.addRow(); // adds initial row 
    //console.log('input length is ', input.length)
    //console.log('first element length is ', input[0].length)
    for (let i = 0; i < input.length; i++) {
        schematic.addRow()
        //console.log('row # is ', i)
        for (let j = 0; j < input[i].length; j++) {
            //console.log('column # is ', j)
            const node = new Node(input[i][j], i, j); 
            node.isSymbol(); 
            node.isNumber(); 
            if (node.symbol) {
                schematic.addSymbol(node)
            }
            schematic.addNode(node)
        }
    }
    //console.log('# of columns is ', schematic.nodes[0].length)
    //console.log('# of rows is ', schematic.nodes.length)
    //console.log('# of symbols is ', schematic.symbols.length)
    //console.log('schematic nodes is ', schematic.nodes)
    schematic.symbols.forEach(node => {
        //console.log('symbol node is ', node)
        node.addAdjoining(schematic)

        //console.log('adjoining = ', node.adjoining)
        //return;
        //here - dfs method to find and store all part numbers 
        node.adjoining.forEach(nodeNum => {
            const partNumber = schematic.findPartNumber(nodeNum)
            if (partNumber) {
                schematic.partNumbers.push(partNumber);
                node.partNumbers.push(partNumber); 
            }
            // console.log('how did we do ', schematic.partNumbers)
        })
        node.calculateGearRatio();
        // now we have all the part numbers - we need to turn them into numbers and sum them    
    })

    return schematic; 
    
}
const graph = buildGraph(input)
//console.log('partnumbers are ', graph.partNumbers)
// PART 1 ANSWER    
const total = graph.partNumbers.reduce((previous, current) => {
    return previous += Number(current);
    
}, 0)
// PART 2 ANSWER

const gears = graph.symbols.filter(symbol => symbol.value.charCodeAt(0) === 42)
//console.log('gears are ', gears)
const ratioSum = gears.reduce((sum, gear) => {return sum += gear.gearRatio}, 0)
                    
//console.log('total IS ', total)
//console.log('ratioSum IS ', ratioSum)








