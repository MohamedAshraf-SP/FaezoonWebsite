import Teacher from "./../models/teachers.js"; // Import the Teacher model




// Get a teacher by ID
export const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ role: 'user' });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new teacher
export const addTeacher = async (req, res) => {
  try {
    //console.log(req);
    const newTeacher = new Teacher({
      userName: req.body.userName,
      password: req.body.password,
      role: req.body.role,
      firstName: req.body.firstName,
      userName: req.body.userName,
      password: req.body.password,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      age: req.body.age,
      phone: req.body.phone,
      phone2: req.body.phone2,
      classID: req.body.classID,
      birthDay: req.body.birthDay,
      nationality: req.body.nationality,
      address: req.body.address,
    });

    const ans = await newTeacher.save();

    res.status(201).json(ans.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a teacher by ID
export const deleteTeacher = async (req, res) => {
  try {
    const result = await Teacher.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a teacher by ID
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you use ID to find the teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get the number of teachers
export const getTeachersCount = async (req, res) => {
  try {
    const count = await Teacher.countDocuments() - 1;
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
