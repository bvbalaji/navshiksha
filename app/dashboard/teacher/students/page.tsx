import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, MoreHorizontal, Plus, Search, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export default function StudentsPage() {
  const students = [
    {
      id: 1,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      courses: 3,
      progress: "At Risk",
      lastActive: "2 hours ago",
      performance: "declining",
    },
    {
      id: 2,
      name: "Emma Thompson",
      email: "emma.thompson@example.com",
      courses: 2,
      progress: "On Track",
      lastActive: "1 day ago",
      performance: "improving",
    },
    {
      id: 3,
      name: "James Wilson",
      email: "james.wilson@example.com",
      courses: 4,
      progress: "Ahead",
      lastActive: "3 hours ago",
      performance: "improving",
    },
    {
      id: 4,
      name: "Sophia Garcia",
      email: "sophia.garcia@example.com",
      courses: 3,
      progress: "On Track",
      lastActive: "5 hours ago",
      performance: "stable",
    },
    {
      id: 5,
      name: "Liam Johnson",
      email: "liam.johnson@example.com",
      courses: 2,
      progress: "At Risk",
      lastActive: "2 days ago",
      performance: "declining",
    },
    {
      id: 6,
      name: "Olivia Brown",
      email: "olivia.brown@example.com",
      courses: 3,
      progress: "On Track",
      lastActive: "1 hour ago",
      performance: "stable",
    },
    {
      id: 7,
      name: "Noah Davis",
      email: "noah.davis@example.com",
      courses: 4,
      progress: "Ahead",
      lastActive: "4 hours ago",
      performance: "improving",
    },
    {
      id: 8,
      name: "Ava Miller",
      email: "ava.miller@example.com",
      courses: 2,
      progress: "On Track",
      lastActive: "6 hours ago",
      performance: "stable",
    },
  ]

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-gray-500">Manage and monitor your students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Student Overview</CardTitle>
          <CardDescription>Quick stats about your students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">128</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-500">Average Engagement</p>
              <p className="text-2xl font-bold">76%</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-500">At-Risk Students</p>
              <p className="text-2xl font-bold">18</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input placeholder="Search students..." className="flex-1" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/teacher/students/${student.id}`} className="hover:underline">
                      {student.name}
                    </Link>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.courses}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        student.progress === "At Risk"
                          ? "bg-red-100 text-red-800"
                          : student.progress === "Ahead"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {student.progress}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {student.performance === "improving" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : student.performance === "declining" ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <span className="inline-block h-4 w-4 rounded-full bg-blue-500" />
                      )}
                      <span className="capitalize">{student.performance}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Progress</DropdownMenuItem>
                        <DropdownMenuItem>Generate Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

