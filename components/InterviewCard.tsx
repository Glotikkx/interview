import { getRandomInterviewCover } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({ id, userId, role, type, techstack, createdAt }: InterviewCardProps) => {
    const feedback = userId && id
    ? await getFeedbackByInterviewId({ interviewId: id, userId })
    : null;
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("DD/MM/YYYY");

    return (
        <div className="w-[500px] max-sm:w-full min-h-96 p-6 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 shadow-sm">
            <div className="relative h-full flex flex-col gap-4">
                {/* Type Badge */}
                <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-blue-100 dark:bg-blue-900">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">{normalizedType}</p>
                </div>

                {/* Header with Image and Role */}
                <div className="flex flex-col items-center pt-8 gap-3">
                    <Image
                        src={getRandomInterviewCover()}
                        alt="cover image"
                        width={90}
                        height={90}
                        className="rounded-full object-cover size-[90px] border-2 border-white dark:border-gray-600 shadow"
                    />
                    <h3 className="text-xl font-semibold capitalize text-gray-800 dark:text-white">{role} Interview</h3>
                </div>

                {/* Date and Score */}
                <div className="flex items-center justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Image src="/calendar.svg" alt="calendar" width={18} height={18} className="dark:invert" />
                        <p className="text-sm">{formattedDate}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Image src="/star.svg" alt="star" width={18} height={18} className="dark:invert" />
                        <p className="text-sm">{feedback?.totalScore || "---"}/100</p>
                    </div>
                </div>

                {/* Feedback Text */}
                <p className="line-clamp-2 text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
                    {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to get feedback"}
                </p>

                {/* Tech Icons and Button */}
                <div className="mt-auto flex justify-between items-center">
                    <DisplayTechIcons techStack={techstack} />
                    <Button asChild className="bg-grey hover:bg-blue-700 text-white">
                        <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>
                            {feedback ? "Check Feedback" : "View Interview"}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;