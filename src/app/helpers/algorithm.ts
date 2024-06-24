enum Missions {
  RASAR = "RASAR",
  LOGISTIKA = "LOGISTIKA",
  KITCHEN = "KITCHEN",
  NASHKIA = "NASHKIA",
  SHINPE = "SHINPE",
  MECHAPE = "MECHAPE",
  ACHORI = "ACHORI",
  TAYSON1 = "TAYSON1",
  TAYSON2 = "TAYSON2",
  JANKIA = "JANKIA",
  SHAG_BUNKER = "SHAG_BUNKER",
  MIGDAL_BUNKER = "MIGDAL_BUNKER",
  BUNKER = "BUNKER",
  SG_BUNKER = "SG_BUNKER",
}

interface MissionDetails {
  time: [number, number];
  totalGuards?: number;
}

export interface GuardsOptions {
  guardsCanGuardOnlyAtNight: number;
  guardsCanGuardOnlyInShinPe: number;
  guardsCantGoToKitchen: number;
  normalGuards: number;
}

const HOURS_IN_DAY = 23;
const SIX_DAYS_HOURS = HOURS_IN_DAY * 6;

const MISSIONS: Record<string, MissionDetails> = {
  [Missions.RASAR]: { time: [9, 22], totalGuards: 10 },
  [Missions.LOGISTIKA]: { time: [9, 22], totalGuards: 5 },
  [Missions.KITCHEN]: { time: [4, 22], totalGuards: 24 },
  [Missions.NASHKIA]: { time: [0, 23] },
  [Missions.SHINPE]: { time: [0, 23] },
  [Missions.MECHAPE]: { time: [0, 23] },
  [Missions.ACHORI]: { time: [0, 23] },
  [Missions.TAYSON1]: { time: [0, 23] },
  [Missions.TAYSON2]: { time: [0, 23] },
  [Missions.JANKIA]: { time: [0, 23] },
  [Missions.SHAG_BUNKER]: { time: [0, 23] },
  [Missions.MIGDAL_BUNKER]: { time: [0, 23] },
  [Missions.BUNKER]: { time: [0, 23] },
  [Missions.SG_BUNKER]: { time: [7, 22] },
};

const ThreeHoursShift = [
  Missions.NASHKIA,
  Missions.SHINPE,
  Missions.MECHAPE,
  Missions.ACHORI,
  Missions.TAYSON1,
  Missions.TAYSON2,
  Missions.JANKIA,
  Missions.SHAG_BUNKER,
  Missions.MIGDAL_BUNKER,
  Missions.BUNKER,
  Missions.SG_BUNKER,
];

export const generateSchedule = (options: GuardsOptions) => {
  const hours = Array.from({ length: SIX_DAYS_HOURS }, (_, i) => i);

  const guardList: Record<Missions | string, string[] | number>[] = [];
  const missionsEndHour = new Map<string, number>();

  for (const hour of hours) {
    const dayTime = hour % HOURS_IN_DAY;
    const activeMissions = Object.entries(MISSIONS).filter(([_, { time }]) => {
      const [start, end] = time;
      return start <= dayTime && dayTime < end;
    });

    guardList.push({
      day: Math.floor(hour / HOURS_IN_DAY),
      hour: dayTime,
    });

    activeMissions.forEach(([missionName, { time, totalGuards }]) => {
      const guardListItem = guardList[guardList.length - 1];
      const missionEndHour = missionsEndHour.get(missionName);
      if (missionEndHour) {
        if (missionEndHour > dayTime) {
          return (guardListItem[missionName] = guardList[guardList.length - 2][missionName]);
        }
        missionsEndHour.delete(missionName);
      }

      const endHour = ThreeHoursShift.includes(missionName as Missions) ? dayTime + 3 : time[1];
      missionsEndHour.set(missionName, endHour);

      let neededGuards = totalGuards || 1;
      while (neededGuards > 0) {
        let guardName = " שומר";
        if ((dayTime >= 19 || dayTime < 7) && options.guardsCanGuardOnlyAtNight > 0) {
          guardName = `יכול לשמור רק בלילה ${options.guardsCanGuardOnlyAtNight}`;
          options.guardsCanGuardOnlyAtNight--;
          neededGuards--;
        } else if (missionName === Missions.SHINPE && options.guardsCanGuardOnlyInShinPe > 0) {
          guardName = `יכול לשמור רק בשינפה ${options.guardsCanGuardOnlyInShinPe}`;
          options.guardsCanGuardOnlyInShinPe--;
          neededGuards--;
        } else if (missionName !== Missions.KITCHEN && options.guardsCantGoToKitchen > 0) {
          guardName = `לא יכול ללכת למטבח ${options.guardsCantGoToKitchen}`;
          options.guardsCantGoToKitchen--;
          neededGuards--;
        } else if (options.normalGuards > 0) {
          guardName = `רגיל ${options.normalGuards}`;
          options.normalGuards--;
          neededGuards--;
        } else {
          neededGuards--;
        }

        const guardListItemMission = guardListItem[missionName] as string[];
        if (!guardListItemMission) {
          guardListItem[missionName] = [guardName];
        } else {
          guardListItemMission.push(guardName);
        }
      }
    });
  }

  return guardList;
};
