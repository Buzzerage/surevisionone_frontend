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
    { name: "Todos", icon: MdList, key: "All" },
    { name: "Fútbol", icon: MdSportsSoccer, key: "football" },
    { name: "Baloncesto", icon: MdSportsBasketball, key: "basketball" },
    { name: "Tenis", icon: MdSportsTennis, key: "tennis" },
    { name: "Voleibol", icon: MdSportsVolleyball, key: "volleyball" },
    { name: "Hockey", icon: MdSportsHockey, key: "hockey" },
    { name: "Béisbol", icon: MdSportsBaseball, key: "baseball" },
    { name: "Rugby", icon: MdSports , key: "rugby" },
];