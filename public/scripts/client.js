//needed for jQuery and eslint
/* global document */
/* eslint-env jquery */

$(document).ready(() => {

  //helper that defines the selected ships size
  const defineShipSize = (shipSize, currentSelectedSize) => {
    const shipSizes = {
      carrierSize: 5,
      battleshipSize: 4,
      cruiserSize: 3,
      submarineSize: 3,
      destroyerSize: 2
    };

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
  };

  //grabbing each clickable square
  const $addShip = $('.addShip');
  //grab our ship selection form - this displays all ships that are left to place
  let $currentShipsToPlace = $("#ship-choice");
  //this is grabbing the val of our form e.g. Carrier
  let $currentSelectedShip = $currentShipsToPlace.val().toLowerCase();

  //grab our cancel button
  const $cancelButton = $('#cancel');

  //grab our move ship button
  const $moveShip = $('#replace');

  //grab our warning message section
  const $warning = $('#warning');

  //define the remaining ship size by doing stored remCarrierSize - carrierSize?
  let currentSelectedSize = `${$currentSelectedShip}Size`;
  let shipSize = 0;

  let endPoints = [];
  let curEndpoint = "";

  //defining and holding the players ship position //how do we send this over to another player/AI?
  const playersShipsPos = {};
  //has our player placed a class of ship?
  const playersPlacedShips = {
    carrier: false,
    battleship: false,
    cruiser: false,
    submarine: false,
    destroyer: false
  };

  //defining the ships size first
  shipSize = defineShipSize(shipSize, currentSelectedSize);
  // console.log(shipSize, " On Document Ready");




  //we need to set a start and a potential end point
  //A1 or 0,0 would translate to 0,5 / 5,0 for a carrier - 0,2, 2,0 for a destroyer
  let startPoint = "";

  //we need a boolean to track our states
  let isPlacingShip = false;

  $warning.text("Please place your " + $currentSelectedShip + "'s starting position");
  //READY PHASE - The player will pick where their 5 ships need to be on the board

  //listen for what ships the player wants to pick
  $currentShipsToPlace.change(function() {
    // console.log($(this).val())
    //Any time a different ship is picked we need to update this from the form value
    $currentSelectedShip = $(this).val().toLowerCase();
    //we need to update it's selected size
    currentSelectedSize = `${$currentSelectedShip}Size`;
    // we need to update the ships size variable we will use to track our players positioning
    shipSize = defineShipSize(shipSize, currentSelectedSize);
    // console.log(shipSize, " updated in form listener to be our " + $currentSelectedShip + " size");
    //update our warning text message to user
    $warning.text("Please place your " + $currentSelectedShip);

    //we need some logic to stop this from being selected upon a placement/bar illegal placements later
  });


  //listening for a player to click for any particular ship
  $addShip.click(function(evt) {
    // I am going to do the player selection based on Starting Point, Ending Point
    // has the player already placed this ship
    if (playersPlacedShips[`${$currentSelectedShip}`] === true) {
      $warning.text("You have already placed this ship");
      return;
    }
    //is the player placing a ship?
    if (!isPlacingShip) {
      // console.log($currentSelectedShip)
      //make our form invisible
      $currentShipsToPlace.addClass('hidden');
      //change our message to user
      $warning.text("Please place your " + $currentSelectedShip + "'s ending position");
      //adds that colour to the square
      $(this).addClass(`${$currentSelectedShip}`);
      //make the starting position the current grid square by ID
      startPoint = $(this).attr("id");
      // currentShipToChart.push(startPoint);
      console.log(startPoint);
      playersShipsPos[$currentSelectedShip] = [startPoint];
      console.log(playersShipsPos);
      //we need to set the switch on to indicate we are placing a ship
      isPlacingShip = true;
      //we need to calculate end placements
      endPoints = calculateEndPlacements(startPoint, shipSize, playersShipsPos);
      // console.log("in click: ", endPoints)
      renderEndPlacements(endPoints);
      //show cancel button
      $cancelButton.removeClass("hidden");


      //are we placing an endpoint?
    } else {
      //calculate and display selected end placements for ships
      console.log("in else");
      //check the player has legally placed the piece
      if (checkLegalPlacement(endPoints, evt)) {
        //add the current endpoint to our array
        playersShipsPos[$currentSelectedShip].push(curEndpoint);
        console.log(playersShipsPos);
        //make a function to fill in the dots dependent on size of ship
        console.log(shipSize);
        if (shipSize !== 2) {
          //run our new function to fill in the dots
          addShipToArray($currentSelectedShip, playersShipsPos);
        }
        console.log("past the if!");
        //remove rendering for ships
        $(this).removeClass(`${$currentSelectedShip}`);
        //remove endplacement template
        removeEndPlacements(endPoints);
        //render the ship onto the board once legal
        renderShip(playersShipsPos, $currentSelectedShip);
        //set this ship to true in our tracker - we have successfully placed it
        playersPlacedShips[`${$currentSelectedShip}`] = true;
        console.log(playersPlacedShips);
        isPlacingShip = false;
        $currentShipsToPlace.removeClass('hidden');
      }
    }
  });

  // function that takes in the ship, the length, the id of the square etc?
  const renderShip = (playersShipsPos, $currentSelectedShip) => {
    console.log("hey im in renderShip");
    //check where the starting coords are
    console.log(playersShipsPos[`${$currentSelectedShip}`]);
    const shipToRender = playersShipsPos[`${$currentSelectedShip}`];
    for (const coords of shipToRender) {
      console.log(coords);
      $(`#${coords[0]}\\,${coords[2]}`).addClass(`${$currentSelectedShip}`);
    }
    return;
  };

  //calculates on our board legal placements for each ship
  //we need to modify this function to take account of existing ships
  const calculateEndPlacements = (startPoint, shipSize, playersShipsPos) => {
    let defaultStartX = Number(startPoint[0]);
    let defaultStartY = Number(startPoint[2]);

    let startX = Number(startPoint[0]);
    let startY = Number(startPoint[2]);

    let negStartX = Number(startPoint[0]);
    let negStartY = Number(startPoint[2]);

    let newEndpoint = [];
    shipSize = shipSize - 1;

    const existingPlacements = [];
    //we can base our end placements off the ship size the starting point and determine the end point
    // console.log(typeof startPoint);
    // console.log(startX, startY);
    // console.log(shipSize)
    //we need to look 4 directions to say where can the legal endpoints of the ship be?
    // could we put all of these actions in a loop to lose the repetitive code?
    //consider using helper functions and passing the values via these?


    //does it intersect with another ship
    for (const ships in playersShipsPos) {
      existingPlacements.push(...playersShipsPos[ships]);
    }
    console.log("intersection check: ", existingPlacements);

    //will the selected place intersect with another ship

    //check X+
    if (defaultStartX + shipSize > 9) {
      startX = null;
      //we need a new function to check intersections
    } else {
      startX += shipSize;
    }
    //check Y+
    if (defaultStartY + shipSize > 9) {
      startY = null;
    } else {
      startY += shipSize;
    }

    // console.log("defaultStartX - shipSize: =  ", defaultStartX - shipSize)
    // console.log("defaultStartX - shipSize: =  ", defaultStartX - shipSize < 0)
    //check -X
    if (defaultStartX - shipSize < 0) {
      negStartX = null;
    } else {
      negStartX -= shipSize;
      // console.log(negStartX + " in else")
    }
    //check Y-
    if (defaultStartY - shipSize < 0) {
      negStartY = null;
    } else {
      negStartY -= shipSize;
    }

    // console.log("+x: " + startX)
    // console.log("+y: " + startY)
    // console.log("-x: " + negStartX)
    // console.log("-y: " + negStartY)

    //are we in the middle? is our X or -X axis Valid?
    if (startX !== null) {
      // console.log("We are IN THE MIDDLE X is: " + startX, "Y is: " + defaultStartY);
      newEndpoint.push(`${startX},${defaultStartY}`);
    }

    if (negStartX !== null) {
      // console.log("We are IN THE MIDDLE X is: " + negStartX, "Y is: " + defaultStartY);
      newEndpoint.push(`${negStartX},${defaultStartY}`);
    }

    //are we in the middle? is our X or -X axis Valid?
    if (startY !== null) {
      // console.log("We are IN THE MIDDLE X is: " + defaultStartX, "Y is: " + startY);
      newEndpoint.push(`${defaultStartX},${startY}`);
    }

    if (negStartY !== null) {
      // console.log("We are IN THE MIDDLE X is: " + defaultStartX, "Y is: " + negStartY);
      newEndpoint.push(`${defaultStartX},${negStartY}`);
    }
    // console.log(newEndpoint);
    return newEndpoint;
  };

  //renders the highlights on the board showing where the legal endpoints are
  const renderEndPlacements = (endPoints) => {
    // console.log(endPoints)
    for (const coords of endPoints) {
      // console.log(coords)
      // console.log(`${coords}`)
      // console.log(`#${coords[0]}\\,${coords[2]}`)
      //we must use escape characters to use our co-ords
      $(`#${coords[0]}\\,${coords[2]}`).addClass("highlight");
    }
  };

  //removes highlights after player is done picking an end point
  const removeEndPlacements = (endPoints) => {
    for (const coords of endPoints) {
      $(`#${coords[0]}\\,${coords[2]}`).removeClass("highlight");
    }
    return;
  };


  //checks the player is not trying to do an L ship or Diagonal
  const checkLegalPlacement = (endPoints, evt) => {
    // console.log(evt.target.id);
    if (!endPoints.includes(evt.target.id)) {
      //show warning message
      console.log("YOU MUST PLACE YOUR SHIPS LEGALLY");
      $warning.text("Please place your ship at the displayed endpoints or press cancel to undo");
      //we need to return a falsey value
      return false;
    } else {
      //we work out the logic to draw the ship
      curEndpoint = evt.target.id;
      console.log("Good Boi");
      $warning.text("");
      //we need to return a truthy value
      return true;
    }
  };

  //fills in the dots for the players Ships using the start and endpoints
  const addShipToArray = ($currentSelectedShip, playersShipsPos) => {
    const arr = [];
    const [startPos, endPos] = (playersShipsPos[`${$currentSelectedShip}`]);
    console.log(startPos, endPos);


    //is 4,3 < 0,3 //CHECKING NEGATIVE X ?
    //the player has placed right to left
    if (startPos[0] > endPos[0]) {
      console.log("minX is more than maxX");
      //will write out such output to the arr as [3,3, 2,3, 1,3, 0,3]
      for (let i = startPos[0]; i >= endPos[0]; i--) {
        console.log(i);
        if (!playersShipsPos[`${$currentSelectedShip}`].includes(`${i},${startPos[2]}`)) {
          playersShipsPos[`${$currentSelectedShip}`].push(`${i},${startPos[2]}`);
        }
      }
      playersShipsPos[`${$currentSelectedShip}`].sort();
      console.log(playersShipsPos);
      return playersShipsPos;
    }

    //is 4,3 < 0,3 //CHECKING NEGATIVE X ?
    //the player has placed left to right
    if (endPos[0] > startPos[0]) {
      console.log("endpos[0] is greater than startpos[0]");
      //will write out such output to the arr as [3,3, 2,3, 1,3, 0,3]
      for (let i = startPos[0]; i < endPos[0]; i++) {
        console.log(i);
        if (!playersShipsPos[`${$currentSelectedShip}`].includes(`${i},${startPos[2]}`)) {
          playersShipsPos[`${$currentSelectedShip}`].push(`${i},${startPos[2]}`);
        }
      }
      playersShipsPos[`${$currentSelectedShip}`].sort();
      console.log(playersShipsPos);
      return playersShipsPos;
    }

    //is 4,4 > 4,0 //CHECKING POSITIVE Y ?
    //the player has placed from top to bottom
    if (endPos[2] > startPos[2]) {
      console.log("endpos[2] is more than startpos[2]");
      //will write out such output to the arr as [3,3, 2,3, 1,3, 0,3]
      for (let i = startPos[2]; i < endPos[2]; i++) {
        console.log(i);
        if (!playersShipsPos[`${$currentSelectedShip}`].includes(`${startPos[0]},${i}`)) {
          playersShipsPos[`${$currentSelectedShip}`].push(`${startPos[0]},${i}`);
        }
      }
      playersShipsPos[`${$currentSelectedShip}`].sort();
      console.log(playersShipsPos);
      return playersShipsPos;
    }

    //is 4,0 < 4,4 //CHECKING POSITIVE Y ?
    //the player has placed from top to bottom
    if (startPos[2] > endPos[2]) {
      console.log("we have placed bottom to top");
      //will write out such output to the arr as [3,3, 2,3, 1,3, 0,3]
      for (let i = endPos[2]; i < startPos[2]; i++) {
        console.log(i);
        if (!playersShipsPos[`${$currentSelectedShip}`].includes(`${startPos[0]},${i}`)) {
          playersShipsPos[`${$currentSelectedShip}`].push(`${startPos[0]},${i}`);
        }
      }
      playersShipsPos[`${$currentSelectedShip}`].sort();
      console.log(playersShipsPos);
      return playersShipsPos;
    }
  };


  // 11:47
  // and so in the "play" phase we could say when player clicks one square go through each ship and check each array if the input class [0,0] is included in any array
  // 11:48
  // if its included







});