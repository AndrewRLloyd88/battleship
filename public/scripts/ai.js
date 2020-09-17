//----------------------------------------------------------------------------------------------------------------------
////////////////////////////////////////// AI LOGIC //////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//keep track of AI ships

$(document).ready(() => {
 
  const aiBoard = [
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
  ]

  const aiShipsSunk = {
    carrier: false,
    battleship: false,
    cruiser: false,
    submarine: false,
    destroyer: false
  }

  const aiShipsPlaced = {
    carrier: false,
    battleship: false,
    cruiser: false,
    submarine: false,
    destroyer: false
  }

  const aiShipsLength = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2
  }


  const placeAIShips = (length, ship) => {
    let randX = Math.floor(Math.random() * 10);
    let randY = Math.floor(Math.random() * 10);
    const $eship = `${randX},${randY}`
    console.log($eship);
    //we will remove this, it's just to visually test
    $(`.${$eship[0]}\\,${$eship[2]}`).addClass(`${ship}`)

    }


  const buildAIboard = () => {
    //iterate through our list of ships
    for (ships in aiShipsLength) {
      const aiShipToPlace = ships;
      const length = aiShipsLength[ships];
      // console.log(aiShipsLength)
      // console.log(length)
      placeAIShips(length, aiShipToPlace);

    }
  }


  //build AI board


//AI build board

buildAIboard();


  // letRandX = Math.floor(Math.random() * 
  // }

  //disable clicks on human player

  //enable clicks on opposite board

  //show turn markers

  //have turns

  //ai needs to be able to do something in a turn randomly







});