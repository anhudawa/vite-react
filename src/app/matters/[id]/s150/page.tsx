"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useDb } from "@/lib/store/store";
import { renderTemplate } from "@/lib/domain/templates";
import { formatDate, formatDateTime } from "@/lib/domain/dates";
import { Button } from "@/components/ui";

/**
 * Section 150 notice — rendered from the versioned SECTION_150 template.
 * The shipped template body is placeholder content pending owner drafting
 * and approval (handover §9.1); the engine renders whatever the approved
 * template says.
 */
export default function Section150Page() {
  const db = useDb();
  const { id } = useParams<{ id: string }>();
  const matter = db.matters.find((m) => m.id === id);
  if (!matter) return <p className="text-sm text-gray-500">Matter not found.</p>;
  const firm = db.firms.find((f) => f.id === matter.firmId);
  const template = db.templates.find((t) => t.kind === "SECTION_150");

  const fields = {
    barrister_name: db.profile.fullName || "[Barrister name]",
    barrister_email: db.profile.email,
    law_library_no: db.profile.lawLibraryNo || "[Law Library No.]",
    firm_name: firm?.name ?? "[Instructing firm]",
    matter_title: matter.title,
    matter_reference: matter.reference || "—",
    today: formatDate(new Date().toISOString()),
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="no-print mb-4 flex items-center justify-between">
        <Link href="/matters" className="text-sm text-brand underline">
          ← Back to matters
        </Link>
        <Button onClick={() => window.print()}>Print / save as PDF</Button>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-10 text-sm leading-relaxed">
        <h1 className="text-base font-semibold">
          {template ? renderTemplate(template.subject, fields) : "Section 150 notice"}
        </h1>
        {matter.section150 && (
          <p className="mt-1 text-xs text-gray-500">
            Issued {formatDateTime(matter.section150.issuedAt)}
            {matter.section150.deliveryConfirmedAt &&
              ` · delivery confirmed ${formatDateTime(matter.section150.deliveryConfirmedAt)}`}
          </p>
        )}
        <pre className="mt-6 whitespace-pre-wrap font-sans">
          {template ? renderTemplate(template.body, fields) : "No SECTION_150 template found."}
        </pre>
        {template && (
          <p className="mt-8 text-[11px] text-gray-400">
            Rendered from template “{template.name}” v{template.version}.
          </p>
        )}
      </div>
    </div>
  );
}
