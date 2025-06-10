"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { StudentData } from "@/lib/types"

interface OverviewProps {
  data: StudentData[]
}

export function Overview({ data }: OverviewProps) {
  console.log("Overview - received data:", data.length)

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        Nenhum dado disponível para exibir
      </div>
    )
  }

  // Prepare data for grouped bar chart by discipline (Contexto 1)
  const getMedian = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    if (sorted.length === 0) return 0
    return sorted.length % 2 !== 0
      ? Number(sorted[mid].toFixed(1))
      : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1))
  }

  const chartData = [
    {
      disciplina: "Matemática",
      média: data.length > 0 ? Number((data.reduce((sum, student) => sum + (typeof student.math_score === 'number' ? student.math_score : 0), 0) / data.length).toFixed(1)) : 0,
      mediana: getMedian(data.map((s) => typeof s.math_score === 'number' ? s.math_score : 0)),
    },
    {
      disciplina: "Leitura",
      média: data.length > 0 ? Number((data.reduce((sum, student) => sum + (typeof student.reading_score === 'number' ? student.reading_score : 0), 0) / data.length).toFixed(1)) : 0,
      mediana: getMedian(data.map((s) => typeof s.reading_score === 'number' ? s.reading_score : 0)),
    },
    {
      disciplina: "Escrita",
      média: data.length > 0 ? Number((data.reduce((sum, student) => sum + (typeof student.writing_score === 'number' ? student.writing_score : 0), 0) / data.length).toFixed(1)) : 0,
      mediana: getMedian(data.map((s) => typeof s.writing_score === 'number' ? s.writing_score : 0)),
    },
  ]

  console.log("Overview chart data:", chartData)

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
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="média" name="Média" fill="#8884d8" />
        <Bar dataKey="mediana" name="Mediana" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}
