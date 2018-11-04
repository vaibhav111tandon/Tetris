const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const colors = [
	 null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF'
    ];

context.scale(20, 20);

const matrix = [
	[0,0,0],
	[1,1,1],
	[0,1,0]
];

function draw(){	
	context.fillStyle = "#353535";
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawMatrix(arena, {x: 0, y: 0});
	drawMatrix(player.matrix, player.pos);
}

const player = {
	pos: {x: 5, y: 5},
	matrix: createPiece('I'),
	score: 0
};

function drawMatrix(matrix, offset){
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value!==0){
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
				context.strokeStyle = "#000";
			}
		})
	});
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

var dCounter = 0;
var dropTime = 1000;
var lastT = 0;
function update(time = 0){
	var changeTime = time - lastT;
	lastT = time;
	dCounter += changeTime;
	if(dCounter > dropTime){
		playerDrop();
	}	
	draw();
	requestAnimationFrame(update);
}

function merge(arena, player){
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value!==0){
				arena[y+player.pos.y][x+player.pos.x] = value;
			}
		})
	});
}

function createMatrix(w, h){
	const matrix = [];
	while(h--){
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

function playerMove(val){	
	player.pos.x += val;
	if(collide(arena, player)){
		player.pos.x -= val;
	}
}

function playerDrop(){
	player.pos.y++;
	if(collide(arena, player)){
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dCounter = 0;
}

const arena = createMatrix(12, 20);
document.addEventListener('keydown', (e) => {
	if(e.keyCode === 37){
		playerMove(-1);
	}
	else if(e.keyCode === 39){
		playerMove(1);
	}
	else if(e.keyCode === 40){
		playerDrop();
	}
	else if(e.keyCode === 81){
		playerRotate(-1);
	}
	else if(e.keyCode === 87){
		playerRotate(1);
	}
});

function playerRotate(dir){
	let pos = player.pos.x;
	let offset = 1;
	rotate(player.matrix, dir);
	while(collide(arena, player)){
		player.pos.x += offset;
		offset = -(offset + (offset > 0) ? 1 : -1);
		if(offset > player.matrix[0].length){
			rotate(player.matrix, -dir);
			player.pos.x = pos;
			return ;
		}
	}
}

function rotate(matrix, dir){
	for(var y = 0; y < matrix.length; y++){
		for(var x = 0;x < y;x++){
			[matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
		}
	}
	if(dir > 0){
		matrix.forEach(row => row.reverse());
	}else
		matrix.reverse();
}

function playerReset(){
	const pieces = 'ILJOTSZ';
	player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
	player.pos.y = 0;
	player.pos.x = (arena[0].length/2 | 0)-(player.matrix[0].length/2 | 0);
	if(collide(arena, player)){
		arena.forEach(row => row.fill(0));
		player.score = 0;
		updateScore();
	}
}

function updateScore(){
	document.getElementById('score').innerText = player.score;
}

playerReset();
update();
updateScore();

function createPiece(type){
	if(type==='I'){
		return [
		[0,1,0,0],
		[0,1,0,0],
		[0,1,0,0],
		[0,1,0,0]
		];
	}
	else if(type==='L'){
		return [
		[0,2,0],
		[0,2,0],
		[0,2,2]
		];
	}
	else if(type==='J'){
		return [
		[0,3,0],
		[0,3,0],
		[3,3,0]
		];
	}
	else if(type==='O'){
		return [
		[4,4],
		[4,4]
		];
	}
	else if(type==='Z'){
		return [
		[5,5,0],
		[0,5,5],
		[0,0,0]
		];
	}
	else if(type==='S'){
		return [
		[0,6,6],
		[6,6,0],
		[0,0,0]
		];
	}
	else if(type==='T'){
		return [
		[0,7,0],
		[7,7,7],
		[0,0,0]
		];
	}
}

