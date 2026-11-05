import type { Metadata } from "next";

import { AssignedExamScreen } from "@/components/app/assigned-exam";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Exam",
    description: "An exam your teacher has assigned to you.",
    path: "/dashboard/exam",
  }),
  // Personal to the signed-in learner, like the dashboard it belongs to.
  robots: { index: false, follow: false },
};

export default function AssignedExamPage() {
  return <AssignedExamScreen />;
}
