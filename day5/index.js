/*
The rest of the almanac contains a list of maps which describe how to convert numbers from a source category into numbers in a 
destination category. That is, the section that starts with seed-to-soil map: describes how to convert a seed number (the source) 
to a soil number (the destination). This lets the gardener and his team know which soil to use with which seeds, which water to 
use with which fertilizer, and so on.

Rather than list every source number and its corresponding destination number one by one, the maps describe entire ranges of numbers 
that can be converted. Each line within a map contains three numbers: the destination range start, the source range start, and the 
range length.

Consider again the example seed-to-soil map:

50 98 2
52 50 48
The first line has a destination range start of 50, a source range start of 98, and a range length of 2. This line means that the 
source range starts at 98 and contains two values: 98 and 99. The destination range is the same length, but it starts at 50, so its 
two values are 50 and 51. With this information, you know that seed number 98 corresponds to soil number 50 and that seed number 99 
corresponds to soil number 51.

The second line means that the source range starts at 50 and contains 48 values: 50, 51, ..., 96, 97. This corresponds to a 
destination range starting at 52 and also containing 48 values: 52, 53, ..., 98, 99. So, seed number 53 corresponds to soil 
number 55.

Any source numbers that aren't mapped correspond to the same destination number. So, seed number 10 corresponds to soil number 10.

So, the entire list of seed numbers and their corresponding soil numbers looks like this:

seed  soil
0     0
1     1
...   ...
48    48
49    49
50    52
51    53
...   ...
96    98
97    99
98    50
99    51
With this map, you can look up the soil number required for each initial seed number:

Seed number 79 corresponds to soil number 81.
Seed number 14 corresponds to soil number 14.
Seed number 55 corresponds to soil number 57.
Seed number 13 corresponds to soil number 13.
The gardener and his team want to get started as soon as possible, so they'd like to know the closest location that needs a seed. 
Using these maps, find the lowest location number that corresponds to any of the initial seeds. To do this, you'll need to convert 
each seed number through other categories until you can find its corresponding location number. In this example, the corresponding 
types are:

Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.
Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.
Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.
So, the lowest location number in this example is 35.

What is the lowest location number that corresponds to any of the initial seed numbers?

*/
const fs = require('fs');

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
    // head of linked list
    const seed = new Node('seed');
    let tail = seed;

    input.forEach((element, i) => {
        // if the element is a map entry
        if (maps.test(element)) {
            // extract next node name 
            const idx = element.lastIndexOf('-')
            const name = element.slice(idx + 1, element.length-4).trim();
            const mapNode =  new Node(name); 
            // move to next node
            tail.next = mapNode; 
            tail = mapNode;

            // the pointer will iterate through the interval entries until another map entry is reached
            let pointer = i + 1; 
            while (input[pointer] && !maps.test(input[pointer])) {
                // input[pointer] is something like this `1615836342 1401909974 23067952`
                const [key, value] = buildInterval(input[pointer])
                // save the interval and its conversion function in the conversion map
                tail.setInterval([key, value])
                pointer++
            }
        }
    });
    return seed;
}

const convertSeeds = (seeds) => {
    // array of seeds - numbers 
    let min = null; // this is what we want to return 
    for (const seed of seeds) {
        const head = buildLinkedList(input)
        //console.log('head - ', head)
        //set val for each seed, then traverse list 
        head.val = seed
        // once end of list is reached , record ending value
        const location = traverseList(head)
        if (!min || min > location.val) {
            //console.log('updating min ... ')
            min = location.val;
        }
        
    }
    //console.log('min is ', min)
    
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
// first = parse input and extract seeds 
const input = parseInput('day5/input.txt')
const seeds = extractSeeds(input)
console.log('seeds are ', seeds)
// next - build linked list (each node has name, intervals and conversion function)
//const list = buildLinkedList(input.slice(1));
// next - iterate through seed array to find location number for each - return lowest 
const location = convertSeeds(seeds)






