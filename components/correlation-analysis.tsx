"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { StudentData } from "@/lib/types"
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  BarChart,
  Bar,
} from "recharts"

interface CorrelationAnalysisProps {
  data: StudentData[]
}

export function CorrelationAnalysis({ data }: CorrelationAnalysisProps) {
  console.log("Correlation Analysis data:", data.length)

  if (data.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-center h-[200px] text-muted-foreground">
            Carregando dados para análise de correlação...
          </CardContent>
        </Card>
      </div>
    )
  }

  // Contexto 5: Correlação entre horas de estudo e notas (Gráfico de dispersão)
  const studyHoursData = data
    .filter((student) => typeof student.study_hours === 'number' && typeof student.math_score === 'number')
    .map((student) => ({
      studyHours: student.study_hours ?? 0,
      averageScore: Number(
        (((student.math_score ?? 0) + (student.reading_score ?? 0) + (student.writing_score ?? 0)) / 3).toFixed(1),
      ),
    }))
    .filter((d) => d.studyHours > 0 || d.averageScore > 0)

  // Contexto 6: Relação entre frequência e notas médias (Gráfico de linha)
  const attendanceGroups = data.reduce(
    (acc, student) => {
      const attendanceKey = Math.round((student.attendance_rate ?? 0) / 10) * 10
      if (!acc[attendanceKey]) {
        acc[attendanceKey] = { mathTotal: 0, readingTotal: 0, writingTotal: 0, count: 0 }
      }
      acc[attendanceKey].mathTotal += typeof student.math_score === 'number' ? student.math_score : 0
      acc[attendanceKey].readingTotal += typeof student.reading_score === 'number' ? student.reading_score : 0
      acc[attendanceKey].writingTotal += typeof student.writing_score === 'number' ? student.writing_score : 0
      acc[attendanceKey].count += 1
      return acc
    },
    {} as Record<number, { mathTotal: number; readingTotal: number; writingTotal: number; count: number }>,
  )

  const attendanceData = Object.entries(attendanceGroups)
    .map(([attendance, d]) => ({
      attendance: Number(attendance),
      mathAvg: d.count > 0 ? Number((d.mathTotal / d.count).toFixed(1)) : 0,
      readingAvg: d.count > 0 ? Number((d.readingTotal / d.count).toFixed(1)) : 0,
      writingAvg: d.count > 0 ? Number((d.writingTotal / d.count).toFixed(1)) : 0,
    }))
    .sort((a, b) => a.attendance - b.attendance)
    .filter((d) => d.mathAvg > 0 || d.readingAvg > 0 || d.writingAvg > 0)

  // Contexto 7: Impacto do nível educacional dos pais nas notas (Gráfico de barras agrupadas)
  const educationData = Array.from(
    data.reduce(
      (acc, student) => {
        const education = student.parent_education || "Não especificado"
        if (!acc.has(education)) {
          acc.set(education, {
            education,
            matemática: 0,
            leitura: 0,
            escrita: 0,
            count: 0,
          })
        }
        const current = acc.get(education)!
        current.matemática += typeof student.math_score === 'number' ? student.math_score : 0
        current.leitura += typeof student.reading_score === 'number' ? student.reading_score : 0
        current.escrita += typeof student.writing_score === 'number' ? student.writing_score : 0
        current.count += 1
        return acc
      },
      new Map<string, { education: string; matemática: number; leitura: number; escrita: number; count: number }>(),
    ),
  )
    .map(([_, { education, matemática, leitura, escrita, count }]) => ({
      education,
      matemática: count > 0 ? Number((matemática / count).toFixed(1)) : 0,
      leitura: count > 0 ? Number((leitura / count).toFixed(1)) : 0,
      escrita: count > 0 ? Number((escrita / count).toFixed(1)) : 0,
    }))
    .filter((d) => d.matemática > 0 || d.leitura > 0 || d.escrita > 0)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Contexto 5: Correlação entre horas de estudo e notas */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Horas de Estudo vs Desempenho</CardTitle>
          <CardDescription>Correlação entre study_hours e notas (Contexto 5)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart data={studyHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="studyHours" name="Horas de Estudo" />
              <YAxis dataKey="averageScore" name="Nota Média" domain={[0, 100]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Nota Média" data={studyHoursData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contexto 6: Relação entre frequência e notas médias */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Frequência vs Notas Médias</CardTitle>
          <CardDescription>Correlação entre attendance_rate e média das notas (Contexto 6)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attendance" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mathAvg" name="Matemática" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="readingAvg" name="Leitura" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="writingAvg" name="Escrita" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contexto 7: Impacto do nível educacional dos pais nas notas */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Impacto da Educação dos Pais no Desempenho</CardTitle>
          <CardDescription>Desempenho médio por parent_education (Contexto 7)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={educationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="education" angle={-45} textAnchor="end" height={80} />
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