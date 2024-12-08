import StudentJuryDashboard from '@/components/student-jury-dashboard'
import { Student } from '@/types/dashboard'

const studentNames = [
  "Radhika Udainia",
  "Preyanshi Shrivastava", 
  "Kanika Thakur",
  "Yash Sanjay Nandve",
  "Kartik Diwakar Durge",
  "Chahat Agarwal",
  "Kunal Naidu",
  "Aditi Soni",
  "Anushka Shrivastava",
  "Rishika Goyal",
  "Tanu Yadav",
  "Soumya Singh",
  "Sneha Natani",
  "Tanishka Sharma", 
  "Arshi Khan",
  "Ritika Singhal",
  "Suhani Tongya",
  "Anish Arun Deshmukh",
  "Shivraj Ranjeet Inamdar",
  "Jay Bharat Kadam",
  "Dipesh Kumar",
  "Mansi Prabha",
  "Shambhavi Vishal Kirtankar", 
  "Saanvi Raje",
  "Yashika Manglani",
  "Bhagesh Khongal",
  "Anchal Gupta",
  "Aditi Gopal Hedau",
  "Amito Kamble",
  "Pratham Sonar",
  "Harsh Tripathi",
  "Anna Christina Francis",
  "Insha Rashid"
]

const students: Student[] = studentNames.map((name, index) => ({
  id: index + 1,
  name,
  uiDesign: 0,
  userResearch: 0,
  prototype: 0,
  kitKatPoints: 0,
  total: 0,
  comment: ''
}))

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <StudentJuryDashboard students={students} />
    </main>
  )
}
