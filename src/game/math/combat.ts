export type Stats = {
  PHY_ATK: number;
  ELE_ATK: number;
  ENE_ATK: number;
  ADA_ATK: number;
  PHY_DEF: number;
  ELE_DEF: number;
  ENE_DEF: number;
  ADA_DEF: number;
  SPD: number;
  HP: number;
  MOR: number;
  AFF: number;
  FOC: number;
  AUR: number;
  INST: number;
  SYN: number;
  CRIT_RATE: number;
  CRIT_MULT: number;
  ELEM_MULT: number;
  ACC: number;
  TOUGHNESS: number;
  PIERCE: number;
};

export type AttackType = 'physical' | 'elemental' | 'energy' | 'adaptable';

export const calculateDamage = (
  attackerStats: Stats,
  defenderStats: Stats,
  attackType: AttackType,
  elementalAdvantage: number,
  canCrit: boolean = true,
): number => {
  let baseDamage: number;
  let attackStat: number;
  let defenseStat: number;

  switch (attackType) {
    case 'physical':
      attackStat = attackerStats.PHY_ATK;
      defenseStat = defenderStats.PHY_DEF;
      break;
    case 'elemental':
      attackStat = attackerStats.ELE_ATK;
      defenseStat = defenderStats.ELE_DEF;
      break;
    case 'energy':
      attackStat = attackerStats.ENE_ATK;
      defenseStat = defenderStats.ENE_DEF;
      break;
    case 'adaptable':
      attackStat = attackerStats.ADA_ATK;
      defenseStat = defenderStats.ADA_DEF;
      break;
    default:
      throw new Error('Invalid attack type');
  }

  // Base damage calculation with defense penetration and randomness
  const defensePenetration = 1 - attackerStats.AUR / 100;
  baseDamage = attackStat - defenseStat * defensePenetration;
  if (baseDamage < 0) baseDamage = 0;

  // Introduce randomness to base damage
  baseDamage *= Math.random() * (1.15 - 0.85) + 0.85;

  // Calculate accuracy effect
  const accuracy =
    (attackerStats.FOC - defenderStats.SPD) * (1 + attackerStats.SYN / 100);
  const hitChance = Math.max(0.5, Math.min(1, 0.75 + accuracy / 100));
  if (Math.random() > hitChance) return 0; // Attack missed

  // Apply critical hit modifier if applicable
  if (canCrit) {
    const critChance = Math.random();
    const critDefenseEffect = 1 - defenderStats.INST / 100;
    if (critChance < attackerStats.CRIT_RATE * critDefenseEffect) {
      baseDamage *= Math.random() * (1.6 - 1.4) + 1.4; // Randomized critical hit multiplier
    }
  }

  // Apply elemental advantage/disadvantage with slight randomness
  baseDamage *= elementalAdvantage * (Math.random() * (1.05 - 0.95) + 0.95);

  // Apply additional modifiers
  const affinityEffect = 1 + attackerStats.AFF / 100;
  baseDamage *= affinityEffect;

  // Apply resilience effect from defender's morale
  const defenderMoraleEffect = 1 - defenderStats.MOR / 100;
  baseDamage *= defenderMoraleEffect;

  // Apply overall synergy effect to defense
  const overallDefenseEffect = 1 + defenderStats.SYN / 100;
  baseDamage /= overallDefenseEffect;

  // Ensure damage is at least 1
  return Math.max(1, Math.round(baseDamage));
};
