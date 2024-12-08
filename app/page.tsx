import StudentJuryDashboard from '@/components/student-jury-dashboard'

const students = [
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

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <StudentJuryDashboard students={students} />
    </main>
  )
}

