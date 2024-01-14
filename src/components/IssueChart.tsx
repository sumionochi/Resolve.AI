'use client'
import React from 'react'
import { Card } from './ui/card'
import {ResponsiveContainer, BarChart, XAxis, YAxis, Bar} from 'recharts'
import { Resolve } from '@prisma/client'

interface Props {
  EveryResolve: Resolve[];
}

const IssueChart = ({EveryResolve}: Props) => {
  const res = EveryResolve.length;
  const cs = EveryResolve.reduce((count, resolve) => {
    // Count checkboxes that are true
    return count + resolve.checkbox.filter((value) => value === 'Completed').length;
  }, 0);

  const is = EveryResolve.reduce((count, resolve) => {
    // Count checkboxes that are false
    return count + resolve.checkbox.filter((value) => value === 'Not Yet Started').length;
  }, 0);  

  const ps = EveryResolve.reduce((count, resolve) => {
    // Count checkboxes that are false
    return count + resolve.checkbox.filter((value) => value === 'On Going').length;
  }, 0);  

  const data = [
    { label: 'Resolutions', value: res },
    { label: 'Completed Steps', value: cs },
    { label: 'In Progress', value: is },
    { label: 'Incompleted Steps', value: ps },
  ];
    return (
    <Card className='w-full p-4 pt-10 pr-10 bg-secondary shadow-md shadow-black'>
        <ResponsiveContainer width={'100%'} height={300}>
            <BarChart data={data}>
                <XAxis className=' bg-cyan-800' dataKey={"label"}/>
                <YAxis className=' bg-cyan-800'/>
                <Bar fill="#C667FC" dataKey={'value'} barSize={100}/>
            </BarChart>
        </ResponsiveContainer>
    </Card>
    )
}

export default IssueChart