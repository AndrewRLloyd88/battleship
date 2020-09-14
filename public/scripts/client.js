$(document).ready(() => {

  //helper that defines the selected ships size
  const defineShipSize = (shipSize, currentSelectedSize) => {
    const shipSizes = {
      carrierSize: 5,
      battleshipSize: 4,
      cruiserSize: 3,
      submarineSize: 3,
      destroyerSize: 2
    }

    for (const key in shipSizes) {
      // console.log(shipSizes[key])
      // console.log(currentSelectedSize, " current selected size")
      // console.log(key, " current key")
      if (currentSelectedSize === key) {
        // console.log("true");
        shipSize = shipSizes[key];
        // console.log(shipSize)
        return shipSize;
      }
    }
  }


  //grabbing each clickable square
  const $addShip = $('.addShip');
  //grab our ship selection form - this displays all ships that are left to place
  let $currentShipsToPlace = $("#ship-choice")
  //this is grabbing the val of our form e.g. Carrier
  let $currentSelectedShip = $currentShipsToPlace.val().toLowerCase()

  //define the remaining ship size by doing stored remCarrierSize - carrierSize?
  let currentSelectedSize = `${$currentSelectedShip}Size`;
  let shipSize = 0;


  shipSize = defineShipSize(shipSize, currentSelectedSize);
  console.log(shipSize, " On Document Ready");

  
  //defining and holding the players ship position //how do we send this over to another player/AI?
  const carrierPos = [];
  const battleShipPos = [];
  const cruiserPos = [];
  const submarinePos = [];
  const destroyerPos = [];

  //we need to set a start and a potential end point
  //A1 or 0,0 would translate to 0,5 / 5,0 for a carrier - 0,2, 2,0 for a destroyer
  let startPoint = "";
  // let endPoints = [];

  //we need a boolean to track our states
  let isPlacingShip = false;


  //READY PHASE - The player will pick where their 5 ships need to be on the board

  //listen for what ships the player wants to pick
  $currentShipsToPlace.change(function () {
    // console.log($(this).val())
    //Any time a different ship is picked we need to update this from the form value
    $currentSelectedShip = $(this).val().toLowerCase();
    //we need to update it's selected size
    currentSelectedSize = `${$currentSelectedShip}Size`;
    // we need to update the ships size variable we will use to track our players positioning
    shipSize = defineShipSize(shipSize, currentSelectedSize);
    console.log(shipSize, " updated in form listener to be our " + $currentSelectedShip + " size");

    //we need some logic to stop this from being selected upon a placement/bar illegal placements later
  });


  //listening for a player to click for any particular ship
  $addShip.click(function (evt) {
    // I am going to do the player selection based on Starting Point, Ending Point
    //is the player placing a ship?
    if (!isPlacingShip) {
      console.log($currentSelectedShip)
      //adds that colour to the square
      $(this).addClass(`${$currentSelectedShip}`)
      //make the starting position the current grid square by ID
      startPoint = $(this).attr("id");
      console.log(startPoint);
      //we need to set the switch on to indicate we are placing a ship
      isPlacingShip = true;
      //we need to calculate end placements
      const endPoints = calculateEndPlacements(startPoint, shipSize);
      console.log("in click: ", endPoints)
      renderEndPlacements(endPoints);
    } else {
      //calculate and display selected end placements for ships

      placeShipTemplate();
    }
  });

  // function that takes in the ship, the length, the id of the square etc?
  const placeShipTemplate = () => {
    //check where the starting coords are
    for (i = 0; i < shipSize; i++) {
      console.log("hello");
    }

  }

  const calculateEndPlacements = (startPoint, shipSize, endPoints) => {
    let defaultStartX = Number(startPoint[0]);
    let defaultStartY = Number(startPoint[2]);

    let startX = Number(startPoint[0]);
    let startY = Number(startPoint[2]);

    let negStartX = Number(startPoint[0]);
    let negStartY = Number(startPoint[2]);

    let newEndpoint = [];
    shipSize = shipSize - 1
    //we can base our end placements off the ship size the starting point and determine the end point
    // console.log(typeof startPoint);
    console.log(startX, startY);
    console.log(shipSize)
    //we need to look 4 directions to say where can the legal endpoints of the ship be?
    // could we put all of these actions in a loop to lose the repetitive code?
    //consider using helper functions and passing the values via these?


    //check X+
    if (defaultStartX + shipSize > 9) {
      startX = null;
    } else {
      startX += shipSize;
    }
    //check Y+
    if (defaultStartY + shipSize > 9) {
      startY = null;
    } else {
      startY += shipSize;
    }

    console.log("defaultStartX - shipSize: =  ", defaultStartX - shipSize)
    console.log("defaultStartX - shipSize: =  ", defaultStartX - shipSize < 0)
    //check -X
    if (defaultStartX - shipSize < 0) {
      negStartX = null;
    } else {
      negStartX -= shipSize;
      console.log(negStartX + " in else")
    }
    //check Y-
    if (defaultStartY - shipSize < 0) {
      negStartY = null;
    } else {
      negStartY -= shipSize;
    }

    console.log("+x: " + startX)
    console.log("+y: " + startY)
    console.log("-x: " + negStartX)
    console.log("-y: " + negStartY)

    //are we in the middle? is our X or -X axis Valid?
    if (startX !== null) {
      console.log("We are IN THE MIDDLE X is: " + startX, "Y is: " + defaultStartY);
      newEndpoint.push(`${startX},${defaultStartY}`)
    }

    if (negStartX !== null) {
      console.log("We are IN THE MIDDLE X is: " + negStartX, "Y is: " + defaultStartY);
      newEndpoint.push(`${negStartX},${defaultStartY}`)
    }

    //are we in the middle? is our X or -X axis Valid?
    if (startY !== null) {
      console.log("We are IN THE MIDDLE X is: " + defaultStartX, "Y is: " + startY);
      newEndpoint.push(`${defaultStartX},${startY}`)
    }

    if (negStartY !== null) {
      console.log("We are IN THE MIDDLE X is: " + defaultStartX, "Y is: " + negStartY);
      newEndpoint.push(`${defaultStartX},${negStartY}`)
    }
    console.log(newEndpoint);
    return newEndpoint;
  }


  const renderEndPlacements = (endPoints) => {
    console.log(endPoints)
    for (coords of endPoints) {
      // console.log(coords)
      // console.log(`${coords}`)
      // console.log(`#${coords[0]}\\,${coords[2]}`)
      //we must use escape characters to use our co-ords
      $(`#${coords[0]}\\,${coords[2]}`).addClass("highlight");
    }
  }


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