$(document).ready(() => {

//grabbing each clickable square
const $addShip = $('.addShip');
//grab our ship selection form - this displays all ships that are left to place
let $currentShipsToPlace = $("#ship-choice")
//this is grabbing the val of our form e.g. Carrier
let $currentSelectedShip = $currentShipsToPlace.val().toLowerCase()
//define the benchmark for ship sizes
const carrierSize = 5;
const battleShipSize = 4;
const cruiserSize = 3;
const submarineSize = 3;
const destroyerSize = 2;

//define the remaining placements for ships
let remCarrierSize = 5;
let remBattleShipSize = 4;
let remCruiserSize = 3;
let remSubmarineSize = 3;
let remDestroyerSize = 2;

//defining and holding the players ship position //how do we send this over to another player/AI?
const carrierPos = [];
const battleShipPos = [];
const cruiserPos = [];
const submarinePos = [];
const destroyerPos = [];


//READY PHASE - The player will pick where their 5 ships need to be on the board

//we need to be listening for what ship the player wants to pick
//we need an event listener on our form!
//we need to grab the val from the selection form data


// let $currentShipToPlace = $("#ship-choice").val()
// console.log($currentShipToPlace);

// I am going to do the player selection based on Starting Point, Ending Point

//we need an event listener for our form too
//testin
console.log($currentSelectedShip + "outside of listener")

$currentShipsToPlace.change(function(){
  // console.log($(this).val())
  $currentSelectedShip = $(this).val().toLowerCase()
  console.log($currentSelectedShip)
})


$addShip.click(function(evt) {
  console.log($currentSelectedShip)
  $(this).addClass(`${$currentSelectedShip}`)
})


// I am going to do the player selection based on Starting Point, Ending Point
// 11:43
// so the UI will go to player Pick a starting point (for your selected ship)
// 11:44
// so if its carrier say you place it on square A1, my reference #ID for that square in P1 board will be 0,0
// 11:44
// so then the logic will go based on size of selected ship potential endpoints will be current co-ordinates
// 11:44
// check if its edge of the board!?
// 11:45
// and then do + 0, SizeOfShip and SizeofShip, 0
// 11:45
// so that should for a carrier translate into like 0,5
// 11:45
// or 5,0
// 11:46
// and then logic (if a player does not click on 0,5 || 5,0 then return error (you have not selected a valid endpoint) else { ship === placed}
// 11:47
// and then store all the coordinates in an array so a carrier could look like = [0,0, 0,1, 0,2, 0,3, 04] (psuedocode)
// 11:47
// and so in the "play" phase we could say when player clicks one square go through each ship and check each array if the input class [0,0] is included in any array
// 11:48
// if its included 







});