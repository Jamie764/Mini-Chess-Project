const row1=document.getElementById("row_1");
const row2=document.getElementById("row_2");
const row3=document.getElementById("row_3");
const row4=document.getElementById("row_4");
const row5=document.getElementById("row_5");
const rows=[row1,row2,row3,row4,row5];

const cell_color = "rgb(230,255,200)";
const selected_color = "blue";
const hover_color = "green";
const move_color = "aqua";
const attack_color = "red";

//Reference to all piece icons
const pawnBlack = `<i class="fa-solid fa-chess-pawn"></i>`;
const pawnWhite = `<i class="fa-regular fa-chess-pawn"></i>`;
const rookBlack = `<i class="fa-solid fa-chess-rook"></i>`;
const rookWhite = `<i class="fa-regular fa-chess-rook"></i>`;
const knightBlack = `<i class="fa-solid fa-chess-knight"></i>`;
const knightWhite = `<i class="fa-regular fa-chess-knight"></i>`;
const bishopBlack = `<i class="fa-solid fa-chess-bishop"></i>`;
const bishopWhite = `<i class="fa-regular fa-chess-bishop"></i>`;
const queenBlack = `<i class="fa-solid fa-chess-queen"></i>`;
const queenWhite = `<i class="fa-regular fa-chess-queen"></i>`;
const kingBlack = `<i class="fa-solid fa-chess-king"></i>`;
const kingWhite = `<i class="fa-regular fa-chess-king"></i>`;


//Set the escape key to cancel piece selection
document.addEventListener("keydown", (event) => {
    if(event.key==="Backspace" || event.key==="Escape"){
        deselectMoves();
    }
});

//Setup a grid consisting of the default colors of the cells (these will change to highlight valid moves, etc)
const backgroundColorGrid= new Array(5);
for(let i=0;i<backgroundColorGrid.length;i++){
    backgroundColorGrid[i] = new Array(5);
    for(let j=0;j<backgroundColorGrid[i].length;j++){
        backgroundColorGrid[i][j] = cell_color;
    }
}

//keeps track of selected piece
let selectedPiece = null;
//This array will keep track of the valid moves for the currently selected piece
let validMoves = new Array(0);
//This array will keep track of the valid takes for the currently selected piece
let validTakes = new Array(0);


let winner="";


//      THIS STUFF IS RUN AT THE START OF THE GAME (SETUP)

//Obtain reference to all text elements
const textElements=document.querySelectorAll("h1,p,h2,h3");

//Keeps track of whose turn it is
//0 is white, 1 is black
let turn = 0;



//grid contains reference to each html cell element on the board
const grid = new Array(5);
for(let i=0;i<grid.length;i++){
    grid[i] = new Array(5);
    for(let j=0;j<grid[i].length;j++){
        //Clear html if there is already stuff there
        if(j===0){
            rows[i].innerHTML=``;
        }
        //Add a cell
        rows[i].innerHTML+=`<div class="cell" id="row_${i+1}_cell_${j+1}"></div>`;
    }
}

//Setup the grid array and on click events
//For reasons beyond my understanding I have to do this in a seperate for loop from the previous one otherwise it doesn't work
for(let i=0;i<grid.length;i++){
    for(let j=0;j<grid[i].length;j++){
        grid[i][j] = document.getElementById(`row_${i+1}_cell_${j+1}`);
        grid[i][j].addEventListener("click", ()=>{cellClicked(i,j)});
        grid[i][j].addEventListener("mouseenter",()=>{colorCell(i,j,hover_color);});
        grid[i][j].addEventListener("mouseleave",()=>{colorCell(i,j,backgroundColorGrid[i][j]);});
    }
}

//Setup grid that stores the string names of pieces
const pieces= new Array(5);
for(let i=0;i<pieces.length;i++){
    pieces[i] = new Array(5);
}
//Grid that stores whether the pieces are for white or black
const factions = new Array(5);
for(let i=0;i<factions.length;i++){
    factions[i] = new Array(5);
}


setupGame();



//      THIS STUFF ARE FUNCTIONS TO BE CALLED WHEN NEEDED


function setupGame(){
    //Setup the initial factions:
    for(let i=0;i<factions[0].length;i++){
        factions[0][i] = "black";
        factions[1][i] = "black";
        factions[2][i] = "";
        factions[3][i] = "white";
        factions[4][i] = "white";
    }
    //Setup the initial pieces
    //  NOTE:  BOTH UNASSIGNED VALUES AND EMPTY STRINGS FLAG AS FALSE IN IF STATEMENTS, SO I CAN USE THAT TO MY ADVANTAGE

    //Setup the initial pawns and blanks
    for(let i=0;i<pieces[0].length;i++){
        pieces[1][i] = "pawn";
        pieces[2][i] = "";
        pieces[3][i] = "pawn";
    }
    //Setup rooks
    pieces[0][0]="rook";
    pieces[4][0]="rook";
    //Setup knights
    pieces[0][1]="knight";
    pieces[4][1] = "knight";
    //Setup bishops
    pieces[0][2]="bishop";
    pieces[4][2]="bishop";
    //setup queens
    pieces[0][3]="queen";
    pieces[4][3]="queen";
    //Setup kings
    pieces[0][4]="king";
    pieces[4][4]="king";

    //Display the piece icons
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            grid[i][j].innerHTML = getPieceIcon(i,j);
        }
    }

    //Reset the background color grid
    for(let i=0;i<backgroundColorGrid.length;i++){
        for(let j=0;j<backgroundColorGrid[i].length;j++){
            backgroundColorGrid[i][j] = cell_color;
        }
    }

    whiteTurn();
}


function selectMoves(i,j){
    piece = pieces[i][j];
    faction = factions[i][j];
    if(!piece || !faction){
        //If either piece or faction is not valid, then just return
        return;
    }else if(faction==="white" && turn===1){
        //If we select a white piece on black's turn, then do nothing
        return;
    }else if(faction==="black" && turn===0){
        //If we select a black piece on white's turn, then do nothing
        return;
    }

    //Update selected piece
    selectedPiece = [i,j];

    validTakes=new Array(0);

    let oppositeFaction="black";
    if(faction==="black"){
        oppositeFaction="white";
    }

    // !!  WIP:  SORT OUT THE CORRECT MOVEMENTS AND TAKES FOR ALL PIECES

    //Highlight moves depending on the piece
    switch(piece){

        case "pawn":
            let direction=-1;
            if(faction==="black"){
                direction=1;
            }
            //If that space has no piece then it's a valid move
            if(!queryGrid(pieces,i+direction,j)){
                validMoves = [[i+direction,j]];
            }
            if(queryGrid(factions, i+direction,j-1) === oppositeFaction){
                validTakes.push([i+direction,j-1]);
            }
            if(queryGrid(factions, i+direction,j+1) === oppositeFaction){
                validTakes.push([i+direction,j+1]);
            }
            break;

        case "rook":
            rookMoves(i,j,oppositeFaction);
            break;

        case "bishop":
            bishopMoves(i,j,oppositeFaction);
            break;

        case "knight":
            //The potential moves the knight can make
            const checks=[[i-2,j+1],[i-2,j-1],[i+2,j+1],[i+2,j-1],[i+1,j+2],[i-1,j+2],[i+1,j-2],[i-1,j-2]];
            specificMovesCalc(i,j,oppositeFaction,checks);
            break;

        case "king":
            const checks2=[[i-1,j-1],[i-1,j],[i-1,j+1],[i,j-1],[i,j+1],[i+1,j-1],[i+1,j],[i+1,j+1]];
            specificMovesCalc(i,j,oppositeFaction,checks2);
            break;

        case "queen":
            rookMoves(i,j,oppositeFaction);
            bishopMoves(i,j,oppositeFaction);
            break;

        default:
            return;
    }
    highlightMoves();
}


//Sorts out the rook moves (and also the horizontal and vertical moves of the queen)
function rookMoves(i,j,oppositeFaction){
    //The up case
    for(let y=i-1;y>=0;y--){
        //We add all free spaces to valid moves until we hit an occupied cell
        //If this cell is the opposite faction, it's a valid take and we break out of loop
        //Else we simply break out of loop because our movement is blocked
        if(!queryGrid(factions,y,j)){
            validMoves.push([y,j]);
        }else if(queryGrid(factions,y,j) === oppositeFaction){
            validTakes.push([y,j]);
            break;
        }else{
            break;
        }
    }
    //The down case
    for(let y=i+1;y<grid.length;y++){
        if(!queryGrid(factions,y,j)){
            validMoves.push([y,j]);
        }else if(queryGrid(factions,y,j) === oppositeFaction){
            validTakes.push([y,j]);
            break;
        }else{
            break;
        }
    }
    //The right case
    for(let x=j+1;x<grid[0].length;x++){
        if(!queryGrid(factions,i,x)){
            validMoves.push([i,x]);
        }else if(queryGrid(factions,i,x) === oppositeFaction){
            validTakes.push([i,x]);
            break;
        }else{
            break;
        }
    }
    //The left case
    for(let x=j-1;x>=0;x--){
        if(!queryGrid(factions,i,x)){
            validMoves.push([i,x]);
        }else if(queryGrid(factions,i,x) === oppositeFaction){
            validTakes.push([i,x]);
            break;
        }else{
            break;
        }
    }
}

//Sorts out the moves for the bishops (and the queen's diagonal moves)
function bishopMoves(i,j,oppositeFaction){
    //The north-east case
    for(let m=1;m<5;m++){
        //This if statement checks if we've gone outside the bounds of the grid
        if(j+m >= grid[0].length || i-m < 0){
            break;
        }else if(!queryGrid(factions,i-m,j+m)){
            validMoves.push([i-m,j+m]);
        }else if(queryGrid(factions,i-m,j+m) === oppositeFaction){
            validTakes.push([i-m,j+m]);
            break;
        }else{
            break;
        }
    }
    //The north-west case
    for(let m=1;m<5;m++){
        //This if statement checks if we've gone outside the bounds of the grid
        if(j-m < 0 || i-m < 0){
            break;
        }else if(!queryGrid(factions,i-m,j-m)){
            validMoves.push([i-m,j-m]);
        }else if(queryGrid(factions,i-m,j-m) === oppositeFaction){
            validTakes.push([i-m,j-m]);
            break;
        }else{
            break;
        }
    }
    //The south-east case
    for(let m=1;m<5;m++){
        //This if statement checks if we've gone outside the bounds of the grid
        if(j+m >= grid[0].length || i+m >= grid.length){
            break;
        }else if(!queryGrid(factions,i+m,j+m)){
            validMoves.push([i+m,j+m]);
        }else if(queryGrid(factions,i+m,j+m) === oppositeFaction){
            validTakes.push([i+m,j+m]);
            break;
        }else{
            break;
        }
    }
    //The south-west case
    for(let m=1;m<5;m++){
        //This if statement checks if we've gone outside the bounds of the grid
        if(j-m < 0 || i+m >= grid.length){
            break;
        }else if(!queryGrid(factions,i+m,j-m)){
            validMoves.push([i+m,j-m]);
        }else if(queryGrid(factions,i+m,j-m) === oppositeFaction){
            validTakes.push([i+m,j-m]);
            break;
        }else{
            break;
        }
    }
}

//Input the co-ordinates of selected piece, the opposite faction, and an array (checks) of all cells we can potentially move to or take
function specificMovesCalc(i,j, oppositeFaction, checks){
    for(let x=0;x<checks.length;x++){
        if(!queryGrid(factions,checks[x][0],checks[x][1])){
            //No piece there so it's a valid move
            validMoves.push(checks[x]);
        }else if(queryGrid(factions,checks[x][0],checks[x][1])===oppositeFaction){
            validTakes.push(checks[x]);
        }
    }
}


//Returns the string for the icon element of the piece at the given co-ordinates
function getPieceIcon(i,j){
    piece = queryGrid(pieces,i,j);
    faction=queryGrid(factions,i,j);
    if(!piece || !faction){
        //Return empty if no piece there
        return ``;
    }
    else if(faction==="white"){
        switch(piece){
            case "pawn":
                return pawnWhite;
            case "rook":
                return rookWhite;
            case "knight":
                return knightWhite;
            case "bishop":
                return bishopWhite;
            case "queen":
                return queenWhite;
            case "king":
                return kingWhite;
            default:
                return ``;
        }
    }else{
        switch(piece){
            case "pawn":
                return pawnBlack;
            case "rook":
                return rookBlack;
            case "knight":
                return knightBlack;
            case "bishop":
                return bishopBlack;
            case "queen":
                return queenBlack;
            case "king":
                return kingBlack;
            default:
                return ``;
        }
    }
}

//Returns the i,j th element of the input grid or null if it's out of bounds
function queryGrid(grid,i,j){
    if(i>=grid.length || i<0){
        return null;
    }else if(j<0 || j>=grid[0].length){
        return null;
    }
    return grid[i][j];
}


//functions for highlighting and unhighlighting the current valid moves
function highlightMoves(){
    if(selectedPiece){
        setBackground(selectedPiece[0],selectedPiece[1],selected_color);
    }
    //Colour valid moves aqua
    for(let i=0;i<validMoves.length;i++){
        setBackground(validMoves[i][0],validMoves[i][1],move_color);
    }
    //Colour valid takes red (overrides move colour when necessary)
    for(let i=0;i<validTakes.length;i++){
        setBackground(validTakes[i][0],validTakes[i][1],attack_color);
    }
}
function deselectMoves(){
    //Resets cell colour
    if(selectedPiece){
        setBackground(selectedPiece[0],selectedPiece[1],cell_color);
    }
    for(let i=0;i<validMoves.length;i++){
        setBackground(validMoves[i][0],validMoves[i][1],cell_color);
    }
    for(let i=0;i<validTakes.length;i++){
        setBackground(validTakes[i][0],validTakes[i][1],cell_color);
    }
    //Empties the valid moves array
    validMoves = new Array(0);
    //Empties the valid takes array
    validTakes = new Array(0);
    //Resets selected piece
    selectedPiece=null;
}

function endTurn(){
    deselectMoves();
    //Swap turns
    if(turn===1){
        whiteTurn();
    }else{
        blackTurn();
    }
}


function setBackground(i,j, color){
    if(i<0 || i>=backgroundColorGrid.length || j<0 || j>=backgroundColorGrid[i].length){
        return;
    }
    backgroundColorGrid[i][j]=color;
    colorCell(i,j, color);
}

function colorCell(i,j, color){
    if(i<0 || i>=grid.length || j<0 || j>=grid[i].length){
        return;
    }
    grid[i][j].style.backgroundColor = color;
}


function cellClicked(i,j){
    //If we're not currently selecting a piece, then select it
    if(!selectedPiece){
        selectMoves(i,j);
    }else{
        //If it's a valid move or take, then move the piece there
        if(isValidMoveOrTake(i,j)){
            //Reference the taken piece. We use this to see if the king has been captured.
            takenPiece=pieces[i][j];
            takenFaction=factions[i][j];

            //Move our piece to new position
            pieces[i][j] = pieces[selectedPiece[0]][selectedPiece[1]];
            //Move our faction to new position
            factions[i][j] = factions[selectedPiece[0]][selectedPiece[1]];
            //Empty our previous position
            pieces[selectedPiece[0]][selectedPiece[1]] = null;
            //Empty our previous faction
            factions[selectedPiece[0]][selectedPiece[1]] = null;
            //Update the icons
            grid[i][j].innerHTML = getPieceIcon(i,j);
            grid[selectedPiece[0]][selectedPiece[1]].innerHTML = getPieceIcon(selectedPiece[0],selectedPiece[1]);

            //Check if game is won
            if(takenPiece==="king"){
                gameWin(takenFaction);
                deselectMoves();
            }else{
            //end the turn
            endTurn();
            }
        }
    }
}

//Function for when the input faction loses their king
function gameWin(losing_faction){
    winner = "Black";
    if(losing_faction==="black"){
        winner="White";
    }
    setTimeout(delayedWinMessage,100);
}
function delayedWinMessage(){
    let message=`${winner} Wins!`;
    alert(message);
    setupGame();
}

//Returns true if input cell i,j is a valid move or take
function isValidMoveOrTake(i,j){
    return (validTakes.some(e=> e[0]==i && e[1]==j) || validMoves.some(e=> e[0]==i && e[1]==j));
}

//Color parameter must be a string
function colorText(color){
    for(let i=0;i<textElements.length;i++){
        textElements[i].style.color = color;
    }
}

function whiteTurn(){
    turn=0;
    colorText("black");
    document.querySelector("body").style.backgroundColor = "rgb(240,240,240)";
    document.getElementById("black_turn").classList.add("hidden");
    document.getElementById("white_turn").classList.remove("hidden");
}

function blackTurn(){
    turn=1;
    colorText("rgb(240,240,240)");
    document.querySelector("body").style.backgroundColor = "rgb(50,50,50)";
    document.getElementById("black_turn").classList.remove("hidden");
    document.getElementById("white_turn").classList.add("hidden");
}

