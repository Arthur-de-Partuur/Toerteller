// Project types and their usual parts. "on" = ticked by default when starting a project.
// "pair" = the parts are knitted twice (left and right), e.g. socks and mittens.
// Add a type or part here in both languages; custom parts can always be added in the app.
self.TT_TYPES = [
  { key: 'sweater', icon: '🧶', nl: 'Trui', en: 'Sweater', parts: [
    { nl: 'Achterpand', en: 'Back', on: true },
    { nl: 'Voorpand', en: 'Front', on: true },
    { nl: 'Mouw links', en: 'Left sleeve', on: true },
    { nl: 'Mouw rechts', en: 'Right sleeve', on: true },
    { nl: 'Halsboord', en: 'Neckband', on: true },
    { nl: 'Pas', en: 'Yoke', on: false },
    { nl: 'Kraag', en: 'Collar', on: false },
    { nl: 'Capuchon', en: 'Hood', on: false },
    { nl: 'Zakken', en: 'Pockets', on: false }
  ] },
  { key: 'cardigan', icon: '🧥', nl: 'Vest', en: 'Cardigan', parts: [
    { nl: 'Achterpand', en: 'Back', on: true },
    { nl: 'Linker voorpand', en: 'Left front', on: true },
    { nl: 'Rechter voorpand', en: 'Right front', on: true },
    { nl: 'Mouw links', en: 'Left sleeve', on: true },
    { nl: 'Mouw rechts', en: 'Right sleeve', on: true },
    { nl: 'Knoopsluiting / biesje', en: 'Button band', on: true },
    { nl: 'Kraag', en: 'Collar', on: false },
    { nl: 'Pas', en: 'Yoke', on: false },
    { nl: 'Capuchon', en: 'Hood', on: false },
    { nl: 'Zakken', en: 'Pockets', on: false }
  ] },
  { key: 'socks', icon: '🧦', nl: 'Sokken', en: 'Socks', pair: true, parts: [
    { nl: 'Boord', en: 'Cuff', on: true },
    { nl: 'Schacht', en: 'Leg', on: true },
    { nl: 'Hielstuk', en: 'Heel flap', on: true },
    { nl: 'Hiel', en: 'Heel turn', on: true },
    { nl: 'Hielspie', en: 'Gusset', on: true },
    { nl: 'Voet', en: 'Foot', on: true },
    { nl: 'Teen', en: 'Toe', on: true }
  ] },
  { key: 'hat', icon: '👒', nl: 'Muts', en: 'Hat', parts: [
    { nl: 'Boord / rand', en: 'Brim', on: true },
    { nl: 'Lijf', en: 'Body', on: true },
    { nl: 'Kruin', en: 'Crown', on: true }
  ] },
  { key: 'mittens', icon: '🧤', nl: 'Wanten / handschoenen', en: 'Mittens / gloves', pair: true, parts: [
    { nl: 'Boord', en: 'Cuff', on: true },
    { nl: 'Hand', en: 'Hand', on: true },
    { nl: 'Duim', en: 'Thumb', on: true },
    { nl: 'Vingers', en: 'Fingers', on: false }
  ] },
  { key: 'scarf', icon: '🧣', nl: 'Sjaal', en: 'Scarf', parts: [
    { nl: 'Sjaal', en: 'Scarf', on: true },
    { nl: 'Rand', en: 'Border', on: false }
  ] },
  { key: 'shawl', icon: '🔺', nl: 'Omslagdoek', en: 'Shawl', parts: [
    { nl: 'Lijf', en: 'Body', on: true },
    { nl: 'Rand', en: 'Border', on: true }
  ] },
  { key: 'blanket', icon: '🛏️', nl: 'Deken', en: 'Blanket', parts: [
    { nl: 'Lapjes / panelen', en: 'Squares / panels', on: true },
    { nl: 'Rand', en: 'Border', on: true }
  ] },
  { key: 'other', icon: '✨', nl: 'Anders', en: 'Other', parts: [] }
];
