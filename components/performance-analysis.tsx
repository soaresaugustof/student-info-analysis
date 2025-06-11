"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { StudentData } from "@/lib/types"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts"

interface PerformanceAnalysisProps {
  data: StudentData[]
}

export function PerformanceAnalysis({ data }: PerformanceAnalysisProps) {
  if (!data || data.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-center h-[200px] text-muted-foreground">
            Nenhum dado disponível para análise
          </CardContent>
        </Card>
      </div>
    )
  }

  const genderData = Array.from(
    data.reduce((acc, student) => {
      const gender = student.gender || "Não informado"
      acc.set(gender, (acc.get(gender) || 0) + 1)
      return acc
    }, new Map<string, number>()),
  ).map(([name, value]) => ({ name, value }))

  const resultData = Array.from(
    data.reduce((acc, student) => {
      const result = student.final_result || "N/A"
      acc.set(result, (acc.get(result) || 0) + 1)
      return acc
    }, new Map<string, number>()),
  ).map(([name, value]) => ({ name, value }))

  const gradeLevelData = Array.from(
    data.reduce((acc, student) => {
      const gradeLevel = student.grade_level?.toString() || "N/A"
      if (!acc.has(gradeLevel)) {
        acc.set(gradeLevel, {
          série: gradeLevel,
          matemática: 0,
          leitura: 0,
          escrita: 0,
          count: 0,
        })
      }
      const current = acc.get(gradeLevel)!
      current.matemática += student.math_score
      current.leitura += student.reading_score
      current.escrita += student.writing_score
      current.count += 1
      return acc
    }, new Map<string, { série: string; matemática: number; leitura: number; escrita: number; count: number }>()),
  )
    .map(([_, { série, matemática, leitura, escrita, count }]) => ({
      série,
      matemática: count > 0 ? Number((matemática / count).toFixed(1)) : 0,
      leitura: count > 0 ? Number((leitura / count).toFixed(1)) : 0,
      escrita: count > 0 ? Number((escrita / count).toFixed(1)) : 0,
    }))
    .sort((a, b) => (String(a.série) > String(b.série) ? 1 : -1))

  const RESULT_COLORS: { [key: string]: string } = {
    Pass: "hsl(var(--chart-2))",
    Fail: "hsl(var(--destructive))",
    "N/A": "hsl(var(--muted-foreground))",
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Alunos por Gênero</CardTitle>
          <CardDescription>Contagem total de alunos por gênero.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={genderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis>
                <Label value="Nº de Alunos" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip
                cursor={{ fill: 'hsla(var(--muted))' }}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              />
              <Bar dataKey="value" fill="hsl(var(--chart-1))" name="Quantidade" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Distribuição de Resultados</CardTitle>
          <CardDescription>Proporção de alunos aprovados e reprovados.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={resultData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {resultData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={RESULT_COLORS[entry.name] || "hsl(var(--muted))"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Média das Notas por Série</CardTitle>
          <CardDescription>Desempenho médio dos alunos em cada série.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeLevelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="série" />
              <YAxis domain={[0, 100]}>
                <Label value="Nota Média" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip
                cursor={{ fill: 'hsla(var(--muted))' }}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              />
              <Legend />
              <Bar dataKey="matemática" name="Matemática" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leitura" name="Leitura" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="escrita" name="Escrita" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
