'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, ArrowUpDown, MessageSquare, X, Candy } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import { Student, DashboardProps } from '../types/dashboard'
import { motion, AnimatePresence } from 'framer-motion'
import { getMarks, updateMarks as updateStudentMarks } from '@/lib/marks'

export default function StudentJuryDashboard({ students }: DashboardProps) {
  const [studentData, setStudentData] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'ascending' | 'descending' } | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'marked' | 'unmarked'>('all')
  const [commentPopoverOpen, setCommentPopoverOpen] = useState<number | null>(null)

  // TipTap editor setup
  const editor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: 500 })],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-full min-h-[100px] p-2',
      },
    },
  })

  useEffect(() => {
    if (selectedStudent && commentPopoverOpen === selectedStudent.id) {
      editor?.commands.setContent(selectedStudent.comment)
    }
  }, [selectedStudent, commentPopoverOpen, editor])

  // Initialize student data
  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const savedMarks = await getMarks();
        const initialData = students.map((name, index) => {
          const kitKatPoints = getInitialKitKatPoints(name);
          const savedStudentData = savedMarks[`student-${index + 1}`] || {};
          return {
            id: index + 1,
            name,
            uiDesign: savedStudentData.uiDesign || 0,
            userResearch: savedStudentData.userResearch || 0,
            prototype: savedStudentData.prototype || 0,
            kitKatPoints,
            total: savedStudentData.total || (kitKatPoints * 10),
            comment: savedStudentData.comment || '',
            lastModified: savedStudentData.lastModified || new Date().toISOString()
          }
        });
        setStudentData(initialData);
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch saved marks",
          variant: "destructive",
        });
      }
    };
    fetchMarks();
  }, [students]);

  const getInitialKitKatPoints = (name: string): number => {
    const kitKatMap: { [key: string]: number } = {
      "Amito Kamble": 1,
      "Anchal Gupta": 2,
      "Anushka Shrivastava": 3,
      "Bhagesh Khongal": 1,
      "Chahat Agarwal": 2,
      "Kartik Diwakar Durge": 3,
      "Kunal Naidu": 1,
      "Suhani Tongya": 2
    }
    return kitKatMap[name] || 0
  }

  const updateMarks = useCallback(async (id: number, field: 'uiDesign' | 'userResearch' | 'prototype', value: number) => {
    setStudentData(prevData => {
      const newData = prevData.map(student => {
        if (student.id === id) {
          const maxMarks = field === 'uiDesign' ? 50 : field === 'userResearch' ? 30 : 20;
          const newValue = Math.min(Math.max(0, value), maxMarks);
          if (value > maxMarks) {
            toast({
              title: "Warning",
              description: `Maximum marks for ${field} is ${maxMarks}`,
              variant: "destructive",
            });
          }
          const updatedStudent = { 
            ...student, 
            [field]: newValue,
            lastModified: new Date().toISOString()
          };
          const finalStudent = {
            ...updatedStudent,
            total: calculateTotal(updatedStudent)
          };
          
          // Save to backend
          updateStudentMarks(`student-${id}`, {
            ...finalStudent,
            kitKatPoints: student.kitKatPoints
          }).catch(() => {
            toast({
              title: "Error",
              description: "Failed to save marks",
              variant: "destructive",
            });
          });
          
          return finalStudent;
        }
        return student;
      });
      return newData;
    });
  }, []);

  const updateComment = useCallback((id: number, comment: string) => {
    setStudentData(prevData =>
      prevData.map(student =>
        student.id === id ? { ...student, comment, lastModified: new Date().toISOString() } : student
      )
    )
  }, [])

  const calculateTotal = (student: Student) => {
    return student.uiDesign + student.userResearch + student.prototype + (student.kitKatPoints * 10)
  }

  const getFilteredData = () => {
    let filtered = studentData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    switch (filterStatus) {
      case 'marked':
        filtered = filtered.filter(student => student.total > student.kitKatPoints * 10)
        break
      case 'unmarked':
        filtered = filtered.filter(student => student.total === student.kitKatPoints * 10)
        break
    }

    return filtered
  }

  const stats = useMemo(() => {
    const data = studentData
    return {
      totalStudents: data.length,
      markedStudents: data.filter(s => s.total > s.kitKatPoints * 10).length,
      averageScore: (data.reduce((acc, s) => acc + s.total, 0) / data.length).toFixed(1)
    }
  }, [studentData])

  const requestSort = (key: keyof Student) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 space-y-8 bg-gray-50 min-h-screen"
    >
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Interface Design Advance Jury</h1>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Marked Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{stats.markedStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{stats.averageScore}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter: {filterStatus}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Students</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('marked')}>Marked</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('unmarked')}>Unmarked</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Table */}
      <div className="rounded-lg border overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] font-semibold">ID</TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center space-x-2">
                  <span>Name</span>
                  <ArrowUpDown 
                    className="h-4 w-4 cursor-pointer" 
                    onClick={() => requestSort('name')}
                  />
                </div>
              </TableHead>
              <TableHead className="font-semibold">UI Design (50)</TableHead>
              <TableHead className="font-semibold">Research (30)</TableHead>
              <TableHead className="font-semibold">Prototype (20)</TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center space-x-2">
                  <span>Total</span>
                  <ArrowUpDown 
                    className="h-4 w-4 cursor-pointer" 
                    onClick={() => requestSort('total')}
                  />
                </div>
              </TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {getFilteredData().map((student) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50"
                >
                  <TableCell>{student.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{student.name}</span>
                      {Array.from({ length: student.kitKatPoints }).map((_, index) => (
                        <Candy key={index} className="h-4 w-4 text-pink-500" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0"
                      value={student.uiDesign || ''}
                      onChange={(e) => updateMarks(student.id, 'uiDesign', Number(e.target.value))}
                      onFocus={(e) => e.target.placeholder = ''}
                      onBlur={(e) => e.target.placeholder = '0'}
                      className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0"
                      value={student.userResearch || ''}
                      onChange={(e) => updateMarks(student.id, 'userResearch', Number(e.target.value))}
                      onFocus={(e) => e.target.placeholder = ''}
                      onBlur={(e) => e.target.placeholder = '0'}
                      className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0"
                      value={student.prototype || ''}
                      onChange={(e) => updateMarks(student.id, 'prototype', Number(e.target.value))}
                      onFocus={(e) => e.target.placeholder = ''}
                      onBlur={(e) => e.target.placeholder = '0'}
                      className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.total >= 80 ? 'success' : student.total >= 60 ? 'warning' : 'destructive'}>
                      {student.total}/100
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Popover open={commentPopoverOpen === student.id} onOpenChange={(open) => {
                        setCommentPopoverOpen(open ? student.id : null)
                        if (open) {
                          setSelectedStudent(student)
                          editor?.commands.setContent(student.comment)
                        }
                      }}>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className={student.comment ? 'text-blue-500 hover:text-blue-600' : 'hover:text-gray-600'}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0">
                          <div className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-lg">Comment for {student.name}</h4>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setCommentPopoverOpen(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="border rounded-md p-2">
                              <EditorContent editor={editor} />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {editor?.storage.characterCount.characters()} / 500 characters
                              </span>
                              <Button 
                                onClick={() => {
                                  if (editor && selectedStudent) {
                                    const content = editor.getHTML();
                                    if (content.length <= 500) {
                                      updateComment(selectedStudent.id, content);
                                      setCommentPopoverOpen(null);
                                      toast({
                                        title: "Comment saved",
                                        description: "Your comment has been successfully saved.",
                                      });
                                    } else {
                                      toast({
                                        title: "Comment too long",
                                        description: "Please limit your comment to 500 characters.",
                                        variant: "destructive",
                                      });
                                    }
                                  }
                                }}
                              >
                                Save Comment
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}
