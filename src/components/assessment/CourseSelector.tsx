import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";

interface Course {
  id: string;
  name: string;
  lastAssessed?: Date;
  nextAssessment?: Date;
  status: "pending" | "in-progress" | "completed";
  skillGapsCount: number;
  completionRate: number;
}

interface CourseSelectorProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
}

const CourseSelector = ({
  courses,
  onSelectCourse,
  onEditCourse,
  onDeleteCourse,
}: CourseSelectorProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  if (courses.length === 0) {
    return (
      <div className="bg-linear-to-br from-[#242833] to-[#1a1f2e] border border-gray-700/60 rounded-xl p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          No courses found
        </h3>
        <p className="text-gray-400 mb-6">
          Add courses to start taking assessments and tracking your progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-[#028CC0]" />
        Your Courses
      </h2>

      <div className="grid gap-4">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-linear-to-br from-[#242833] to-[#1a1f2e] border border-gray-700/60 rounded-xl p-6 hover:border-[#028CC0]/50 hover:shadow-lg hover:shadow-[#028CC0]/10 transition-all duration-200 group relative"
          >
            <div className="flex items-center justify-between">
              <div
                onClick={() => onSelectCourse(course)}
                className="flex items-start gap-4 flex-1 cursor-pointer"
              >
                <div className="bg-linear-to-br from-[#028CC0]/20 to-[#0279A6]/20 p-3 rounded-lg group-hover:from-[#028CC0]/30 group-hover:to-[#0279A6]/30 transition-all border border-[#028CC0]/30">
                  <BookOpen className="w-6 h-6 text-[#028CC0]" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#028CC0] transition-colors">
                      {course.name}
                    </h3>
                    {getStatusBadge(course.status)}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    {course.lastAssessed && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        Last assessed:{" "}
                        {new Date(course.lastAssessed).toLocaleDateString()}
                      </span>
                    )}
                    {course.skillGapsCount > 0 && (
                      <span className="flex items-center gap-1.5 text-yellow-400">
                        <AlertTriangle className="w-4 h-4" />
                        {course.skillGapsCount} skill gaps identified
                      </span>
                    )}
                  </div>

                  {course.completionRate > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">
                          {course.completionRate}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#2B303B] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-[#028CC0] to-[#0279A6] transition-all duration-300"
                          style={{ width: `${course.completionRate}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <ArrowRight
                  onClick={() => onSelectCourse(course)}
                  className="w-5 h-5 text-gray-600 group-hover:text-[#028CC0] group-hover:translate-x-1 transition-all cursor-pointer"
                />

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(
                        activeMenu === course.id ? null : course.id,
                      );
                    }}
                    className="p-2 hover:bg-[#2B303B] rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>

                  {activeMenu === course.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#2B303B] border border-gray-700/60 rounded-xl shadow-xl py-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCourse(course);
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#353A47] transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Course
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCourse(course);
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Course
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourseSelector;
