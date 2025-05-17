// AFL Teams data

export interface Team {
  id: string;
  name: string;
  shortName: string;
  colors: {
    primary: string;
    secondary: string;
  };
  homeGround: string;
  attributes: {
    attack: number;
    midfield: number;
    defense: number;
    coaching: number;
  };
  logo?: string;
}

export const teams: Team[] = [
  {
    id: "1",
    name: "Adelaide Crows",
    shortName: "Crows",
    colors: {
      primary: "#002b5c",
      secondary: "#e21937",
    },
    homeGround: "Adelaide Oval",
    attributes: {
      attack: 75,
      midfield: 78,
      defense: 76,
      coaching: 77,
    },
  },
  {
    id: "2",
    name: "Brisbane Lions",
    shortName: "Lions",
    colors: {
      primary: "#7C1E31",
      secondary: "#0054A4",
    },
    homeGround: "Gabba",
    attributes: {
      attack: 88,
      midfield: 86,
      defense: 85,
      coaching: 87,
    },
  },
  {
    id: "3",
    name: "Carlton",
    shortName: "Blues",
    colors: {
      primary: "#0e1e2d",
      secondary: "#ffffff",
    },
    homeGround: "Marvel Stadium",
    attributes: {
      attack: 82,
      midfield: 84,
      defense: 80,
      coaching: 83,
    },
  },
  {
    id: "4",
    name: "Collingwood",
    shortName: "Magpies",
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
    },
    homeGround: "MCG",
    attributes: {
      attack: 86,
      midfield: 87,
      defense: 85,
      coaching: 88,
    },
  },
  {
    id: "5",
    name: "Essendon",
    shortName: "Bombers",
    colors: {
      primary: "#CC2031",
      secondary: "#000000",
    },
    homeGround: "Marvel Stadium",
    attributes: {
      attack: 79,
      midfield: 78,
      defense: 77,
      coaching: 76,
    },
  },
  {
    id: "6",
    name: "Fremantle",
    shortName: "Dockers",
    colors: {
      primary: "#2a0d54",
      secondary: "#ffffff",
    },
    homeGround: "Optus Stadium",
    attributes: {
      attack: 76,
      midfield: 79,
      defense: 82,
      coaching: 78,
    },
  },
  {
    id: "7",
    name: "Geelong Cats",
    shortName: "Cats",
    colors: {
      primary: "#1c3c63",
      secondary: "#ffffff",
    },
    homeGround: "GMHBA Stadium",
    attributes: {
      attack: 84,
      midfield: 85,
      defense: 86,
      coaching: 89,
    },
  },
  {
    id: "8",
    name: "Gold Coast Suns",
    shortName: "Suns",
    colors: {
      primary: "#E5002B",
      secondary: "#FFCD00",
    },
    homeGround: "Metricon Stadium",
    attributes: {
      attack: 74,
      midfield: 75,
      defense: 73,
      coaching: 74,
    },
  },
  {
    id: "9",
    name: "Greater Western Sydney",
    shortName: "Giants",
    colors: {
      primary: "#F26522",
      secondary: "#FFFFFF",
    },
    homeGround: "GIANTS Stadium",
    attributes: {
      attack: 80,
      midfield: 81,
      defense: 79,
      coaching: 80,
    },
  },
  {
    id: "10",
    name: "Hawthorn",
    shortName: "Hawks",
    colors: {
      primary: "#4D2004",
      secondary: "#FFC700",
    },
    homeGround: "MCG",
    attributes: {
      attack: 77,
      midfield: 76,
      defense: 78,
      coaching: 81,
    },
  },
  {
    id: "11",
    name: "Melbourne",
    shortName: "Demons",
    colors: {
      primary: "#0B1C3F",
      secondary: "#DE0316",
    },
    homeGround: "MCG",
    attributes: {
      attack: 83,
      midfield: 85,
      defense: 84,
      coaching: 84,
    },
  },
  {
    id: "12",
    name: "North Melbourne",
    shortName: "Kangaroos",
    colors: {
      primary: "#003F98",
      secondary: "#FFFFFF",
    },
    homeGround: "Marvel Stadium",
    attributes: {
      attack: 70,
      midfield: 71,
      defense: 72,
      coaching: 73,
    },
  },
  {
    id: "13",
    name: "Port Adelaide",
    shortName: "Power",
    colors: {
      primary: "#008AAB",
      secondary: "#000000",
    },
    homeGround: "Adelaide Oval",
    attributes: {
      attack: 82,
      midfield: 83,
      defense: 81,
      coaching: 82,
    },
  },
  {
    id: "14",
    name: "Richmond",
    shortName: "Tigers",
    colors: {
      primary: "#FFD200",
      secondary: "#000000",
    },
    homeGround: "MCG",
    attributes: {
      attack: 81,
      midfield: 80,
      defense: 79,
      coaching: 83,
    },
  },
  {
    id: "15",
    name: "St Kilda",
    shortName: "Saints",
    colors: {
      primary: "#ED1B2F",
      secondary: "#FFFFFF",
    },
    homeGround: "Marvel Stadium",
    attributes: {
      attack: 78,
      midfield: 77,
      defense: 76,
      coaching: 75,
    },
  },
  {
    id: "16",
    name: "Sydney Swans",
    shortName: "Swans",
    colors: {
      primary: "#ED171F",
      secondary: "#FFFFFF",
    },
    homeGround: "SCG",
    attributes: {
      attack: 85,
      midfield: 86,
      defense: 83,
      coaching: 86,
    },
  },
  {
    id: "17",
    name: "West Coast Eagles",
    shortName: "Eagles",
    colors: {
      primary: "#003087",
      secondary: "#F2A900",
    },
    homeGround: "Optus Stadium",
    attributes: {
      attack: 75,
      midfield: 74,
      defense: 76,
      coaching: 77,
    },
  },
  {
    id: "18",
    name: "Western Bulldogs",
    shortName: "Bulldogs",
    colors: {
      primary: "#0C2340",
      secondary: "#E31837",
    },
    homeGround: "Marvel Stadium",
    attributes: {
      attack: 81,
      midfield: 83,
      defense: 80,
      coaching: 82,
    },
  },
];
