import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { StudentData } from "@/lib/types"

interface RecentStudentsProps {
  data: StudentData[]
}

export function RecentStudents({ data }: RecentStudentsProps) {
  return (
    <div className="space-y-8">
      {data.length === 0 ? (
        <div className="text-center text-muted-foreground py-6">Nenhum aluno encontrado</div>
      ) : (
        data.map((student) => (
          <div className="flex items-center" key={student.student_id}>
            <Avatar className="h-9 w-9">
              <AvatarFallback>{student.name?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{student.name}</p>
              <p className="text-sm text-muted-foreground">
                Série: {student.grade_level} | Média:{" "}
                {((student.math_score + student.reading_score + student.writing_score) / 3).toFixed(1)}
              </p>
            </div>
            <div className="ml-auto font-medium">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  student.final_result === "Pass" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {student.final_result}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}