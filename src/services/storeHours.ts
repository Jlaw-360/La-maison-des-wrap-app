// lib/storeHours.ts
// Official Operating Hours for La Maison des Wraps (America/Toronto - Eastern Time)
// Lundi: Fermé | Mardi - Samedi: 11h00 - 21h00 | Dimanche: 12h00 - 20h00

export interface StoreStatus {
  isOpen: boolean;
  nextOpenSlot: string;
  scheduleText: string;
  availableTimeSlots: string[];
  dayName: string;
  currentTimeFormatted: string;
}

export function getStoreStatus(now = new Date()): StoreStatus {
  // Convert to Quebec / Eastern Time (America/Toronto)
  const easternTimeStr = now.toLocaleString('en-US', { timeZone: 'America/Toronto' });
  const date = new Date(easternTimeStr);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = date.getHours();
  const minute = date.getMinutes();
  const currentTime = hour + minute / 60;

  let isOpen = false;
  let nextOpenSlot = '';
  let scheduleText = '';
  let availableTimeSlots: string[] = [];

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const dayName = dayNames[day];
  const currentTimeFormatted = `${String(hour).padStart(2, '0')}h${String(minute).padStart(2, '0')}`;

  if (day === 1) {
    // Monday: Closed all day
    isOpen = false;
    nextOpenSlot = 'Mardi à 11h00';
    scheduleText = 'Fermé le lundi (Réouverture Mardi à 11h00)';
    availableTimeSlots = generateTimeSlots(2, 11, 21); // Tuesday slots
  } else if (day >= 2 && day <= 6) {
    // Tuesday to Saturday: 11:00 to 21:00
    isOpen = currentTime >= 11 && currentTime < 21;
    scheduleText = 'Mardi à Samedi : 11h00 - 21h00';
    if (currentTime < 11) {
      nextOpenSlot = "Aujourd'hui à 11h00";
      availableTimeSlots = generateTimeSlots(day, 11, 21, 11);
    } else if (currentTime >= 21) {
      const nextDay = day === 6 ? 'Dimanche à 12h00' : 'Demain à 11h00';
      nextOpenSlot = nextDay;
      availableTimeSlots = day === 6 ? generateTimeSlots(0, 12, 20) : generateTimeSlots(day + 1, 11, 21);
    } else {
      nextOpenSlot = 'Ouvert actuellement';
      availableTimeSlots = generateTimeSlots(day, 11, 21, currentTime + 0.5);
    }
  } else if (day === 0) {
    // Sunday: 12:00 to 20:00
    isOpen = currentTime >= 12 && currentTime < 20;
    scheduleText = 'Dimanche : 12h00 - 20h00';
    if (currentTime < 12) {
      nextOpenSlot = "Aujourd'hui à 12h00";
      availableTimeSlots = generateTimeSlots(0, 12, 20, 12);
    } else if (currentTime >= 20) {
      nextOpenSlot = 'Mardi à 11h00 (Fermé lundi)';
      availableTimeSlots = generateTimeSlots(2, 11, 21);
    } else {
      nextOpenSlot = 'Ouvert actuellement';
      availableTimeSlots = generateTimeSlots(0, 12, 20, currentTime + 0.5);
    }
  }

  return {
    isOpen,
    nextOpenSlot,
    scheduleText,
    availableTimeSlots,
    dayName,
    currentTimeFormatted
  };
}

function generateTimeSlots(targetDay: number, openHour: number, closeHour: number, startHour = openHour): string[] {
  const slots: string[] = [];
  const roundedStart = Math.ceil(startHour * 4) / 4; // Round up to next 15-minute slot

  for (let h = roundedStart; h < closeHour; h += 0.25) {
    const hour = Math.floor(h);
    const min = Math.round((h - hour) * 60);
    const timeStr = `${String(hour).padStart(2, '0')}h${String(min).padStart(2, '0')}`;
    slots.push(timeStr);
  }
  return slots;
}
