// AFL Players data

export type Position = 
  | "Forward" 
  | "Midfielder" 
  | "Defender" 
  | "Ruck" 
  | "Utility";

export interface PlayerStats {
  games: number;
  goals: number;
  behinds: number;
  disposals: number;
  marks: number;
  tackles: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  position: Position;
  attributes: {
    // General attributes (0-100)
    speed: number;
    strength: number;
    stamina: number;
    agility: number;
    intelligence: number;
    
    // Position-specific attributes (0-100)
    kicking: number;
    marking: number;
    handball: number;
    tackling: number;
    
    // Forward-specific
    goalkicking?: number;
    crumbing?: number;
    
    // Midfielder-specific
    clearances?: number;
    insidePlay?: number;
    
    // Defender-specific
    intercept?: number;
    rebound?: number;
    
    // Ruck-specific
    tapwork?: number;
    followUp?: number;
  };
  form: number; // 0-100
  fitness: number; // 0-100
  morale: number; // 0-100
  value: number; // in thousands of dollars
  contract: {
    yearsRemaining: number;
    salary: number; // yearly salary in thousands
  };
  stats: PlayerStats;
}

// This is a sample of players - in a real game, we would have hundreds
export const players: Player[] = [
  // Adelaide Crows players
  {
    id: "p1",
    name: "Taylor Walker",
    teamId: "1",
    age: 33,
    height: 194,
    weight: 100,
    position: "Forward",
    attributes: {
      speed: 70,
      strength: 85,
      stamina: 75,
      agility: 65,
      intelligence: 85,
      kicking: 88,
      marking: 85,
      handball: 75,
      tackling: 65,
      goalkicking: 90,
      crumbing: 60
    },
    form: 80,
    fitness: 85,
    morale: 75,
    value: 650,
    contract: {
      yearsRemaining: 1,
      salary: 550
    },
    stats: {
      games: 0,
      goals: 0,
      behinds: 0,
      disposals: 0,
      marks: 0,
      tackles: 0
    }
  },
  
  // Brisbane Lions players
  {
    id: "p19",
    name: "Lachie Neale",
    teamId: "2",
    age: 30,
    height: 177,
    weight: 80,
    position: "Midfielder",
    attributes: {
      speed: 80,
      strength: 75,
      stamina: 90,
      agility: 85,
      intelligence: 95,
      kicking: 85,
      marking: 75,
      handball: 92,
      tackling: 85,
      clearances: 95,
      insidePlay: 90
    },
    form: 90,
    fitness: 90,
    morale: 85,
    value: 1200,
    contract: {
      yearsRemaining: 3,
      salary: 900
    },
    stats: {
      games: 0,
      goals: 0,
      behinds: 0,
      disposals: 0,
      marks: 0,
      tackles: 0
    }
  },
  
  // Collingwood players
  {
    id: "p37",
    name: "Nick Daicos",
    teamId: "4",
    age: 21,
    height: 183,
    weight: 80,
    position: "Midfielder",
    attributes: {
      speed: 85,
      strength: 70,
      stamina: 85,
      agility: 90,
      intelligence: 90,
      kicking: 92,
      marking: 80,
      handball: 85,
      tackling: 75,
      clearances: 85,
      insidePlay: 80
    },
    form: 95,
    fitness: 95,
    morale: 90,
    value: 1500,
    contract: {
      yearsRemaining: 5,
      salary: 800
    },
    stats: {
      games: 0,
      goals: 0,
      behinds: 0,
      disposals: 0,
      marks: 0,
      tackles: 0
    }
  },
  
  // Sydney Swans players
  {
    id: "p160",
    name: "Isaac Heeney",
    teamId: "16",
    age: 27,
    height: 185,
    weight: 85,
    position: "Forward",
    attributes: {
      speed: 85,
      strength: 80,
      stamina: 85,
      agility: 90,
      intelligence: 85,
      kicking: 85,
      marking: 90,
      handball: 80,
      tackling: 75,
      goalkicking: 85,
      crumbing: 80
    },
    form: 90,
    fitness: 90,
    morale: 85,
    value: 1100,
    contract: {
      yearsRemaining: 4,
      salary: 850
    },
    stats: {
      games: 0,
      goals: 0,
      behinds: 0,
      disposals: 0,
      marks: 0,
      tackles: 0
    }
  },
  
  // West Coast Eagles players
  {
    id: "p170",
    name: "Oscar Allen",
    teamId: "17",
    age: 24,
    height: 192,
    weight: 90,
    position: "Forward",
    attributes: {
      speed: 75,
      strength: 80,
      stamina: 80,
      agility: 75,
      intelligence: 80,
      kicking: 80,
      marking: 90,
      handball: 75,
      tackling: 70,
      goalkicking: 85,
      crumbing: 65
    },
    form: 85,
    fitness: 90,
    morale: 75,
    value: 900,
    contract: {
      yearsRemaining: 3,
      salary: 700
    },
    stats: {
      games: 0,
      goals: 0,
      behinds: 0,
      disposals: 0,
      marks: 0,
      tackles: 0
    }
  }
];

// Function to generate more players for each team
export function generatePlayersForTeam(teamId: string, count: number = 22): Player[] {
  const positions: Position[] = ["Forward", "Midfielder", "Defender", "Ruck", "Utility"];
  const players: Player[] = [];
  
  const firstNames = [
    "Jack", "Tom", "Josh", "Sam", "Ben", "Jake", "Luke", "Liam", "James", "Will", 
    "Max", "Charlie", "Harry", "Alex", "Zach", "Ollie", "Bailey", "Callum", "Darcy", "Isaac"
  ];
  
  const lastNames = [
    "Smith", "Jones", "Brown", "Wilson", "Taylor", "Johnson", "White", "Martin", "Anderson", "Thompson",
    "Walker", "Harris", "Lewis", "Robinson", "Young", "Clark", "Mitchell", "Thomas", "King", "Cameron"
  ];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    const baseAttributes = {
      speed: 60 + Math.floor(Math.random() * 30),
      strength: 60 + Math.floor(Math.random() * 30),
      stamina: 60 + Math.floor(Math.random() * 30),
      agility: 60 + Math.floor(Math.random() * 30),
      intelligence: 60 + Math.floor(Math.random() * 30),
      kicking: 60 + Math.floor(Math.random() * 30),
      marking: 60 + Math.floor(Math.random() * 30),
      handball: 60 + Math.floor(Math.random() * 30),
      tackling: 60 + Math.floor(Math.random() * 30),
    };
    
    // Add position-specific attributes
    let positionAttributes = {};
    switch (position) {
      case "Forward":
        positionAttributes = {
          goalkicking: 70 + Math.floor(Math.random() * 25),
          crumbing: 60 + Math.floor(Math.random() * 30)
        };
        break;
      case "Midfielder":
        positionAttributes = {
          clearances: 70 + Math.floor(Math.random() * 25),
          insidePlay: 70 + Math.floor(Math.random() * 25)
        };
        break;
      case "Defender":
        positionAttributes = {
          intercept: 70 + Math.floor(Math.random() * 25),
          rebound: 70 + Math.floor(Math.random() * 25)
        };
        break;
      case "Ruck":
        positionAttributes = {
          tapwork: 70 + Math.floor(Math.random() * 25),
          followUp: 70 + Math.floor(Math.random() * 25)
        };
        break;
      case "Utility":
        // Utilities are all-rounders
        positionAttributes = {};
        break;
    }
    
    const player: Player = {
      id: `gen_${teamId}_${i}`,
      name: `${firstName} ${lastName}`,
      teamId,
      age: 18 + Math.floor(Math.random() * 15),
      height: 175 + Math.floor(Math.random() * 25),
      weight: 75 + Math.floor(Math.random() * 25),
      position,
      attributes: {
        ...baseAttributes,
        ...positionAttributes
      },
      form: 60 + Math.floor(Math.random() * 30),
      fitness: 70 + Math.floor(Math.random() * 30),
      morale: 60 + Math.floor(Math.random() * 30),
      value: 200 + Math.floor(Math.random() * 800),
      contract: {
        yearsRemaining: 1 + Math.floor(Math.random() * 4),
        salary: 150 + Math.floor(Math.random() * 600)
      },
      stats: {
        games: 0,
        goals: 0,
        behinds: 0,
        disposals: 0,
        marks: 0,
        tackles: 0
      }
    };
    
    players.push(player);
  }
  
  return players;
}
