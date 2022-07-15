//-------------
//- DONUT CHART -
//-------------
// Get context with jQuery - using jQuery's .get() method.
var donutChartGamesByPlayform = $('#game-stats-by-platform').get(0).getContext('2d')
var donutDataGamesByPlatform = {
  labels: [
    'Arcade (8)',
    'Game Boy (7)',
    'Game Boy Advance (6)',
    'GameCube (2)',
    'Nintendo DS (9)',
    'Nintendo 3DS (8)',
    'Nintendo Switch (5)',
    'Nintendo Wii (4)',
    'Nintendo WiiU (13)',
    'Nintendo 64 (1)',
    'PC (27)',
    'PlayStation (16)',
    'PlayStation 2 (10)',
    'PlayStation 3 (17)',
    'PlayStation 4 (27)',
    'PlayStation 5 (1)',
    'SNES (2)',
    'Xbox (7)',
    'Xbox 360 (17)',
    'ZX Spectrum (2)',
  ],
  datasets: [
    {
      data: [
        8, // Arcade
        7, // Game Boy
        6, // Game Boy Advance
        2, // GameCube
        9, // Nintendo DS
        8, // Nintendo 3DS
        5, // Nintendo Switch
        4, // Nintendo Wii
        13, // Nintendo WiiU
        1, // Nintendo 64
        27, // PC
        16, // PlayStation
        10, // PlayStation 2
        17, // PlayStation 3
        27, // PlayStation 4
        1, // PlayStation 5
        2, // SNES
        7, // Xbox
        17, // Xbox 360
        2 // ZX Spectrum
      ],
      backgroundColor : [
        '#949425', // Arcade
        '#8654d1', // Game Boy
        '#4b297d', // Game Boy Advance
        '#ebab09', // GameCube
        '#b18aeb', // Nintendo DS
        '#8b70b3', // Nintendo 3DS
        '#4b3b63', // Nintendo Switch
        '#d61327', // Nintendo Wii
        '#a31d2b', // Nintendo WiiU
        '#d93041', // Nintendo 64
        '#333333', // PC
        '#2510e0', // PlayStation
        '#392abd', // PlayStation 2
        '#3d3391', // PlayStation 3
        '#665cbe', // PlayStation 4
        '#444aaa', // PlayStation 5
        '#f20a21', // SNES
        '#9bc848', // Xbox
        '#7ca138', // Xbox 360
        '#aaaaaa' // ZX Spectrum
      ],
    }
  ]
}
var donutOptions = {
  maintainAspectRatio : false,
  responsive : true,
}
//Create pie or douhnut chart
// You can switch between pie and doughnut using the method below.
var donutChartOutfit = new Chart(donutChartGamesByPlayform, {
  type: 'doughnut',
  data: donutDataGamesByPlatform,
  options: donutOptions
});
