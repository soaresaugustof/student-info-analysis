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
  Label,
} from "recharts"

interface CorrelationAnalysisProps {
  data: StudentData[]
}

const CustomTooltip = ({ active, payload, label, title }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 border bg-background rounded-md shadow-lg text-xs">
        <p className="font-bold mb-1">{`${title}: ${label}`}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} style={{ color: p.color }}>
            {`${p.name}: ${p.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CorrelationAnalysis({ data }: CorrelationAnalysisProps) {
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

  const studyHoursData = data
    .map((student) => ({
      studyHours: student.study_hours,
      averageScore: Number(
        ((student.math_score + student.reading_score + student.writing_score) / 3).toFixed(1)
      ),
    }))

  const attendanceGroups = data.reduce(
    (acc, student) => {
      const attendanceKey = Math.round(student.attendance_rate / 10) * 10
      if (!acc[attendanceKey]) {
        acc[attendanceKey] = { totals: { math: 0, reading: 0, writing: 0 }, count: 0 }
      }
      acc[attendanceKey].totals.math += student.math_score
      acc[attendanceKey].totals.reading += student.reading_score
      acc[attendanceKey].totals.writing += student.writing_score
      acc[attendanceKey].count += 1
      return acc
    },
    {} as Record<number, { totals: { math: number; reading: number; writing: number }; count: number }>,
  )

  const attendanceData = Object.entries(attendanceGroups)
    .map(([attendance, d]) => ({
      attendance: Number(attendance),
      Matemática: d.count > 0 ? Number((d.totals.math / d.count).toFixed(1)) : 0,
      Leitura: d.count > 0 ? Number((d.totals.reading / d.count).toFixed(1)) : 0,
      Escrita: d.count > 0 ? Number((d.totals.writing / d.count).toFixed(1)) : 0,
    }))
    .sort((a, b) => a.attendance - b.attendance)

  const educationData = Array.from(
    data.reduce(
      (acc, student) => {
        const education = student.parent_education || "Não especificado"
        if (!acc.has(education)) {
          acc.set(education, { education, matemática: 0, leitura: 0, escrita: 0, count: 0, })
        }
        const current = acc.get(education)!
        current.matemática += student.math_score
        current.leitura += student.reading_score
        current.escrita += student.writing_score
        current.count += 1
        return acc
      }, new Map<string, { education: string; matemática: number; leitura: number; escrita: number; count: number }>(),
    ),
  )
    .map(([_, { education, matemática, leitura, escrita, count }]) => ({
      education,
      matemática: count > 0 ? Number((matemática / count).toFixed(1)) : 0,
      leitura: count > 0 ? Number((leitura / count).toFixed(1)) : 0,
      escrita: count > 0 ? Number((escrita / count).toFixed(1)) : 0,
    }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Horas de Estudo vs. Desempenho</CardTitle>
          <CardDescription>Visualização da correlação entre horas de estudo e a nota média final.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="studyHours" name="Horas de Estudo">
                <Label value="Horas de Estudo" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis type="number" dataKey="averageScore" name="Nota Média" domain={[0, 100]}>
                 <Label value="Nota Média" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: 'hsl(var(--background))' }} />
              <Scatter name="Nota Média por Horas de Estudo" data={studyHoursData} fill="hsl(var(--chart-1))" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Frequência vs. Notas Médias</CardTitle>
          <CardDescription>Análise da tendência das notas conforme a taxa de frequência.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="attendance" tickFormatter={(tick) => `${tick}%`}>
                 <Label value="Faixa de Frequência" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis domain={[0, 100]}>
                <Label value="Nota Média" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip content={<CustomTooltip title="Frequência" />} />
              <Legend />
              <Line type="monotone" dataKey="Matemática" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              <Line type="monotone" dataKey="Leitura" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              <Line type="monotone" dataKey="Escrita" stroke="hsl(var(--chart-3))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Impacto da Educação dos Pais no Desempenho</CardTitle>
          <CardDescription>Comparativo do desempenho médio dos alunos segundo o nível educacional dos pais.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={educationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="education" angle={-45} textAnchor="end" height={80} interval={0} />
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
