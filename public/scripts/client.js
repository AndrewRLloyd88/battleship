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
      if (currentSelectedSize === key) {
        //this intially sets the value of our ships size
        shipSize = shipSizes[key];
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

  //we are dyanmically setting a variable from our form e.g. carrierSize - this is checked in defineShipSize()
  let currentSelectedSize = `${$currentSelectedShip}Size`;
  let shipSize = 0;

  //this is where we store our endpoints when player is placing the ship
  let endPoints = [];
  //this keeps track of our selected endpoint - used to check player is not trying to misplace ships! 
  //curEndPoint === evt.target.id
  let curEndpoint = "";

  //defining and holding the players ship position //how do we send this over to another player/AI?
  const playersShipsPos = {};
  //has our player placed a class of ship? - we keep track of this here
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


  //used when placing a ship need conditional logic here to check if ship has already been placed
  $warning.text("Please place your " + $currentSelectedShip + "'s starting position");
  //READY PHASE - The player will pick where their 5 ships need to be on the board

  //listen for what ships the player wants to pick
  $currentShipsToPlace.change(function () {
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


  $cancelButton.click(function (evt) {
    console.log("cancel");
    cancelPlacement(startPoint, endPoints, playersShipsPos, $currentSelectedShip);
  })

  //listening for a player to click for any particular ship
  $addShip.click(function (evt) {
    // I am going to do the player selection based on Starting Point, Ending Point
    // has the player already placed this ship
    if (playersPlacedShips[`${$currentSelectedShip}`] === true) {
      $warning.text("You have already placed this ship");
      return;
    }

    if (!checkNotOverlapping(playersShipsPos, evt)) {
      $warning.text("Please don't place your ship on top of another ship");
      return;
    }
    //is the player placing a ship?
    if (!isPlacingShip) {
      //make our form invisible
      $currentShipsToPlace.addClass('hidden');
      //change our message to user
      $warning.text("Please place your " + $currentSelectedShip + "'s ending position");
      //adds that colour to the square
      $(this).addClass(`${$currentSelectedShip}`);
      //make the starting position the current grid square by ID
      startPoint = $(this).attr("id");
      // currentShipToChart.push(startPoint);
      playersShipsPos[$currentSelectedShip] = [startPoint];
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
      //check the player has legally placed the piece
      if (checkLegalPlacement(endPoints, evt)) {
        //add the current endpoint to our array
        playersShipsPos[$currentSelectedShip].push(curEndpoint);
        //make a function to fill in the dots dependent on size of ship
        if (shipSize !== 2) {
          //run our new function to fill in the dots
          addShipToArray($currentSelectedShip, playersShipsPos);
        }
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
        //show our form again
        $currentShipsToPlace.removeClass('hidden');
        //make our cancel button hidden
        $cancelButton.addClass("hidden");
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
  const calculateEndPlacements = (startPoint, shipSize, playersShipsPos) => {
    //keeping track of our original X and Y position
    let defaultStartX = Number(startPoint[0]);
    let defaultStartY = Number(startPoint[2]);
    //test these for +X and Y coords
    let startX = Number(startPoint[0]);
    let startY = Number(startPoint[2]);
    //test these for -X and -Y coords
    let negStartX = Number(startPoint[0]);
    let negStartY = Number(startPoint[2]);
    //this will hold our basic endpoints before checking for overlapping ships
    let newEndpoint = [];
    //we don't need to include our start position so ship size - 1
    shipSize = shipSize - 1;

    //we can base our end placements off the ship size the starting point and determine the end point
    //we need to look in 4 directions to say where can the legal endpoints of the ship be?
    // could we put all of these actions in a loop to lose the repetitive code?
    //consider using helper functions and passing the values via these?

    //check +X
    if (defaultStartX + shipSize > 9) {
      startX = null;
      //we need a new function to check intersections
    } else {
      startX += shipSize;
    }
    //check +Y
    if (defaultStartY + shipSize > 9) {
      startY = null;
    } else {
      startY += shipSize;
    }

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

    //are we in the middle? is our X or -X axis Valid?
    if (startX !== null) {
      newEndpoint.push(`${startX},${defaultStartY}`);
    }

    if (negStartX !== null) {
      newEndpoint.push(`${negStartX},${defaultStartY}`);
    }

    //are we in the middle? is our X or -X axis Valid?
    if (startY !== null) {
      newEndpoint.push(`${defaultStartX},${startY}`);
    }

    if (negStartY !== null) {
      newEndpoint.push(`${defaultStartX},${negStartY}`);
    }


    //will the selected place intersect with another ship
    return checkEndsNotIntersect(newEndpoint, playersShipsPos);
  };

  //renders the highlights on the board showing where the legal endpoints are
  const renderEndPlacements = (endPoints) => {
    for (const coords of endPoints) {
      //draw suggested placements on screen for player (yellowgreen)
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
      $warning.text("");
      //we need to return a truthy value
      return true;
    }
  };

  //fills in the dots for the players Ships using the start and endpoints
  const addShipToArray = ($currentSelectedShip, playersShipsPos) => {
    //we are using startPos and endPos to render our ships path e.g. startpos endpost for $cruiser
    const [startPos, endPos] = (playersShipsPos[`${$currentSelectedShip}`]);

    //is 4,3 < 0,3 //CHECKING NEGATIVE X ?
    //the player has placed right to left
    if (startPos[0] > endPos[0]) {
      //will write out such output to the arr as [3,3, 2,3, 1,3, 0,3]
      for (let i = startPos[0]; i >= endPos[0]; i--) {
        //this pushes the positions into the array if they aren't already there
        if (!playersShipsPos[`${$currentSelectedShip}`].includes(`${i},${startPos[2]}`)) {
          //push the dynamic position into the array in playerShipsPos object
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
      //will write out such output to the arr as [3,3, 2,3, 1,3, 0,3]
      for (let i = startPos[0]; i < endPos[0]; i++) {
        if (!playersShipsPos[`${$currentSelectedShip}`].includes(`${i},${startPos[2]}`)) {
          playersShipsPos[`${$currentSelectedShip}`].push(`${i},${startPos[2]}`);
        }
      }
      playersShipsPos[`${$currentSelectedShip}`].sort();
      return playersShipsPos;
    }

    //is 4,4 > 4,0 //CHECKING POSITIVE Y ?
    //the player has placed from top to bottom
    if (endPos[2] > startPos[2]) {
      //will write out such output to the arr as [3,3, 2,3, 1,3, 0,3]
      for (let i = startPos[2]; i < endPos[2]; i++) {
        if (!playersShipsPos[`${$currentSelectedShip}`].includes(`${startPos[0]},${i}`)) {
          playersShipsPos[`${$currentSelectedShip}`].push(`${startPos[0]},${i}`);
        }
      }
      playersShipsPos[`${$currentSelectedShip}`].sort();
      return playersShipsPos;
    }

    //is 4,0 < 4,4 //CHECKING POSITIVE Y ?
    //the player has placed from top to bottom
    if (startPos[2] > endPos[2]) {
      //will write out such output to the arr as [3,3, 2,3, 1,3, 0,3]
      for (let i = endPos[2]; i < startPos[2]; i++) {
        //if 
        if (!playersShipsPos[`${$currentSelectedShip}`].includes(`${startPos[0]},${i}`)) {
          playersShipsPos[`${$currentSelectedShip}`].push(`${startPos[0]},${i}`);
        }
      }
      //sort the array in order
      playersShipsPos[`${$currentSelectedShip}`].sort();
      return playersShipsPos;
    }
  };

  //we must use logic similar to addShipToArray to check if a path would intersect
  const checkEndsNotIntersect = (newEndpoint, playersShipsPos) => {
    const existingPlacements = [];
    let newEndPoints = [];
    const bannedPoints = [];
    //can we detect if our predicted placements would intersect with an existing ship
    for (const ships in playersShipsPos) {
      //get our current ships placements to test against
      existingPlacements.push(...playersShipsPos[ships]);
    }
    //used to count back from the furthest position away to our starting pos
    const currentPos = existingPlacements[existingPlacements.length - 1]

    //this is needed to ensure the first ship is placed OK we need to go a different path for every other ship
    if (existingPlacements.length > 1) {
      //check all +/-X and +/-Y directions against existing ships to see if there is any intersection
      for (const coords of newEndpoint) {
        const x = coords[0]
        const y = coords[2]
        //check UP from BOTTOM of Board if a suggested path would clip our ships
        if (y > currentPos[2]) {
          for (let i = y; i > currentPos[2]; i--) {
            //does the countback check
            if (existingPlacements.includes(`${currentPos[0]},${i}`)) {
              //push the banned points to coords
              bannedPoints.push(coords);

            }
          }
        }

        //Check DOWN from TOP OF BOARD if a path would clip our existing ships
        if (y < currentPos[2]) {
          for (let i = y; i < currentPos[2]; i++) {
            //does the countback check
            if (existingPlacements.includes(`${currentPos[0]},${i}`)) {
              bannedPoints.push(coords)

            }
          }
        }

        //Check Right to Left
        if (x > currentPos[0]) {
          const index = newEndpoint.indexOf(coords)
          //Check RIGHT to LEFT OF BOARD if a path would clip our existing ships
          for (let i = x; i > currentPos[0]; i--) {
            //does the countback check
            if (existingPlacements.includes(`${i},${currentPos[2]}`)) {
              bannedPoints.push(coords);

            }
          }
        }

        //Check Left
        if (x < currentPos[0]) {
          const index = newEndpoint.indexOf(coords)
          //Check RIGHT to LEFT OF BOARD if a path would clip our existing ships
          for (let i = x; i < currentPos[0]; i++) {
            //does the countback check
            if (existingPlacements.includes(`${i},${currentPos[2]}`)) {
              bannedPoints.push(coords);
            }
          }
        }
      }
      //will end up generating legal endpoints that does not cause ships to overlap
      newEndPoints = newEndpoint.filter((el) => !bannedPoints.includes(el));
      return newEndPoints;
    }
    return newEndpoint;
  }

  //check a placement isn't being placed on top of another ship
  const checkNotOverlapping = (playersShipsPos, evt) => {
    const existingPlacements = []
    //get all of our existing coordinates
    for (const ships in playersShipsPos) {
      //get our current ships placements to test against
      existingPlacements.push(...playersShipsPos[ships]);
    }

    if (existingPlacements.includes(evt.target.id)) {
      return false;
    }
    return true;
  };

  const cancelPlacement = (startPoint, endPoints, playersShipsPos, $currentSelectedShip) => {
    removeEndPlacements(endPoints);
    $(`#${startPoint[0]}\\,${startPoint[2]}`).removeClass()
    playersShipsPos[$currentSelectedShip] = []
    isPlacingShip = false;
    startPoint = "";
    endPoints = [];
    //show our form again
    $currentShipsToPlace.removeClass('hidden');
    //make our cancel button hidden
    $cancelButton.addClass("hidden");
  }









});