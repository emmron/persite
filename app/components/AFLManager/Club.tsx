import { useState } from "react";
import { Card, Flex, Heading, Text, Box, Button, Separator, Grid, Badge, Table, Tabs, Progress } from "@radix-ui/themes";
import { GameState } from "~/data/AFLManager/gameState";
import { Team, teams } from "~/data/AFLManager/teams";
import { Player } from "~/data/AFLManager/players";

interface ClubProps {
  gameState: GameState;
  allPlayers: Player[];
}

export default function Club({ gameState, allPlayers }: ClubProps) {
  // Get user team
  const userTeam = teams.find(team => team.id === gameState.userTeamId);
  
  if (!userTeam) {
    return <Text>Error: Team not found</Text>;
  }
  
  // Get team players
  const teamPlayers = allPlayers.filter(player => player.teamId === gameState.userTeamId);
  
  // Calculate team salary cap usage
  const totalSalary = teamPlayers.reduce((sum, player) => sum + player.contract.salary, 0);
  const salaryCap = 10000; // $10M salary cap (example value)
  const salaryCapPercentage = Math.min(100, (totalSalary / salaryCap) * 100);
  
  // Club finances (example data)
  const finances = {
    balance: 15000000, // $15M
    weeklyRevenue: 850000, // $850k
    weeklyExpenses: 750000, // $750k
    sponsorships: [
      { name: "Major Sponsor", amount: 5000000, duration: "2 years" },
      { name: "Secondary Sponsor", amount: 2500000, duration: "3 years" },
      { name: "Minor Sponsor", amount: 1000000, duration: "1 year" }
    ],
    revenueBreakdown: {
      ticketSales: 45,
      sponsorships: 30,
      merchandise: 15,
      broadcasting: 10
    },
    expensesBreakdown: {
      playerSalaries: 65,
      staffSalaries: 15,
      facilities: 10,
      operations: 10
    }
  };
  
  // Club facilities (example data)
  const facilities = {
    stadium: {
      name: userTeam.homeGround,
      capacity: 50000,
      condition: 85,
      modernization: 80,
      fanAmenities: 75
    },
    trainingFacilities: {
      condition: 70,
      technology: 65,
      recovery: 75,
      gymQuality: 80
    },
    medicalFacilities: {
      quality: 75,
      staff: 70,
      equipment: 80,
      rehabilitation: 75
    },
    youthAcademy: {
      quality: 65,
      coaching: 70,
      recruitment: 60,
      development: 65
    }
  };
  
  // Club staff (example data)
  const staff = [
    { id: "1", name: "John Smith", role: "Head Coach", quality: 85, specialization: "Tactical", salary: 800 },
    { id: "2", name: "Sarah Johnson", role: "Assistant Coach", quality: 75, specialization: "Player Development", salary: 400 },
    { id: "3", name: "Michael Brown", role: "Fitness Coach", quality: 80, specialization: "Conditioning", salary: 350 },
    { id: "4", name: "David Wilson", role: "Medical Officer", quality: 90, specialization: "Injury Prevention", salary: 500 },
    { id: "5", name: "Emma Davis", role: "Scout", quality: 70, specialization: "Youth Talent", salary: 300 },
    { id: "6", name: "Robert Taylor", role: "Physiotherapist", quality: 85, specialization: "Rehabilitation", salary: 400 }
  ];
  
  // Render club overview
  const renderClubOverview = () => (
    <Grid columns={{ initial: "1", md: "2" }} gap="4">
      <Card variant="surface">
        <Flex justify="between" align="center" mb="3">
          <Heading size="4">{userTeam.name}</Heading>
          <Box style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: userTeam.colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {userTeam.name.substring(0, 2).toUpperCase()}
          </Box>
        </Flex>
        
        <Separator size="4" my="3" />
        
        <Grid columns="1" gap="3" width="auto">
          <Box>
            <Text size="2" weight="bold">Home Ground</Text>
            <Text>{userTeam.homeGround}</Text>
          </Box>
          
          <Box>
            <Text size="2" weight="bold">Established</Text>
            <Text>1897</Text> {/* Example data */}
          </Box>
          
          <Box>
            <Text size="2" weight="bold">Club Colors</Text>
            <Flex gap="2" align="center">
              <Box style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px', 
                backgroundColor: userTeam.colors.primary
              }} />
              <Box style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px', 
                backgroundColor: userTeam.colors.secondary || '#ffffff'
              }} />
            </Flex>
          </Box>
          
          <Box>
            <Text size="2" weight="bold">Current Season</Text>
            <Text>Round {gameState.currentRound}</Text>
          </Box>
          
          <Box>
            <Text size="2" weight="bold">League Position</Text>
            {(() => {
              const position = gameState.ladder
                .sort((a, b) => {
                  if (b.points !== a.points) return b.points - a.points;
                  return b.percentage - a.percentage;
                })
                .findIndex(pos => pos.teamId === gameState.userTeamId) + 1;
              
              return <Text>{position}{getOrdinalSuffix(position)}</Text>;
            })()}
          </Box>
        </Grid>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Team Attributes</Heading>
        
        <Grid columns="1" gap="3" width="auto">
          <Box>
            <Flex justify="between">
              <Text size="2">Attack</Text>
              <Text size="2" weight="bold">{userTeam.attributes.attack}</Text>
            </Flex>
            <Progress value={userTeam.attributes.attack} max={100} size="2" color="green" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Midfield</Text>
              <Text size="2" weight="bold">{userTeam.attributes.midfield}</Text>
            </Flex>
            <Progress value={userTeam.attributes.midfield} max={100} size="2" color="blue" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Defense</Text>
              <Text size="2" weight="bold">{userTeam.attributes.defense}</Text>
            </Flex>
            <Progress value={userTeam.attributes.defense} max={100} size="2" color="orange" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Coaching</Text>
              <Text size="2" weight="bold">{userTeam.attributes.coaching}</Text>
            </Flex>
            <Progress value={userTeam.attributes.coaching} max={100} size="2" color="purple" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Overall</Text>
              <Text size="2" weight="bold">
                {Math.round((userTeam.attributes.attack + userTeam.attributes.midfield + userTeam.attributes.defense + userTeam.attributes.coaching) / 4)}
              </Text>
            </Flex>
            <Progress 
              value={Math.round((userTeam.attributes.attack + userTeam.attributes.midfield + userTeam.attributes.defense + userTeam.attributes.coaching) / 4)} 
              max={100} 
              size="2" 
              color="indigo" 
            />
          </Box>
        </Grid>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Salary Cap</Heading>
        
        <Box mb="3">
          <Flex justify="between" mb="1">
            <Text size="2">Salary Cap Usage</Text>
            <Text size="2" weight="bold">${totalSalary}k / ${salaryCap}k</Text>
          </Flex>
          <Progress 
            value={salaryCapPercentage} 
            max={100} 
            size="2" 
            color={salaryCapPercentage > 95 ? "red" : salaryCapPercentage > 85 ? "orange" : "green"} 
          />
        </Box>
        
        <Text size="2" color="gray">
          {salaryCapPercentage >= 100 
            ? "You are at the salary cap limit. You must reduce salaries before signing new players." 
            : `You have $${salaryCap - totalSalary}k available under the salary cap.`}
        </Text>
        
        <Separator size="4" my="3" />
        
        <Heading size="3" mb="2">Position Breakdown</Heading>
        
        <Grid columns="2" gap="3" width="auto">
          {["Forward", "Midfielder", "Defender", "Ruck", "Utility"].map(position => {
            const positionPlayers = teamPlayers.filter(p => p.position === position);
            const positionSalary = positionPlayers.reduce((sum, p) => sum + p.contract.salary, 0);
            const percentage = Math.round((positionSalary / totalSalary) * 100) || 0;
            
            return (
              <Box key={position}>
                <Flex justify="between">
                  <Text size="2">{position}s</Text>
                  <Text size="2">{percentage}%</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${percentage}%`, 
                    height: '8px', 
                    backgroundColor: 
                      position === "Forward" ? '#22c55e' : 
                      position === "Midfielder" ? '#3b82f6' : 
                      position === "Defender" ? '#f59e0b' : 
                      position === "Ruck" ? '#8b5cf6' : 
                      '#ec4899',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">${positionSalary}k</Text>
                </Flex>
              </Box>
            );
          })}
        </Grid>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Squad Summary</Heading>
        
        <Grid columns="2" gap="3" width="auto">
          <Box>
            <Text size="2" weight="bold">Total Players</Text>
            <Text>{teamPlayers.length}</Text>
          </Box>
          
          <Box>
            <Text size="2" weight="bold">Average Age</Text>
            <Text>
              {Math.round(teamPlayers.reduce((sum, p) => sum + p.age, 0) / teamPlayers.length)}
            </Text>
          </Box>
          
          <Box>
            <Text size="2" weight="bold">Average Rating</Text>
            <Text>
              {Math.round(teamPlayers.reduce((sum, p) => {
                const rating = (
                  p.attributes.speed + 
                  p.attributes.strength + 
                  p.attributes.stamina + 
                  p.attributes.agility + 
                  p.attributes.intelligence +
                  p.attributes.kicking +
                  p.attributes.marking +
                  p.attributes.handball +
                  p.attributes.tackling
                ) / 9;
                return sum + rating;
              }, 0) / teamPlayers.length)}
            </Text>
          </Box>
          
          <Box>
            <Text size="2" weight="bold">Average Salary</Text>
            <Text>${Math.round(totalSalary / teamPlayers.length)}k</Text>
          </Box>
        </Grid>
        
        <Separator size="4" my="3" />
        
        <Heading size="3" mb="2">Position Distribution</Heading>
        
        <Flex gap="2" wrap="wrap">
          {["Forward", "Midfielder", "Defender", "Ruck", "Utility"].map(position => {
            const count = teamPlayers.filter(p => p.position === position).length;
            const percentage = Math.round((count / teamPlayers.length) * 100);
            
            return (
              <Box key={position} style={{ flex: 1, minWidth: '120px' }}>
                <Text size="2" weight="bold">{position}s</Text>
                <Text>{count} ({percentage}%)</Text>
                <Box style={{ 
                  width: `${percentage}%`, 
                  height: '8px', 
                  backgroundColor: 
                    position === "Forward" ? '#22c55e' : 
                    position === "Midfielder" ? '#3b82f6' : 
                    position === "Defender" ? '#f59e0b' : 
                    position === "Ruck" ? '#8b5cf6' : 
                    '#ec4899',
                  borderRadius: '4px',
                  marginTop: '4px'
                }} />
              </Box>
            );
          })}
        </Flex>
      </Card>
    </Grid>
  );
  
  // Render finances
  const renderFinances = () => (
    <Grid columns={{ initial: "1", md: "2" }} gap="4">
      <Card variant="surface">
        <Heading size="4" mb="3">Financial Overview</Heading>
        
        <Grid columns="1" gap="3" width="auto">
          <Box>
            <Text size="2" weight="bold">Current Balance</Text>
            <Text size="6" weight="bold">${formatCurrency(finances.balance)}</Text>
          </Box>
          
          <Separator size="4" my="1" />
          
          <Box>
            <Text size="2" weight="bold">Weekly Revenue</Text>
            <Text color="green">${formatCurrency(finances.weeklyRevenue)}</Text>
          </Box>
          
          <Box>
            <Text size="2" weight="bold">Weekly Expenses</Text>
            <Text color="red">${formatCurrency(finances.weeklyExpenses)}</Text>
          </Box>
          
          <Box>
            <Text size="2" weight="bold">Weekly Profit/Loss</Text>
            <Text color={finances.weeklyRevenue > finances.weeklyExpenses ? "green" : "red"}>
              ${formatCurrency(finances.weeklyRevenue - finances.weeklyExpenses)}
            </Text>
          </Box>
          
          <Separator size="4" my="1" />
          
          <Box>
            <Text size="2" weight="bold">Salary Cap Space</Text>
            <Text>${(salaryCap - totalSalary).toLocaleString()}k</Text>
          </Box>
        </Grid>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Sponsorships</Heading>
        
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Sponsor</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Duration</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {finances.sponsorships.map((sponsor, index) => (
              <Table.Row key={index}>
                <Table.Cell>{sponsor.name}</Table.Cell>
                <Table.Cell>${formatCurrency(sponsor.amount)}</Table.Cell>
                <Table.Cell>{sponsor.duration}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        
        <Button variant="outline" size="2" mt="3">Negotiate New Sponsorship</Button>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Revenue Breakdown</Heading>
        
        <Grid columns="1" gap="3" width="auto">
          {Object.entries(finances.revenueBreakdown).map(([source, percentage]) => (
            <Box key={source}>
              <Flex justify="between">
                <Text size="2" style={{ textTransform: 'capitalize' }}>{source}</Text>
                <Text size="2">{percentage}%</Text>
              </Flex>
              <Box style={{ 
                width: `${percentage}%`, 
                height: '8px', 
                backgroundColor: 
                  source === "ticketSales" ? '#22c55e' : 
                  source === "sponsorships" ? '#3b82f6' : 
                  source === "merchandise" ? '#f59e0b' : 
                  '#8b5cf6',
                borderRadius: '4px'
              }} />
            </Box>
          ))}
        </Grid>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Expenses Breakdown</Heading>
        
        <Grid columns="1" gap="3" width="auto">
          {Object.entries(finances.expensesBreakdown).map(([source, percentage]) => (
            <Box key={source}>
              <Flex justify="between">
                <Text size="2" style={{ textTransform: 'capitalize' }}>{source}</Text>
                <Text size="2">{percentage}%</Text>
              </Flex>
              <Box style={{ 
                width: `${percentage}%`, 
                height: '8px', 
                backgroundColor: 
                  source === "playerSalaries" ? '#ef4444' : 
                  source === "staffSalaries" ? '#f97316' : 
                  source === "facilities" ? '#f59e0b' : 
                  '#8b5cf6',
                borderRadius: '4px'
              }} />
            </Box>
          ))}
        </Grid>
      </Card>
    </Grid>
  );
  
  // Render facilities
  const renderFacilities = () => (
    <Grid columns={{ initial: "1", md: "2" }} gap="4">
      <Card variant="surface">
        <Heading size="4" mb="3">Stadium</Heading>
        
        <Box mb="3">
          <Text size="2" weight="bold">{facilities.stadium.name}</Text>
          <Text>Capacity: {facilities.stadium.capacity.toLocaleString()} seats</Text>
        </Box>
        
        <Grid columns="1" gap="3" width="auto">
          <Box>
            <Flex justify="between">
              <Text size="2">Condition</Text>
              <Text size="2" weight="bold">{facilities.stadium.condition}/100</Text>
            </Flex>
            <Progress value={facilities.stadium.condition} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Modernization</Text>
              <Text size="2" weight="bold">{facilities.stadium.modernization}/100</Text>
            </Flex>
            <Progress value={facilities.stadium.modernization} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Fan Amenities</Text>
              <Text size="2" weight="bold">{facilities.stadium.fanAmenities}/100</Text>
            </Flex>
            <Progress value={facilities.stadium.fanAmenities} max={100} size="2" />
          </Box>
        </Grid>
        
        <Flex gap="2" mt="3">
          <Button variant="outline" size="2">Upgrade</Button>
          <Button variant="outline" size="2">Maintenance</Button>
        </Flex>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Training Facilities</Heading>
        
        <Grid columns="1" gap="3" width="auto">
          <Box>
            <Flex justify="between">
              <Text size="2">Condition</Text>
              <Text size="2" weight="bold">{facilities.trainingFacilities.condition}/100</Text>
            </Flex>
            <Progress value={facilities.trainingFacilities.condition} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Technology</Text>
              <Text size="2" weight="bold">{facilities.trainingFacilities.technology}/100</Text>
            </Flex>
            <Progress value={facilities.trainingFacilities.technology} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Recovery</Text>
              <Text size="2" weight="bold">{facilities.trainingFacilities.recovery}/100</Text>
            </Flex>
            <Progress value={facilities.trainingFacilities.recovery} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Gym Quality</Text>
              <Text size="2" weight="bold">{facilities.trainingFacilities.gymQuality}/100</Text>
            </Flex>
            <Progress value={facilities.trainingFacilities.gymQuality} max={100} size="2" />
          </Box>
        </Grid>
        
        <Button variant="outline" size="2" mt="3">Upgrade</Button>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Medical Facilities</Heading>
        
        <Grid columns="1" gap="3" width="auto">
          <Box>
            <Flex justify="between">
              <Text size="2">Quality</Text>
              <Text size="2" weight="bold">{facilities.medicalFacilities.quality}/100</Text>
            </Flex>
            <Progress value={facilities.medicalFacilities.quality} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Staff</Text>
              <Text size="2" weight="bold">{facilities.medicalFacilities.staff}/100</Text>
            </Flex>
            <Progress value={facilities.medicalFacilities.staff} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Equipment</Text>
              <Text size="2" weight="bold">{facilities.medicalFacilities.equipment}/100</Text>
            </Flex>
            <Progress value={facilities.medicalFacilities.equipment} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Rehabilitation</Text>
              <Text size="2" weight="bold">{facilities.medicalFacilities.rehabilitation}/100</Text>
            </Flex>
            <Progress value={facilities.medicalFacilities.rehabilitation} max={100} size="2" />
          </Box>
        </Grid>
        
        <Button variant="outline" size="2" mt="3">Upgrade</Button>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Youth Academy</Heading>
        
        <Grid columns="1" gap="3" width="auto">
          <Box>
            <Flex justify="between">
              <Text size="2">Quality</Text>
              <Text size="2" weight="bold">{facilities.youthAcademy.quality}/100</Text>
            </Flex>
            <Progress value={facilities.youthAcademy.quality} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Coaching</Text>
              <Text size="2" weight="bold">{facilities.youthAcademy.coaching}/100</Text>
            </Flex>
            <Progress value={facilities.youthAcademy.coaching} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Recruitment</Text>
              <Text size="2" weight="bold">{facilities.youthAcademy.recruitment}/100</Text>
            </Flex>
            <Progress value={facilities.youthAcademy.recruitment} max={100} size="2" />
          </Box>
          
          <Box>
            <Flex justify="between">
              <Text size="2">Development</Text>
              <Text size="2" weight="bold">{facilities.youthAcademy.development}/100</Text>
            </Flex>
            <Progress value={facilities.youthAcademy.development} max={100} size="2" />
          </Box>
        </Grid>
        
        <Flex gap="2" mt="3">
          <Button variant="outline" size="2">Upgrade</Button>
          <Button variant="outline" size="2">Scout Youth</Button>
        </Flex>
      </Card>
    </Grid>
  );
  
  // Render staff
  const renderStaff = () => (
    <Grid columns={{ initial: "1" }} gap="4">
      <Card variant="surface">
        <Heading size="4" mb="3">Club Staff</Heading>
        
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Specialization</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quality</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Salary (k)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {staff.map(member => (
              <Table.Row key={member.id}>
                <Table.Cell>
                  <Text weight="bold">{member.name}</Text>
                </Table.Cell>
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell>{member.specialization}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Box style={{ 
                      width: `${member.quality}%`, 
                      height: '8px', 
                      backgroundColor: 
                        member.quality > 85 ? '#22c55e' : 
                        member.quality > 70 ? '#3b82f6' : 
                        '#f59e0b',
                      borderRadius: '4px'
                    }} />
                    <Text size="2">{member.quality}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>${member.salary}k</Table.Cell>
                <Table.Cell>
                  <Flex gap="2">
                    <Button variant="outline" size="1">Details</Button>
                    <Button variant="outline" size="1">Replace</Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        
        <Button variant="solid" size="2" mt="3">Hire New Staff</Button>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Staff Budget</Heading>
        
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Box>
            <Text size="2" weight="bold">Total Staff Salary</Text>
            <Text size="6" weight="bold">${staff.reduce((sum, member) => sum + member.salary, 0)}k</Text>
            <Text size="2" color="gray">per year</Text>
          </Box>
          
          <Box>
            <Text size="2" weight="bold">Staff Budget Allocation</Text>
            <Grid columns="1" gap="2" width="auto">
              {[
                { role: "Coaching", percentage: 45 },
                { role: "Medical", percentage: 25 },
                { role: "Scouting", percentage: 15 },
                { role: "Administration", percentage: 15 }
              ].map(item => (
                <Box key={item.role}>
                  <Flex justify="between">
                    <Text size="2">{item.role}</Text>
                    <Text size="2">{item.percentage}%</Text>
                  </Flex>
                  <Box style={{ 
                    width: `${item.percentage}%`, 
                    height: '8px', 
                    backgroundColor: 
                      item.role === "Coaching" ? '#22c55e' : 
                      item.role === "Medical" ? '#3b82f6' : 
                      item.role === "Scouting" ? '#f59e0b' : 
                      '#8b5cf6',
                    borderRadius: '4px'
                  }} />
                </Box>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Card>
    </Grid>
  );
  
  // Helper function to get ordinal suffix
  function getOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return "st";
    }
    if (j === 2 && k !== 12) {
      return "nd";
    }
    if (j === 3 && k !== 13) {
      return "rd";
    }
    return "th";
  }
  
  // Helper function to format currency
  function formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(2) + "M";
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + "k";
    } else {
      return amount.toString();
    }
  }
  
  return (
    <Box>
      <Heading size="6" mb="4">Club</Heading>
      
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="finances">Finances</Tabs.Trigger>
          <Tabs.Trigger value="facilities">Facilities</Tabs.Trigger>
          <Tabs.Trigger value="staff">Staff</Tabs.Trigger>
        </Tabs.List>
        
        <Box pt="4">
          <Tabs.Content value="overview">
            {renderClubOverview()}
          </Tabs.Content>
          
          <Tabs.Content value="finances">
            {renderFinances()}
          </Tabs.Content>
          
          <Tabs.Content value="facilities">
            {renderFacilities()}
          </Tabs.Content>
          
          <Tabs.Content value="staff">
            {renderStaff()}
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
