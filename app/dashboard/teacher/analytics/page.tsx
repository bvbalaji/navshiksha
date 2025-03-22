import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500">Track student performance and engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B (85%)</div>
            <p className="text-xs text-gray-500">+2% from last semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-gray-500">-3% from last semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2/10</div>
            <p className="text-xs text-gray-500">+0.5 from last semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 (14%)</div>
            <p className="text-xs text-gray-500">-2 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="performance">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Performance</CardTitle>
                    <CardDescription>Grade distribution across courses</CardDescription>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="algebra">Algebra Fundamentals</SelectItem>
                      <SelectItem value="geometry">Introduction to Geometry</SelectItem>
                      <SelectItem value="statistics">Basic Statistics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full rounded-lg bg-muted p-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Performance chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Engagement</CardTitle>
                    <CardDescription>Activity and participation metrics</CardDescription>
                  </div>
                  <Select defaultValue="week">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="semester">This Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full rounded-lg bg-muted p-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Engagement chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Learning Progress</CardTitle>
                    <CardDescription>Course completion and milestone tracking</CardDescription>
                  </div>
                  <Select defaultValue="all-students">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select student group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-students">All Students</SelectItem>
                      <SelectItem value="at-risk">At-Risk Students</SelectItem>
                      <SelectItem value="advanced">Advanced Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full rounded-lg bg-muted p-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Progress chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Comparison</CardTitle>
            <CardDescription>Performance metrics across different courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Algebra Fundamentals</span>
                  <span className="font-medium">B (83%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: "83%" }}></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Introduction to Geometry</span>
                  <span className="font-medium">B- (80%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Basic Statistics</span>
                  <span className="font-medium">A- (92%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-purple-500" style={{ width: "92%" }}></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Advanced Calculus</span>
                  <span className="font-medium">B+ (87%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: "87%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Outcomes</CardTitle>
            <CardDescription>Achievement of key learning objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Problem Solving</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: "78%" }}></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Critical Thinking</span>
                  <span className="font-medium">82%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "82%" }}></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Concept Application</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-purple-500" style={{ width: "85%" }}></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Communication</span>
                  <span className="font-medium">76%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: "76%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

