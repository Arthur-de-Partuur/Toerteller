// Project types and their usual parts, in every language of the app (nl, en, da, de, no, sv).
// "on" = ticked by default when starting a project.
// "bottomUp" = order of the parts (indexes) when knitted bottom-up; offers a Top-down / Bottom-up choice.
// "like" = joke and behaviour of this similar type (for types knitted in one piece).
// "pair" = the parts are knitted twice (left and right), e.g. socks and mittens.
// Knitting terms checked against DROPS Design patterns (garnstudio.com); custom parts can always be added in the app.
self.TT_TYPES = [
  { key: 'sweater', icon: '🧶', nl: 'Trui', en: 'Sweater', da: 'Sweater', de: 'Pullover', no: 'Genser', sv: 'Tröja', parts: [
    { on: true,  nl: 'Achterpand', en: 'Back', da: 'Ryg', de: 'Rückenteil', no: 'Bakstykke', sv: 'Bakstycke' },
    { on: true,  nl: 'Voorpand', en: 'Front', da: 'Forstykke', de: 'Vorderteil', no: 'Forstykke', sv: 'Framstycke' },
    { on: true,  nl: 'Mouw links', en: 'Left sleeve', da: 'Venstre ærme', de: 'Linker Ärmel', no: 'Venstre erme', sv: 'Vänster ärm' },
    { on: true,  nl: 'Mouw rechts', en: 'Right sleeve', da: 'Højre ærme', de: 'Rechter Ärmel', no: 'Høyre erme', sv: 'Höger ärm' },
    { on: true,  nl: 'Halsboord', en: 'Neckband', da: 'Halskant', de: 'Halsblende', no: 'Halskant', sv: 'Halskant' },
    { on: false, nl: 'Pas', en: 'Yoke', da: 'Bærestykke', de: 'Passe', no: 'Bærestykke', sv: 'Ok' },
    { on: false, nl: 'Kraag', en: 'Collar', da: 'Krave', de: 'Kragen', no: 'Krage', sv: 'Krage' },
    { on: false, nl: 'Capuchon', en: 'Hood', da: 'Hætte', de: 'Kapuze', no: 'Hette', sv: 'Huva' },
    { on: false, nl: 'Zakken', en: 'Pockets', da: 'Lommer', de: 'Taschen', no: 'Lommer', sv: 'Fickor' }
  ] },
  { key: 'sweaterRound', like: 'sweater', bottomUp: [3, 2, 4, 5, 1, 0, 6, 7], icon: '⭕', nl: 'Trui, rondgebreid', en: 'Sweater in the round', da: 'Sweater, rundstrikket', de: 'Pullover, in Runden', no: 'Genser, rundstrikket', sv: 'Tröja, rundstickad', parts: [
    // Knitted in one piece on a circular needle; parts listed top-down, "bottomUp" = the order when knitted from the
    // bottom up (e.g. Icelandic sweater: body and sleeves first, then the yoke). DROPS section names.
    { on: true,  nl: 'Halsboord', en: 'Neckband', da: 'Halskant', de: 'Halsblende', no: 'Halskant', sv: 'Halskant' },
    { on: true,  nl: 'Pas', en: 'Yoke', da: 'Bærestykke', de: 'Passe', no: 'Bærestykke', sv: 'Ok' },
    { on: true,  nl: 'Lijf', en: 'Body', da: 'Bol', de: 'Rumpf', no: 'Bol', sv: 'Kropp' },
    { on: true,  nl: 'Boord onderkant', en: 'Bottom rib', da: 'Rib forneden', de: 'Bündchen unten', no: 'Vrangbord nederst', sv: 'Resår nedtill' },
    { on: true,  nl: 'Mouw links', en: 'Left sleeve', da: 'Venstre ærme', de: 'Linker Ärmel', no: 'Venstre erme', sv: 'Vänster ärm' },
    { on: true,  nl: 'Mouw rechts', en: 'Right sleeve', da: 'Højre ærme', de: 'Rechter Ärmel', no: 'Høyre erme', sv: 'Höger ärm' },
    { on: false, nl: 'Kraag', en: 'Collar', da: 'Krave', de: 'Kragen', no: 'Krage', sv: 'Krage' },
    { on: false, nl: 'Capuchon', en: 'Hood', da: 'Hætte', de: 'Kapuze', no: 'Hette', sv: 'Huva' }
  ] },
  { key: 'cardigan', icon: '🧥', nl: 'Vest', en: 'Cardigan', da: 'Cardigan', de: 'Jacke', no: 'Jakke', sv: 'Kofta', parts: [
    { on: true,  nl: 'Achterpand', en: 'Back', da: 'Ryg', de: 'Rückenteil', no: 'Bakstykke', sv: 'Bakstycke' },
    { on: true,  nl: 'Linker voorpand', en: 'Left front', da: 'Venstre forstykke', de: 'Linkes Vorderteil', no: 'Venstre forstykke', sv: 'Vänster framstycke' },
    { on: true,  nl: 'Rechter voorpand', en: 'Right front', da: 'Højre forstykke', de: 'Rechtes Vorderteil', no: 'Høyre forstykke', sv: 'Höger framstycke' },
    { on: true,  nl: 'Mouw links', en: 'Left sleeve', da: 'Venstre ærme', de: 'Linker Ärmel', no: 'Venstre erme', sv: 'Vänster ärm' },
    { on: true,  nl: 'Mouw rechts', en: 'Right sleeve', da: 'Højre ærme', de: 'Rechter Ärmel', no: 'Høyre erme', sv: 'Höger ärm' },
    { on: true,  nl: 'Knoopsluiting / biesje', en: 'Button band', da: 'Forkant', de: 'Knopfleiste', no: 'Stolpe', sv: 'Framkant' },
    { on: false, nl: 'Kraag', en: 'Collar', da: 'Krave', de: 'Kragen', no: 'Krage', sv: 'Krage' },
    { on: false, nl: 'Pas', en: 'Yoke', da: 'Bærestykke', de: 'Passe', no: 'Bærestykke', sv: 'Ok' },
    { on: false, nl: 'Capuchon', en: 'Hood', da: 'Hætte', de: 'Kapuze', no: 'Hette', sv: 'Huva' },
    { on: false, nl: 'Zakken', en: 'Pockets', da: 'Lommer', de: 'Taschen', no: 'Lommer', sv: 'Fickor' }
  ] },
  { key: 'cardiganOne', like: 'cardigan', bottomUp: [3, 2, 4, 5, 1, 0, 6, 7, 8], icon: '🧵', nl: 'Vest, in één stuk', en: 'Cardigan in one piece', da: 'Cardigan i ét stykke', de: 'Jacke in einem Stück', no: 'Jakke i ett stykke', sv: 'Kofta i ett stycke', parts: [
    // Knitted in one piece on a circular needle (back and forth), top-down or bottom-up.
    { on: true,  nl: 'Halsboord', en: 'Neckband', da: 'Halskant', de: 'Halsblende', no: 'Halskant', sv: 'Halskant' },
    { on: true,  nl: 'Pas', en: 'Yoke', da: 'Bærestykke', de: 'Passe', no: 'Bærestykke', sv: 'Ok' },
    { on: true,  nl: 'Lijf', en: 'Body', da: 'Bol', de: 'Rumpf', no: 'Bol', sv: 'Kropp' },
    { on: true,  nl: 'Boord onderkant', en: 'Bottom rib', da: 'Rib forneden', de: 'Bündchen unten', no: 'Vrangbord nederst', sv: 'Resår nedtill' },
    { on: true,  nl: 'Mouw links', en: 'Left sleeve', da: 'Venstre ærme', de: 'Linker Ärmel', no: 'Venstre erme', sv: 'Vänster ärm' },
    { on: true,  nl: 'Mouw rechts', en: 'Right sleeve', da: 'Højre ærme', de: 'Rechter Ärmel', no: 'Høyre erme', sv: 'Höger ärm' },
    { on: true,  nl: 'Knoopsluiting / biesje', en: 'Button band', da: 'Forkant', de: 'Knopfleiste', no: 'Stolpe', sv: 'Framkant' },
    { on: false, nl: 'Kraag', en: 'Collar', da: 'Krave', de: 'Kragen', no: 'Krage', sv: 'Krage' },
    { on: false, nl: 'Capuchon', en: 'Hood', da: 'Hætte', de: 'Kapuze', no: 'Hette', sv: 'Huva' }
  ] },
  { key: 'socks', icon: '🧦', nl: 'Sokken', en: 'Socks', da: 'Sokker', de: 'Socken', no: 'Sokker', sv: 'Sockor', pair: true, parts: [
    { on: true, nl: 'Boord', en: 'Cuff', da: 'Rib', de: 'Bündchen', no: 'Vrangbord', sv: 'Resår' },
    { on: true, nl: 'Schacht', en: 'Leg', da: 'Skaft', de: 'Schaft', no: 'Skaft', sv: 'Skaft' },
    { on: true, nl: 'Hielstuk', en: 'Heel flap', da: 'Hælkappe', de: 'Fersenwand', no: 'Hælkappe', sv: 'Hällapp' },
    { on: true, nl: 'Hiel', en: 'Heel turn', da: 'Hælindtagning', de: 'Käppchen', no: 'Hælfelling', sv: 'Hälavmaskning' },
    { on: true, nl: 'Hielspie', en: 'Gusset', da: 'Kile', de: 'Zwickel', no: 'Kile', sv: 'Kil' },
    { on: true, nl: 'Voet', en: 'Foot', da: 'Fod', de: 'Fuß', no: 'Fot', sv: 'Fot' },
    { on: true, nl: 'Teen', en: 'Toe', da: 'Tå', de: 'Spitze', no: 'Tå', sv: 'Tå' }
  ] },
  { key: 'hat', icon: '👒', nl: 'Muts', en: 'Hat', da: 'Hue', de: 'Mütze', no: 'Lue', sv: 'Mössa', parts: [
    { on: true, nl: 'Boord / rand', en: 'Brim', da: 'Rib / kant', de: 'Bündchen', no: 'Vrangbord', sv: 'Resår / kant' },
    { on: true, nl: 'Lijf', en: 'Body', da: 'Hue', de: 'Mittelteil', no: 'Lue', sv: 'Mössa' },
    { on: true, nl: 'Kruin', en: 'Crown', da: 'Top (indtagning)', de: 'Abnahmen oben', no: 'Topp (felling)', sv: 'Topp (minskning)' }
  ] },
  { key: 'mittens', icon: '🧤', nl: 'Wanten / handschoenen', en: 'Mittens / gloves', da: 'Luffer / handsker', de: 'Fäustlinge / Handschuhe', no: 'Votter / hansker', sv: 'Vantar / handskar', pair: true, parts: [
    { on: true,  nl: 'Boord', en: 'Cuff', da: 'Rib', de: 'Bündchen', no: 'Vrangbord', sv: 'Resår' },
    { on: true,  nl: 'Hand', en: 'Hand', da: 'Hånd', de: 'Hand', no: 'Hånd', sv: 'Hand' },
    { on: true,  nl: 'Duim', en: 'Thumb', da: 'Tommelfinger', de: 'Daumen', no: 'Tommel', sv: 'Tumme' },
    { on: false, nl: 'Vingers', en: 'Fingers', da: 'Fingre', de: 'Finger', no: 'Fingre', sv: 'Fingrar' }
  ] },
  { key: 'scarf', icon: '🧣', nl: 'Sjaal', en: 'Scarf', da: 'Halstørklæde', de: 'Schal', no: 'Skjerf', sv: 'Halsduk', parts: [
    { on: true,  nl: 'Sjaal', en: 'Scarf', da: 'Halstørklæde', de: 'Schal', no: 'Skjerf', sv: 'Halsduk' },
    { on: false, nl: 'Rand', en: 'Border', da: 'Kant', de: 'Rand', no: 'Kant', sv: 'Kant' }
  ] },
  { key: 'shawl', icon: '🔺', nl: 'Omslagdoek', en: 'Shawl', da: 'Sjal', de: 'Tuch', no: 'Sjal', sv: 'Sjal', parts: [
    { on: true, nl: 'Lijf', en: 'Body', da: 'Sjal', de: 'Tuch', no: 'Sjal', sv: 'Sjal' },
    { on: true, nl: 'Rand', en: 'Border', da: 'Kant', de: 'Rand', no: 'Kant', sv: 'Kant' }
  ] },
  { key: 'blanket', icon: '🛏️', nl: 'Deken', en: 'Blanket', da: 'Tæppe', de: 'Decke', no: 'Teppe', sv: 'Filt', parts: [
    { on: true, nl: 'Lapjes / panelen', en: 'Squares / panels', da: 'Firkanter / stykker', de: 'Quadrate / Teile', no: 'Ruter / stykker', sv: 'Rutor / delar' },
    { on: true, nl: 'Rand', en: 'Border', da: 'Kant', de: 'Rand', no: 'Kant', sv: 'Kant' }
  ] },
  { key: 'other', icon: '✨', nl: 'Anders', en: 'Other', da: 'Andet', de: 'Anderes', no: 'Annet', sv: 'Annat', parts: [] }
];
