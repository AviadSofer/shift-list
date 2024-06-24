"use client";
import { useState } from "react";
import { GuardsOptions, generateSchedule } from "./helpers/algorithm";

function Home() {
  const [guardsOptions, setGuardsOptions] = useState<GuardsOptions>({
    normalGuards: 0,
    guardsCanGuardOnlyAtNight: 0,
    guardsCanGuardOnlyInShinPe: 0,
    guardsCantGoToKitchen: 0,
  });
  const [schedule, setSchedule] = useState<Record<string, number | string[]>[]>([]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuardsOptions((prev) => ({
      ...prev,
      [e.target.name]: +e.target.value,
    }));
  };

  return (
    <div
      style={{
        direction: "rtl",
      }}
      className="flex min-h-screen items-center justify-center"
    >
      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow-lg">
        <div className="flex flex-col gap-2 md:flex-row">
          {Object.entries(guardsOptions).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <label htmlFor={key}>{key}</label>
              <input
                id={key}
                type="number"
                name={key}
                value={value || ""}
                onChange={onChangeHandler}
                className="w-[100px] rounded-md border border-gray-300 p-1 text-center"
              />
            </div>
          ))}
        </div>

        <button
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
          onClick={() => {
            const schedule = generateSchedule(guardsOptions);
            setSchedule(schedule);
          }}
        >
          יצירה
        </button>

        <h1 className="mb-4 text-center text-2xl font-bold">שיבוצים</h1>

        <div className="h-[80vh] w-[80vw] overflow-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr className="text-lg font-bold">
                <th className="whitespace-nowrap px-10 py-3 text-right uppercase tracking-wider text-gray-500">
                  יום בשבוע
                </th>
                <th className="whitespace-nowrap px-10 py-3 text-right uppercase tracking-wider text-gray-500">
                  שעה (0-23)
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-right uppercase tracking-wider text-gray-500">
                  שיבוצים
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {schedule.map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{item.day}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{item.hour}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      {Object.entries(item)
                        .filter(([key]) => key !== "day" && key !== "hour")
                        .map(([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong>{" "}
                            {Array.isArray(value) ? value.join(", ") : value}
                          </div>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
