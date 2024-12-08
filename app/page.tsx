import StudentJuryDashboard from '@/components/student-jury-dashboard'
import { Student } from '@/types/dashboard'

const studentNames = [
  "Aditi Gopal Hedau",
  "Aditi Soni",
  "Amito Kamble",
  "Anchal Gupta",
  "Anish Arun Deshmukh",
  "Anna Christina Francis",
  "Anushka Gupta",
  "Anushka Shrivastava",
  "Arshi Khan",
  "Bhagesh Khongal",
  "Chahat Agarwal",
  "Dipesh Kumar",
  "Harsh Tripathi",
  "Insha Rashid",
  "Jay Bharat Kadam",
  "Kanika Thakur",
  "Kartik Diwakar Durge",
  "Krishna Agrawal",
  "Kunal Naidu",
  "Mansi Prabha",
  "Parth Nigam",
  "Pratham Sonar",
  "Preyanshi Shrivastava",
  "Radhika Udainia",
  "Rishika Goyal",
  "Ritika Singhal",
  "Saanvi Raje",
  "Shambhavi Vishal Kirtankar",
  "Shivraj Ranjeet Inamdar",
  "Sneha Natani",
  "Soumya Singh",
  "Sufal Joshi",
  "Suhani Tongya",
  "Tanishka Sharma",
  "Tanu Yadav",
  "Yash Sanjay Nandve",
  "Yashika Manglani"
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
