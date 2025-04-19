import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const addStudent = async (req, res) => {
  const { name, phoneNumber, email, matricNumber, department} = req.body;

  try {
    const student = await prisma.student.create({
      data:{
        name,
        department,
        email,
        phoneNumber,
        matricNumber
      }
    });

   
    if (student) {
      return res.status(401).json({
        success: false,
        message: "Student already exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student added succesfully",
      data: student
    });
  } catch (error) {
    console.error("adding studen error:", error);
    res.status(500).json({ message: "Error adding student", error });
  }
};

