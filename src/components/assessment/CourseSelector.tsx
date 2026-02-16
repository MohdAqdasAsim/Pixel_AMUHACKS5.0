import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

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
}

const CourseSelector = ({ courses, onSelectCourse }: CourseSelectorProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20 whitespace-nowrap">
            <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="hidden sm:inline">Completed</span>
            <span className="sm:hidden">Done</span>
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20 whitespace-nowrap">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="hidden sm:inline">In Progress</span>
            <span className="sm:hidden">Active</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/20 whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            Pending
          </span>
        );
    }
  };

  if (courses.length === 0) {
    return (
      <div className="bg-linear-to-br from-[#242833] to-[#1a1f2e] border border-gray-700/60 rounded-xl p-8 sm:p-12 text-center">
        <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
          No courses found
        </h3>
        <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-md mx-auto">
          Add courses from the Courses page to start taking assessments
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 min-w-0 w-full">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#028CC0] shrink-0" />
        <span className="truncate">Your Courses</span>
      </h2>

      <div className="grid gap-3 sm:gap-4 w-full">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => onSelectCourse(course)}
            className="bg-linear-to-br from-[#242833] to-[#1a1f2e] border border-gray-700/60 rounded-xl p-4 sm:p-6 hover:border-[#028CC0]/50 hover:shadow-lg hover:shadow-[#028CC0]/10 transition-all duration-200 group cursor-pointer relative min-w-0"
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4 min-w-0">
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="bg-linear-to-br from-[#028CC0]/20 to-[#0279A6]/20 p-2 sm:p-3 rounded-lg group-hover:from-[#028CC0]/30 group-hover:to-[#0279A6]/30 transition-all border border-[#028CC0]/30 shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#028CC0]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#028CC0] transition-colors truncate">
                      {course.name}
                    </h3>
                    {getStatusBadge(course.status)}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-400">
                    {course.lastAssessed && (
                      <span className="flex items-center gap-1.5 min-w-0">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate">
                          <span className="hidden sm:inline">
                            Last assessed:{" "}
                          </span>
                          {new Date(course.lastAssessed).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year:
                                window.innerWidth >= 640
                                  ? "numeric"
                                  : "2-digit",
                            },
                          )}
                        </span>
                      </span>
                    )}
                    {course.skillGapsCount > 0 && (
                      <span className="flex items-center gap-1.5 text-yellow-400 min-w-0">
                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate">
                          {course.skillGapsCount} skill gap
                          {course.skillGapsCount !== 1 ? "s" : ""}
                          <span className="hidden sm:inline"> identified</span>
                        </span>
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
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.completionRate}%` }}
                          transition={{
                            duration: 0.6,
                            delay: index * 0.05 + 0.2,
                          }}
                          className="h-full bg-linear-to-r from-[#028CC0] to-[#0279A6]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-1 sm:gap-2 shrink-0">
                <div className="p-2 hover:bg-[#2B303B] rounded-lg transition-colors group/arrow">
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover/arrow:text-[#028CC0] group-hover/arrow:translate-x-1 transition-all" />
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
