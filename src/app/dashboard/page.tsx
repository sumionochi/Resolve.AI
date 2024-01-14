// EventPage.tsx
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from 'react';
import prisma from "@/lib/db";

export const metadata: Metadata = {
  title: 'Resolve.AI - Display Page'
}

type Props = {}

const Dashboard = async (props: Props) => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const EveryResolve = await prisma.resolve.findMany({ where: { userId } });

  return (
    <div className="flex flex-col max-w-6xl mx-auto mt-10 gap-8 p-4">
      <div className="flex flex-col gap-4">
        {/* <Calendar EveryResolve={EveryResolve}/>
        <IssueChart EveryResolve={EveryResolve}/> */}
      </div>
      {/* <AIChatButton/> */}
      <div className="grid gap-4 place-content-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {/* {EveryResolve.map((resolve) => (
        <ResolveDisplay assessment={assessment} key={assessment.id} />
      ))} */}
      </div>
      
      {EveryResolve.length === 0 && (
        <p className="col-span-full text-center text-white text-xl font-semibold">
          Let's Build A New Resolution.
        </p>
      )}
    </div>
  )
}

export default Dashboard;
