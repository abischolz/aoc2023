const fs = require('fs');

// TEXT FORMATTING 
const parseInput = (path) => {
    const input = fs.readFileSync(path).toString().split('\n').filter(str => str !== '')
    return input; 
}


const extractSeeds = (input) => {
    const seeds = input[0].split(':')[1].trim().split(' ').map(str => Number(str));
    return seeds; 
}


class Node {
    constructor(name) {
        this.name = name;
        this.val = 0;
        this.conversionMap = new Map(); // this will hold the intervals and functions
        this.next = ''
    }
    setInterval([key, val]) {
        this.conversionMap.set([key, val])
    }
}

const buildInterval = (str) => {
    const interval = str.split(' ').map(str => Number(str))
    const key = [interval[1], interval[1] + interval[2]-1]
    const factor = interval[0] - interval[1];
    const conversion = new Function('source', `return source + ${factor}`)
    return [key, conversion];
}
const buildLinkedList = (input) => {
    const maps = new RegExp('map')
    const seed = new Node('seed');
    let tail = seed;

    input.forEach((element, i) => {
        if (maps.test(element)) {
            const idx = element.lastIndexOf('-')
            const name = element.slice(idx + 1, element.length-4).trim();
            const mapNode =  new Node(name); 
            tail.next = mapNode; 
            tail = mapNode;

            let pointer = i + 1; 
            while (input[pointer] && !maps.test(input[pointer])) {
                const [key, value] = buildInterval(input[pointer])
                tail.setInterval([key, value])
                pointer++
            }
        }
    });
    return seed;
}

const convertSeeds = (seeds) => {
    let min = null;
    for (const seed of seeds) {
        const head = buildLinkedList(input)
        head.val = seed
        const location = traverseList(head)
        if (!min || min > location.val) {
            min = location.val;
        }
    }
    return min;
}

const traverseList = (list) => {
    let current = list; 
    let next = list.next; 

    while (next) {
        const newVal = convertValue(current, next);
        next.val = newVal; 
        current = next; 
        next = current.next; 
    }
    return current;
}

const convertValue = (source, destination) => {
    let iterator = destination.conversionMap.entries(); 
    const entries = Array.from(iterator);
    for (let i = 0; i < entries.length; i++) {
        entries[i].pop();
        const [[min, max], convert] = entries[i][0]
        if (source.val >= min && source.val <= max) {
            return convert(source.val)
        }
    }
    return source.val;
}
//PART 1
const input = parseInput('day5/input.txt')
const seeds = extractSeeds(input)
const location = convertSeeds(seeds)


// PART 2 



