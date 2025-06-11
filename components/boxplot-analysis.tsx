"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { StudentData } from "@/lib/types"
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts"

interface BoxplotAnalysisProps {
  data: StudentData[]
}

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

  return {
    q1: Number(q1.toFixed(1)),
    median: Number(median.toFixed(1)),
    q3: Number(q3.toFixed(1)),
    min: Number(min.toFixed(1)),
    max: Number(max.toFixed(1)),
    mean: Number(mean.toFixed(1)),
  }
}

export function BoxplotAnalysis({ data }: BoxplotAnalysisProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[200px] text-muted-foreground">
          Carregando dados para análise...
        </CardContent>
      </Card>
    )
  }

  const chartData = [
    {
      disciplina: "Matemática",
      ...calculateStats(data.map((s) => s.math_score)),
    },
    {
      disciplina: "Leitura",
      ...calculateStats(data.map((s) => s.reading_score)),
    },
    {
      disciplina: "Escrita",
      ...calculateStats(data.map((s) => s.writing_score)),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição Estatística das Notas</CardTitle>
        <CardDescription>Análise de Média, Mediana, Quartis e valores extremos por disciplina.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="disciplina" />
            <YAxis domain={[0, 100]}>
              <Label value="Notas" angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} />
            </YAxis>
            <Tooltip
              cursor={{ fill: "hsla(var(--muted))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Legend />
            <Bar dataKey="max" name="Máximo" fill="hsl(var(--chart-5))" />
            <Bar dataKey="q3" name="3º Quartil (Q3)" fill="hsl(var(--chart-4))" />
            <Bar dataKey="median" name="Mediana" fill="hsl(var(--chart-3))" />
            <Bar dataKey="q1" name="1º Quartil (Q1)" fill="hsl(var(--chart-2))" />
            <Bar dataKey="min" name="Mínimo" fill="hsl(var(--chart-1))" />
            <Line type="monotone" dataKey="mean" name="Média" stroke="hsl(var(--destructive))" strokeWidth={3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {chartData.map((item) => (
            <div key={item.disciplina} className="space-y-1 p-3 border rounded-lg bg-muted/50">
              <h4 className="font-semibold text-center">{item.disciplina}</h4>
              <p>
                <span className="font-medium">Média:</span> {item.mean}
              </p>
              <p>
                <span className="font-medium">Mediana:</span> {item.median}
              </p>
              <p>
                <span className="font-medium">Quartis:</span> Q1: {item.q1} | Q3: {item.q3}
              </p>
              <p>
                <span className="font-medium">Amplitude:</span> Mín: {item.min} | Máx: {item.max}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
