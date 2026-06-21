import type { Metadata } from "next";
import { QuizClient } from "@/components/quiz/QuizClient";
import { JsonLd, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Find Your Watch",
  description:
    "Seven questions, one honest recommendation. Tell us how you train and what you'll spend, and we'll name the real watches worth your money — mechanical or GPS.",
  openGraph: {
    title: "Find Your Watch — The Long Second",
    description:
      "A short, honest diagnostic. Real watch recommendations at your budget, for your sport.",
    type: "website",
  },
};

export default function FindYourWatchPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Find Your Watch", path: "/find-your-watch" },
        ])}
      />
      <QuizClient />
    </>
  );
}
