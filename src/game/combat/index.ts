import { AttackType, Stats, calculateDamage } from "@game/math/combat";

type CombatResult = {
  winner: 'pokemon1' | 'pokemon2';
  rounds: number;
  remainingHP: number;
};

export const simulateCombat = (
  pokemon1Stats: Stats,
  pokemon2Stats: Stats,
  pokemon1AttackType: AttackType,
  pokemon2AttackType: AttackType,
  pokemon1ElementalAdvantage: number,
  pokemon2ElementalAdvantage: number,
): CombatResult => {
  let pokemon1HP = pokemon1Stats.HP;
  let pokemon2HP = pokemon2Stats.HP;
  let round = 0;

  while (pokemon1HP > 0 && pokemon2HP > 0) {
    round++;
    const pokemon1GoesFirst = pokemon1Stats.SPD >= pokemon2Stats.SPD;

    if (pokemon1GoesFirst) {
      const damageToPokemon2 = calculateDamage(
        pokemon1Stats,
        pokemon2Stats,
        pokemon1AttackType,
        pokemon1ElementalAdvantage
      );
      pokemon2HP -= damageToPokemon2;
      console.log(`Round ${round}: Pokemon 1 deals ${damageToPokemon2} damage to Pokemon 2`);
      if (pokemon2HP <= 0) break;

      const damageToPokemon1 = calculateDamage(
        pokemon2Stats,
        pokemon1Stats,
        pokemon2AttackType,
        pokemon2ElementalAdvantage
      );
      pokemon1HP -= damageToPokemon1;
      console.log(`Round ${round}: Pokemon 2 deals ${damageToPokemon1} damage to Pokemon 1`);
    } else {
      const damageToPokemon1 = calculateDamage(
        pokemon2Stats,
        pokemon1Stats,
        pokemon2AttackType,
        pokemon2ElementalAdvantage
      );
      pokemon1HP -= damageToPokemon1;
      console.log(`Round ${round}: Pokemon 2 deals ${damageToPokemon1} damage to Pokemon 1`);
      if (pokemon1HP <= 0) break;

      const damageToPokemon2 = calculateDamage(
        pokemon1Stats,
        pokemon2Stats,
        pokemon1AttackType,
        pokemon1ElementalAdvantage
      );
      pokemon2HP -= damageToPokemon2;
      console.log(`Round ${round}: Pokemon 1 deals ${damageToPokemon2} damage to Pokemon 2`);
    }
  }

  const winner = pokemon1HP > 0 ? 'pokemon1' : 'pokemon2';
  const remainingHP = winner === 'pokemon1' ? pokemon1HP : pokemon2HP;

  return {
    winner,
    rounds: round,
    remainingHP,
  };
};
