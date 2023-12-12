/*
The Elf would first like to know which games would have been possible if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?

In the example above, games 1, 2, and 5 would have been possible if the bag had been loaded with that configuration. However, game 3 would have been impossible because at one point the Elf showed you 20 red cubes at once; similarly, game 4 would also have been impossible because the Elf showed you 15 blue cubes at once. If you add up the IDs of the games that would have been possible, you get 8.

Determine which games would have been possible if the bag had been loaded with only 12 red cubes, 13 green cubes, and 14 blue cubes. What is the sum of the IDs of those games?
*/
const fs = require('fs');

const parseInput = (path) => {
    const input = fs.readFileSync(path).toString().split('\n');
    return input; 
}


class Game {
    constructor(id) {
        this.id = id;
        this.rounds = [];
        this.possible = '';
        this.colors = { 
            red: 0,
            blue: 0,
            green: 0
        }
        this.power = 0
    }
    buildRound(arr) {
        const round = new Round();
        arr.forEach(elem => {
            const [count, color] = elem.trim().split(' ');
            round.setColor(count, color); 
            round.isPossible();
            if (round.colors[color] > this.colors[color]) {
                this.colors[color] = round.colors[color];
            }
        })
        this.addRound(round);
    }
    addRound(round) {
        this.rounds.push(round)
    }
    isPossible() {
        // if all rounds are possible, game is possible 
        if (this.rounds.every(round => round.possible)) {
            this.possible = true; 
        } else {
            this.possible = false;
        }
    }
    setPower() {

        this.power = this.colors.red * this.colors.blue * this.colors.green
        return;
    }
}

class Round {
    constructor() {
        this.colors = {
            red: 0,
            blue: 0,
            green: 0
        }
        this.possible = '';
    }   
    isPossible() {
        // if each cube count is less than the total cubes in the bag, it's possible. 
        if (this.colors.red <= 12 && this.colors.blue <= 14 && this.colors.green <= 13) {
            this.possible = true; 
        } else {
            this.possible = false;
        }
    }
    setColor(count, color) {
        this.colors[color] = Number(count); 
        return; 
    }
}

const getId = (str) => {
    const digits = /\d+/;
    const id = digits.exec(str); 
    if (id.length > 0) {
        return id[0]
    }
}

const buildRound = (arr) => {
    const round = new Round();
    arr.forEach(elem => {
        const [count, color] = elem.trim().split(' ');
        round.setColor(count, color); 
        round.isPossible();
    })
    return round;

    
}
const buildGame = (str) => { 
    const gameArray = str.split(':'); 
    const id = getId(gameArray[0]);
    const rounds = gameArray[1].split(';').map(str => str.split(','))
    const game = new Game(id); 

    rounds.forEach(r => game.addRound(buildRound(r)))    
    game.isPossible();
    return game;

}

const calculateIdSum = (games) => {
    let idSum = 0; 
    games.forEach(g => {
        const game = buildGame(g)
        if (game.possible) {
            idSum += Number(game.id)
        }
    })
    return idSum;
}
const buildGameMin = (str) => { 
    const gameArray = str.split(':'); 
    
    const id = getId(gameArray[0]);
    const rounds = gameArray[1].split(';').map(str => str.split(','))
    const game = new Game(id); 
    rounds.forEach(r => game.buildRound(r))
    game.setPower(); 
    return game;
}
const calculatePowerSum = (games) => {
    let powerSum = 0; 
    games.forEach(g => {
        const game = buildGameMin(g)
        powerSum += game.power; 
    })
    return powerSum;
}
const input = parseInput('day2/input.txt')

// solution part 1 
calculateIdSum(input);
// solution part 2
 calculatePowerSum(input);
