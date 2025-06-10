"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { StudentData } from "@/lib/types"
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface BoxplotAnalysisProps {
  data: StudentData[]
}

export function BoxplotAnalysis({ data }: BoxplotAnalysisProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[200px] text-muted-foreground">
          Carregando dados para análise boxplot...
        </CardContent>
      </Card>
    )
  }

  // Contexto 1: Distribuição de notas por disciplina (Boxplot simulado com estatísticas)
  const calculateStats = (scores: number[]) => {
    if (scores.length === 0) return { q1: 0, median: 0, q3: 0, min: 0, max: 0, mean: 0 }
    const sorted = [...scores].sort((a, b) => a - b)
    const q1 = sorted[Math.floor(sorted.length * 0.25)]
    const median =
      sorted.length % 2 !== 0
        ? sorted[Math.floor(sorted.length / 2)]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    const q3 = sorted[Math.floor(sorted.length * 0.75)]
    const min = Math.min(...sorted)
    const max = Math.max(...sorted)
    const mean = sorted.reduce((sum, val) => sum + val, 0) / sorted.length

    return { q1, median, q3, min, max, mean }
  }

  const mathScores = data.map((s) => s.math_score ?? 0).filter((s) => s > 0)
  const readingScores = data.map((s) => s.reading_score ?? 0).filter((s) => s > 0)
  const writingScores = data.map((s) => s.writing_score ?? 0).filter((s) => s > 0)

  const boxplotData = [
    {
      disciplina: "Matemática",
      ...calculateStats(mathScores),
    },
    {
      disciplina: "Leitura",
      ...calculateStats(readingScores),
    },
    {
      disciplina: "Escrita",
      ...calculateStats(writingScores),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Notas por Disciplina</CardTitle>
        <CardDescription>Estatísticas descritivas - mediana, quartis e outliers (Contexto 1)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={boxplotData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="disciplina" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="min" name="Mínimo" fill="#ff7300" />
            <Bar dataKey="q1" name="Q1" fill="#ffc658" />
            <Bar dataKey="median" name="Mediana" fill="#8884d8" />
            <Bar dataKey="q3" name="Q3" fill="#82ca9d" />
            <Bar dataKey="max" name="Máximo" fill="#00ff00" />
            <Line type="monotone" dataKey="mean" stroke="#ff0000" strokeWidth={3} name="Média" />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          {boxplotData.map((item) => (
            <div key={item.disciplina} className="space-y-1 p-3 border rounded-lg">
              <h4 className="font-semibold text-center">{item.disciplina}</h4>
              <p>
                <span className="font-medium">Média:</span> {item.mean.toFixed(1)}
              </p>
              <p>
                <span className="font-medium">Mediana:</span> {item.median}
              </p>
              <p>
                <span className="font-medium">Q1:</span> {item.q1} | <span className="font-medium">Q3:</span> {item.q3}
              </p>
              <p>
                <span className="font-medium">Min:</span> {item.min} | <span className="font-medium">Max:</span> {item.max}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
