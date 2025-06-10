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
} from "recharts"

interface PerformanceAnalysisProps {
  data: StudentData[]
}

export function PerformanceAnalysis({ data }: PerformanceAnalysisProps) {
  console.log("Performance Analysis - received data:", data.length)

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

  // Contexto 2: Quantidade de alunos por gênero (Gráfico de barras)
  const genderData = Array.from(
    data.reduce((acc, student) => {
      const gender = student.gender || "Não informado"
      acc.set(gender, (acc.get(gender) || 0) + 1)
      return acc
    }, new Map<string, number>()),
  ).map(([name, value]) => ({ name, value }))

  // Contexto 3: Distribuição de aprovação/reprovação (Gráfico de pizza)
  const resultData = Array.from(
    data.reduce((acc, student) => {
      const result = student.final_result || "N/A"
      acc.set(result, (acc.get(result) || 0) + 1)
      return acc
    }, new Map<string, number>()),
  ).map(([name, value]) => ({ name, value }))

  // Contexto 4: Média das notas por série escolar (Gráfico de barras agrupadas)
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
      current.matemática += typeof student.math_score === 'number' ? student.math_score : 0
      current.leitura += typeof student.reading_score === 'number' ? student.reading_score : 0
      current.escrita += typeof student.writing_score === 'number' ? student.writing_score : 0
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
    .sort((a, b) => (a.série > b.série ? 1 : -1))

  // Colors
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Contexto 2: Quantidade de alunos por gênero */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Quantidade de Alunos por Gênero</CardTitle>
          <CardDescription>Distribuição dos alunos por gênero (Contexto 2)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={genderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contexto 3: Distribuição de aprovação/reprovação */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Distribuição de Aprovação/Reprovação</CardTitle>
          <CardDescription>Proporção entre Aprovado e Reprovado (Contexto 3)</CardDescription>
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
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {resultData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contexto 4: Média das notas por série escolar */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Média das Notas por Série</CardTitle>
          <CardDescription>Comparação por grade_level (Contexto 4)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeLevelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="série" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="matemática" name="Matemática" fill="#8884d8" />
              <Bar dataKey="leitura" name="Leitura" fill="#82ca9d" />
              <Bar dataKey="escrita" name="Escrita" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}