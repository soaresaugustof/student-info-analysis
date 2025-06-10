"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Upload } from "lucide-react"
import { useRef } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardHeaderProps {
  title: string
  description: string
  onFileUpload: (file: File) => void
}

export function DashboardHeader({ title, description, onFileUpload }: DashboardHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handleExportData = () => {
    // Implementação da exportação de dados
    alert("Funcionalidade de exportação será implementada")
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Importar CSV
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportData}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>
    </div>
  )
}
