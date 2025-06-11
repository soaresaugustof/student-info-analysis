"use client"

import { useState, useEffect } from "react"
import Papa, { ParseConfig, ParseResult } from "papaparse"
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

// Helper para converter valores para número de forma segura
const parseSafeNumber = (value: any): number => {
  if (value === null || value === undefined) return 0
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const num = parseFloat(value.replace(",", "."))
    return isNaN(num) ? 0 : num
  }
  return 0
}

// Mapeamento flexível que aceita variações nos nomes das colunas
const mapRowToStudentData = (row: any): StudentData => {
  return {
    student_id: String(row["student_id"] ?? ""),
    name: row["name"] || "",
    gender: row["gender"] || "",
    age: parseSafeNumber(row["age"]),
    grade_level: String(row["grade_level"] ?? ""),
    math_score: parseSafeNumber(row["math score"] || row["math_score"]),
    reading_score: parseSafeNumber(row["reading score"] || row["reading_score"]),
    writing_score: parseSafeNumber(row["writing score"] || row["writing_score"]),
    attendance_rate: parseSafeNumber(row["attendance_rate"] || row["attendance rate"]),
    parent_education: row["parental level of education"] || row["parent_education"],
    study_hours: parseSafeNumber(row["study hours"] || row["study_hours"]),
    internet_access: row["internet access"] || row["internet_access"],
    lunch_type: row["lunch"] || "",
    extra_activities: row["test preparation course"] || row["extra_activities"],
    final_result: row["final_result"] || "",
  }
}

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

  const parseAndSetData = (csvText: string) => {
    if (!csvText || typeof csvText !== "string") {
      setError("Arquivo CSV inválido ou vazio.")
      setIsLoading(false)
      return
    }

    const firstLine = csvText.substring(0, csvText.indexOf("\n"))
    const detectedDelimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ";" : ","
    console.log(`[Dashboard] Delimitador detectado: '${detectedDelimiter}'`)

    const config: ParseConfig = {
      delimiter: detectedDelimiter,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results: ParseResult<any>) => {
        if (results.errors.length) {
          console.error("Erros de parse:", results.errors)
          setError("Erro ao ler o arquivo CSV. Verifique o delimitador e as aspas.")
          setIsLoading(false)
          return
        }
        
        console.log("[Dashboard] Cabeçalhos do CSV (processados):", results.meta.fields);
        console.log("[Dashboard] Primeira linha de dados brutos:", results.data[0]);

        try {
          const parsedData = results.data.filter((row: any) => row.student_id && row.name).map(mapRowToStudentData)
          
          if (parsedData.length === 0) {
            setError("Nenhum dado de aluno válido encontrado. Verifique se os nomes das colunas (student_id, name) estão corretos no arquivo.")
            setIsLoading(false)
            return
          }
          
          console.log("[Dashboard] Primeira linha de dados mapeados:", parsedData[0]);

          setStudents(parsedData)
          setFilteredStudents(parsedData)
        } catch (err) {
          console.error("Erro ao processar dados mapeados:", err)
          setError("Ocorreu um erro ao processar os dados do arquivo.")
        } finally {
          setIsLoading(false)
        }
      },
    }
    Papa.parse(csvText, config)
  }

  const handleFileUpload = (file: File) => {
    setIsLoading(true)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      parseAndSetData(text)
    }
    reader.onerror = () => {
      setError("Falha ao ler o arquivo.")
      setIsLoading(false)
    }
    reader.readAsText(file)
  }

  useEffect(() => {
    let result = [...students]
    if (filters.gender !== "all") {
      result = result.filter((student) => student.gender === filters.gender)
    }
    if (filters.gradeLevel !== "all") {
      result = result.filter((student) => String(student.grade_level) === filters.gradeLevel)
    }
    if (filters.finalResult !== "all") {
      result = result.filter((student) => student.final_result === filters.finalResult)
    }
    if (filters.parentEducation !== "all") {
      result = result.filter(
        (student) => (student.parent_education || "Não especificado") === filters.parentEducation
      )
    }
    setFilteredStudents(result)
  }, [filters, students])

  useEffect(() => {
    const loadCSVData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/student_info-Oo9xIxxKUEWLsxpw27UlBW2dD40FSn.csv"
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const csvText = await response.text()
        parseAndSetData(csvText)
      } catch (error) {
        console.error("Erro ao buscar CSV:", error)
        setError("Não foi possível carregar os dados. Verifique a conexão.")
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
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
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
                        filteredStudents.reduce((sum, student) => sum + student.math_score, 0) /
                        filteredStudents.length
                      ).toFixed(1)
                    : "0.0"}
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
                    ? `${(
                        (filteredStudents.filter((s) => s.final_result === "Pass").length /
                          filteredStudents.length) *
                        100
                      ).toFixed(1)}%`
                    : "0.0%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? "Carregando..." : "Dos alunos filtrados"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média de Frequência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredStudents.length > 0
                    ? `${(
                        filteredStudents.reduce((sum, student) => sum + student.attendance_rate, 0) /
                        filteredStudents.length
                      ).toFixed(2)}%`
                    : "0.00%"}
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
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    Carregando...
                  </div>
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