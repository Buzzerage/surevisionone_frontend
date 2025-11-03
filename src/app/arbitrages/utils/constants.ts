// src/utils/constants.ts
import { 
    MdSportsSoccer, 
    MdSportsBasketball, 
    MdSportsVolleyball, 
    MdSportsHockey, 
    MdList, 
    MdSportsBaseball, 
    MdSportsTennis, 
    MdSports 
} from 'react-icons/md';

// Lista de deportes con claves en inglés (minúsculas) para el filtrado
export const SPORT_FILTERS = [
    { nameKey: "arbitrage.sports.All", icon: MdList, key: "All" },
    { nameKey: "arbitrage.sports.football", icon: MdSportsSoccer, key: "football" },
    { nameKey: "arbitrage.sports.basketball", icon: MdSportsBasketball, key: "basketball" },
    { nameKey: "arbitrage.sports.tennis", icon: MdSportsTennis, key: "tennis" },
    { nameKey: "arbitrage.sports.volleyball", icon: MdSportsVolleyball, key: "volleyball" },
    { nameKey: "arbitrage.sports.hockey", icon: MdSportsHockey, key: "hockey" },
    { nameKey: "arbitrage.sports.baseball", icon: MdSportsBaseball, key: "baseball" },
    { nameKey: "arbitrage.sports.rugby", icon: MdSports , key: "rugby" },
];