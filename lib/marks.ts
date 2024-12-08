export type Marks = {
  [key: string]: number;
};

export async function getMarks() {
  const response = await fetch('/api/marks');
  if (!response.ok) {
    throw new Error('Failed to fetch marks');
  }
  return response.json();
}

export async function saveMarks(studentId: string, marks: number) {
  const response = await fetch('/api/marks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentId, marks }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save marks');
  }
  return response.json();
}

export async function updateMarks(studentId: string, marks: number) {
  const response = await fetch('/api/marks', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentId, marks }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update marks');
  }
  return response.json();
}
