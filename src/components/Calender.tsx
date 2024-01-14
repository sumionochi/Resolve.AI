"use client";
import React from "react";
import dayjs from "dayjs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { Resolve } from "@prisma/client";

interface Props {
  EveryResolve: Resolve[];
}

export default function Calendar({ EveryResolve }: Props) {
  function getDateInYear(year = dayjs().year(), month = dayjs().month()) {
    const startDate = dayjs().year(year).month(month).date(1).startOf('year');
    const endDate = dayjs().year(year).month(month).date(1).endOf("year");
    const datesArray = [];

    for (let currentDay = startDate.clone(); currentDay.isBefore(endDate) || currentDay.isSame(endDate); currentDay = currentDay.add(1, 'day')) {
      datesArray.push(currentDay.format("YYYY-MM-DD"));
    }
    return datesArray;
  }

  const getColor = (value: number) => {
    if (value === 0) {
      return 'bg-gray-300';
    } else if (value < 15) {
      return "bg-gradient-to-br from-violet-300 to-orange-300";
    } else if (value < 30) {
      return "bg-gradient-to-br from-violet-400 to-orange-500";
    } else {
      return "bg-gradient-to-br from-violet-700 to-orange-500";
    }
  };

  return (
    <div className="bg-secondary rounded-lg p-6 text-center space-y-4 shadow-md shadow-black">
      <h1 className="text-4xl font-bold">Resolution Map Of {dayjs().year()}</h1>
      <div className="flex flex-wrap gap-1 justify-center rounded-md">
        {getDateInYear().map((day, index) => {
          const matchingEvent = EveryResolve.find((event) => event.timeframeFrom === day);
          const value = matchingEvent ? Math.floor((dayjs(matchingEvent.timeframeTo).diff(dayjs(matchingEvent.timeframeFrom), 'day'))) : 0;
          const timeframeFrom = matchingEvent ? new Date(matchingEvent.timeframeFrom) : null;
          const timeframeTo = matchingEvent ? new Date(matchingEvent.timeframeTo) : null;
          const daysDifference = timeframeFrom && timeframeTo ? Math.floor((timeframeTo.getTime() - timeframeFrom.getTime()) / (1000 * 60 * 60 * 24)) : 0;

          return (
            <HoverCard key={index}>
              <HoverCardTrigger className="">
                <div
                  className={cn(
                    "h-4 w-4 rounded-sm cursor-pointer",
                    getColor(value || 0)
                  )}
                ></div>
              </HoverCardTrigger>
              <HoverCardContent className="flex text-sm text-start flex-col">
                {matchingEvent &&
                  <div>
                    <p>Goal: <span className="font-semibold">{matchingEvent.goal}</span></p>
                    <p>On: <span className="font-semibold">{day}</span></p>
                    <p>Target Till Completion: <span className="font-semibold">{daysDifference}</span> days by <span className="font-semibold">{matchingEvent.timeframeTo}</span></p>
                  </div>}
                {!matchingEvent &&
                  <div>
                    <p className="">No Resolution Was Made.</p>
                    <p>On <span className="font-semibold">{day}</span></p>
                  </div>}
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    </div>
  );
}
