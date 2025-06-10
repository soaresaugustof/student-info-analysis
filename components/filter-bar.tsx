"use client"

import type React from "react"

import { useState } from "react"
import { Check, ChevronsUpDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { StudentData, FilterState } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface FilterBarProps {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  data: StudentData[]
}

export function FilterBar({ filters, setFilters, data }: FilterBarProps) {
  const [openGender, setOpenGender] = useState(false)
  const [openGrade, setOpenGrade] = useState(false)
  const [openResult, setOpenResult] = useState(false)
  const [openEducation, setOpenEducation] = useState(false)

  // Extract unique values from data
  const genders = ["all", ...new Set(data.map((item) => item.gender))].filter(Boolean)
  const gradeLevels = ["all", ...new Set(data.map((item) => item.grade_level.toString()))].filter(Boolean)
  const results = ["all", ...new Set(data.map((item) => item.final_result))].filter(Boolean)
  const educationLevels = ["all", ...new Set(data.map((item) => item.parent_education))].filter(Boolean)

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "all").length

  const clearFilters = () => {
    setFilters({
      gender: "all",
      gradeLevel: "all",
      finalResult: "all",
      parentEducation: "all",
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <div className="flex items-center gap-1.5">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filtros:</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="rounded-sm px-1 font-normal">
            {activeFiltersCount}
          </Badge>
        )}
      </div>

      <Popover open={openGender} onOpenChange={setOpenGender}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openGender}
            className="justify-between text-sm"
            size="sm"
          >
            {filters.gender === "all" ? "Gênero" : `Gênero: ${filters.gender}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar gênero..." />
            <CommandList>
              <CommandEmpty>Nenhum gênero encontrado.</CommandEmpty>
              <CommandGroup>
                {genders.map((gender) => (
                  <CommandItem
                    key={gender}
                    value={gender}
                    onSelect={(currentValue) => {
                      setFilters((prev) => ({ ...prev, gender: currentValue === "all" ? "all" : currentValue }))
                      setOpenGender(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", filters.gender === gender ? "opacity-100" : "opacity-0")} />
                    {gender === "all" ? "Todos" : gender}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openGrade} onOpenChange={setOpenGrade}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openGrade}
            className="justify-between text-sm"
            size="sm"
          >
            {filters.gradeLevel === "all" ? "Série" : `Série: ${filters.gradeLevel}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar série..." />
            <CommandList>
              <CommandEmpty>Nenhuma série encontrada.</CommandEmpty>
              <CommandGroup>
                {gradeLevels.map((grade) => (
                  <CommandItem
                    key={grade}
                    value={grade}
                    onSelect={(currentValue) => {
                      setFilters((prev) => ({ ...prev, gradeLevel: currentValue === "all" ? "all" : currentValue }))
                      setOpenGrade(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", filters.gradeLevel === grade ? "opacity-100" : "opacity-0")} />
                    {grade === "all" ? "Todas" : grade}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openResult} onOpenChange={setOpenResult}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openResult}
            className="justify-between text-sm"
            size="sm"
          >
            {filters.finalResult === "all" ? "Resultado" : `Resultado: ${filters.finalResult}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar resultado..." />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup>
                {results.map((result) => (
                  <CommandItem
                    key={result}
                    value={result}
                    onSelect={(currentValue) => {
                      setFilters((prev) => ({ ...prev, finalResult: currentValue === "all" ? "all" : currentValue }))
                      setOpenResult(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", filters.finalResult === result ? "opacity-100" : "opacity-0")}
                    />
                    {result === "all" ? "Todos" : result}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openEducation} onOpenChange={setOpenEducation}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openEducation}
            className="justify-between text-sm"
            size="sm"
          >
            {filters.parentEducation === "all" ? "Educação dos Pais" : `Educação: ${filters.parentEducation}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar nível educacional..." />
            <CommandList>
              <CommandEmpty>Nenhum nível encontrado.</CommandEmpty>
              <CommandGroup>
                {educationLevels.map((level) => (
                  <CommandItem
                    key={level}
                    value={level}
                    onSelect={(currentValue) => {
                      setFilters((prev) => ({ ...prev, parentEducation: currentValue === "all" ? "all" : currentValue }))
                      setOpenEducation(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", filters.parentEducation === level ? "opacity-100" : "opacity-0")}
                    />
                    {level === "all" ? "Todos" : level}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {activeFiltersCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
          Limpar filtros
        </Button>
      )}
    </div>
  )
}