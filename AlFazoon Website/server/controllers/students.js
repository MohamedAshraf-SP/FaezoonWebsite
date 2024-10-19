
import Student from './../models/students.js'; // Import the Student model



// Search student by ID
export const getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all students
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new student
export const addStudent = async (req, res) => {
    try {


        // const teacher = await Teacher.findOne({ teacherID: req.body.teacherID });
        // if (!teacher) {
        //     throw new Error('Teacher not found');
        // }
        //encrypt password

        // let cryptedPassword = req.body.password  
        const newStudent = new Student({
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            age: req.body.age,
            whatsapp: req.body.whatsapp,
            phone: req.body.phone,
            TeacherName: req.body.TeacherName,
            birthDay: req.body.birthDay,
            nationality: req.body.nationality,
            address: req.body.address,
            ClassNum: req.body.ClassNum,
        });



        await newStudent.save();
        res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update student by ID
export const updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete student by ID
export const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get the number of students today
export const getTodaysStudentCount = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const count = await Student.countDocuments({
            createdAt: { $gte: startOfDay, $lt: endOfDay }
        });

        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get the total number of students
export const getTotalStudentCount = async (req, res) => {
    try {
        const count = await Student.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
