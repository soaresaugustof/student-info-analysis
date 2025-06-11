"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Label } from "recharts"
import type { StudentData } from "@/lib/types"

interface OverviewProps {
  data: StudentData[]
}

export function Overview({ data }: OverviewProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        Nenhum dado disponível para exibir
      </div>
    )
  }

  const getMedian = (arr: number[]) => {
    if (arr.length === 0) return 0
    const sorted = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 !== 0
      ? Number(sorted[mid].toFixed(1))
      : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1))
  }

  const chartData = [
    {
      disciplina: "Matemática",
      média: data.length > 0 ? Number((data.reduce((sum, student) => sum + student.math_score, 0) / data.length).toFixed(1)) : 0,
      mediana: getMedian(data.map((s) => s.math_score)),
    },
    {
      disciplina: "Leitura",
      média: data.length > 0 ? Number((data.reduce((sum, student) => sum + student.reading_score, 0) / data.length).toFixed(1)) : 0,
      mediana: getMedian(data.map((s) => s.reading_score)),
    },
    {
      disciplina: "Escrita",
      média: data.length > 0 ? Number((data.reduce((sum, student) => sum + student.writing_score, 0) / data.length).toFixed(1)) : 0,
      mediana: getMedian(data.map((s) => s.writing_score)),
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="disciplina" />
        <YAxis domain={[0, 100]}>
          <Label value="Notas" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
        </YAxis>
        <Tooltip
          cursor={{ fill: 'hsla(var(--muted))' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        <Legend />
        <Bar dataKey="média" name="Média" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="mediana" name="Mediana" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
