"use client"

import { useState, useEffect } from "react"
import Papa, { ParseError, ParseResult } from "papaparse"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentStudents } from "@/components/recent-students"
import { StudentTable } from "@/components/student-table"
import { PerformanceAnalysis } from "@/components/performance-analysis"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { FilterBar } from "@/components/filter-bar"
import { CorrelationAnalysis } from "@/components/correlation-analysis"
import { BoxplotAnalysis } from "@/components/boxplot-analysis"
import type { StudentData, FilterState } from "@/lib/types"

// Função para mapear nomes de colunas do CSV para o tipo StudentData
const mapRowToStudentData = (row: any): StudentData => ({
  student_id: row["student_id"],
  name: row["name"],
  gender: row["gender"],
  age: Number(row["age"]) || 0,
  grade_level: row["grade_level"],
  math_score: Number(row["math score"]) || 0,
  reading_score: Number(row["reading score"]) || 0,
  writing_score: Number(row["writing score"]) || 0,
  attendance_rate: Number(row["attendance_rate"]) || 0,
  parent_education: row["parental level of education"],
  study_hours: Number(row["study hours"]) || 0,
  internet_access: row["internet access"],
  lunch_type: row["lunch"],
  extra_activities: row["test preparation course"],
  final_result: row["final_result"],
})

export default function Dashboard() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    gender: "all",
    gradeLevel: "all",
    finalResult: "all",
    parentEducation: "all",
  })

  const handleFileUpload = (file: File) => {
    setIsLoading(true)
    setError(null)
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      Papa.parse(text, {
        header: true,
        complete: (results: ParseResult<any>) => {
          try {
            const parsedData = results.data
              .filter((row: any) => row.student_id && row.name) // Filter out empty rows
              .map(mapRowToStudentData)

            console.log("Parsed data:", parsedData.slice(0, 3))
            setStudents(parsedData)
            setFilteredStudents(parsedData)
            setIsLoading(false)
          } catch (err) {
            console.error("Error processing data:", err)
            setError("Erro ao processar os dados do arquivo")
            setIsLoading(false)
          }
        },
        error: (error: ParseError) => {
          console.error("Error parsing CSV:", error)
          setError("Erro ao ler o arquivo CSV")
          setIsLoading(false)
        },
      } as any) // <-- Força o tipo para evitar erro de overload
    };
    reader.readAsText(file);
  }

  useEffect(() => {
    // Apply filters
    let result = [...students]

    if (filters.gender !== "all") {
      result = result.filter((student) => student.gender === filters.gender)
    }

    if (filters.gradeLevel !== "all") {
      result = result.filter((student) => student.grade_level === filters.gradeLevel)
    }

    if (filters.finalResult !== "all") {
      result = result.filter((student) => student.final_result === filters.finalResult)
    }

    if (filters.parentEducation !== "all") {
      result = result.filter((student) => student.parent_education === filters.parentEducation)
    }

    setFilteredStudents(result)
  }, [filters, students])

  useEffect(() => {
    // Load CSV data on component mount
    const loadCSVData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Loading CSV data from URL...")

        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/student_info-Oo9xIxxKUEWLsxpw27UlBW2dD40FSn.csv",
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const csvText = await response.text()
        console.log("CSV text length:", csvText.length)

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: ParseResult<any>) => {
            try {
              console.log("Parse results:", results.data.length, "rows")

              const parsedData = results.data
                .filter((row: any) => row.student_id && row.name) // Filter out empty rows
                .map(mapRowToStudentData)

              console.log(`Successfully loaded ${parsedData.length} student records`)
              console.log("Sample data:", parsedData.slice(0, 3))

              setStudents(parsedData)
              setFilteredStudents(parsedData)
              setIsLoading(false)
            } catch (err) {
              console.error("Error processing parsed data:", err)
              setError("Erro ao processar os dados")
              setIsLoading(false)
            }
          },
          error: (error: ParseError) => {
            console.error("Error parsing CSV:", error)
            setError("Erro ao analisar o arquivo CSV")
            setIsLoading(false)
          },
        } as any) // <-- Força o tipo para evitar erro de overload
      } catch (error) {
        console.error("Error fetching CSV:", error)
        setError("Erro ao carregar os dados")
        setIsLoading(false)
      }
    }

    loadCSVData()
  }, [])

  if (error) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[400px] text-center">
          <div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar dados</h2>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        title="Dashboard Educacional"
        description="Análise de desempenho dos alunos seguindo contextos específicos"
        onFileUpload={handleFileUpload}
      />

      {students.length > 0 && <FilterBar filters={filters} setFilters={setFilters} data={students} />}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="boxplot">Distribuição</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="correlation">Correlações</TabsTrigger>
          <TabsTrigger value="students">Alunos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredStudents.length}</div>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? "Carregando..." : `${students.length} total`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média Matemática</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredStudents.length > 0
                    ? (
                        filteredStudents.reduce((sum, student) => sum + student.math_score, 0) / filteredStudents.length
                      ).toFixed(1)
                    : "0"}
                </div>
                <p className="text-xs text-muted-foreground">{isLoading ? "Carregando..." : "De 100 pontos"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredStudents.length > 0
                    ? `${((filteredStudents.filter((s) => s.final_result === "Aprovado").length / filteredStudents.length) * 100).toFixed(1)}%`
                    : "0%"}
                </div>
                <p className="text-xs text-muted-foreground">{isLoading ? "Carregando..." : "Dos alunos filtrados"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média de Frequência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredStudents.length > 0
                    ? `${(filteredStudents.reduce((sum, student) => sum + student.attendance_rate, 0) / filteredStudents.length).toFixed(2)}%`
                    : "0%"}
                </div>
                <p className="text-xs text-muted-foreground">{isLoading ? "Carregando..." : "Taxa de presença"}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Distribuição de Notas por Disciplina</CardTitle>
                <CardDescription>Média e mediana por disciplina (Contexto 1)</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                    Carregando gráfico...
                  </div>
                ) : (
                  <Overview data={filteredStudents} />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Alunos Recentes</CardTitle>
                <CardDescription>Últimos 5 alunos da lista</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">Carregando...</div>
                ) : (
                  <RecentStudents data={filteredStudents.slice(0, 5)} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="boxplot" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-[400px] text-muted-foreground">
                Carregando análise de distribuição...
              </CardContent>
            </Card>
          ) : (
            <BoxplotAnalysis data={filteredStudents} />
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-full">
                <CardContent className="flex items-center justify-center h-[200px] text-muted-foreground">
                  Carregando análise de desempenho...
                </CardContent>
              </Card>
            </div>
          ) : (
            <PerformanceAnalysis data={filteredStudents} />
          )}
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-full">
                <CardContent className="flex items-center justify-center h-[200px] text-muted-foreground">
                  Carregando análise de correlação...
                </CardContent>
              </Card>
            </div>
          ) : (
            <CorrelationAnalysis data={filteredStudents} />
          )}
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-[400px] text-muted-foreground">
                Carregando tabela de alunos...
              </CardContent>
            </Card>
          ) : (
            <StudentTable data={filteredStudents} />
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}