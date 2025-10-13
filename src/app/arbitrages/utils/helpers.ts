// src/utils/helpers.ts

// Función auxiliar para determinar si un arbitraje es reciente (5 minutos)
// src/utils/helpers.ts (o donde la hayas movido)

export const isRecent = (dateString: string, minutes: number = 5): boolean => {
    const arbDate = new Date(dateString);
    const now = new Date();
    // Define el límite dinámicamente
    const limitDate = new Date(now.getTime() - minutes * 60 * 1000); 
    
    // Devuelve true si la fecha del arbitraje es MÁS RECIENTE que el límite
    return arbDate > limitDate;
};