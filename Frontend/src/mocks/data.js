// Mock data for the gym owner app

export const mockMembers = [
  {
    id: "m1",
    firstName: "Rahul",
    lastName: "Verma", 
    email: "rahul@example.com",
    phone: "9876543210",
    age: 28,
    gender: "Male",
    joinedAt: "2025-09-01",
    plan: "Monthly"
  },
  {
    id: "m2",
    firstName: "Ananya",
    lastName: "Kumar",
    email: "ananya@example.com", 
    phone: "9123456780",
    age: 24,
    gender: "Female",
    joinedAt: "2025-08-15",
    plan: "Quarterly"
  },
  {
    id: "m3",
    firstName: "Vikram",
    lastName: "Singh",
    email: "vikram@example.com",
    phone: "9988776655", 
    age: 32,
    gender: "Male",
    joinedAt: "2025-07-10",
    plan: "Yearly"
  },
  {
    id: "m4",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya@example.com",
    phone: "9876547890",
    age: 26,
    gender: "Female", 
    joinedAt: "2025-08-20",
    plan: "Monthly"
  },
  {
    id: "m5",
    firstName: "Arjun",
    lastName: "Patel",
    email: "arjun@example.com",
    phone: "9123458760",
    age: 30,
    gender: "Male",
    joinedAt: "2025-06-15", 
    plan: "Yearly"
  }
];

export const mockExercises = [
  {
    id: "e1",
    name: "Bench Press",
    muscleGroup: "Chest",
    equipment: "Barbell", 
    description: "Barbell bench press for chest development"
  },
  {
    id: "e2", 
    name: "Squat",
    muscleGroup: "Legs",
    equipment: "Barbell",
    description: "Back squat for leg strength"
  },
  {
    id: "e3",
    name: "Lat Pulldown", 
    muscleGroup: "Back",
    equipment: "Machine",
    description: "Pulldown for lats and upper back"
  },
  {
    id: "e4",
    name: "Shoulder Press",
    muscleGroup: "Shoulders",
    equipment: "Dumbbell",
    description: "Overhead press for shoulder development"
  },
  {
    id: "e5",
    name: "Deadlift",
    muscleGroup: "Back", 
    equipment: "Barbell",
    description: "Compound movement for posterior chain"
  },
  {
    id: "e6",
    name: "Pull-ups",
    muscleGroup: "Back",
    equipment: "Bodyweight",
    description: "Bodyweight pulling exercise"
  }
];

export const mockRoutines = [
  {
    id: "r1",
    memberId: "m1", 
    name: "Strength - Week A",
    days: {
      "Monday": [
        { exerciseId: "e1", sets: 4, reps: 8 },
        { exerciseId: "e2", sets: 3, reps: 10 }
      ],
      "Wednesday": [
        { exerciseId: "e3", sets: 3, reps: 10 },
        { exerciseId: "e4", sets: 4, reps: 8 }
      ],
      "Friday": [
        { exerciseId: "e5", sets: 3, reps: 5 }
      ]
    }
  },
  {
    id: "r2", 
    memberId: "m2",
    name: "Hypertrophy Program",
    days: {
      "Tuesday": [
        { exerciseId: "e1", sets: 4, reps: 12 },
        { exerciseId: "e4", sets: 3, reps: 15 }
      ],
      "Thursday": [
        { exerciseId: "e2", sets: 4, reps: 12 },
        { exerciseId: "e3", sets: 3, reps: 12 }
      ]
    }
  }
];

export const mockOwner = {
  id: "owner1",
  name: "Fitness Pro Gym",
  email: "owner@fitnesspro.com"
};